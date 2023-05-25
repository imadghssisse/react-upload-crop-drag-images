import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import '../../public/index.css';
import FlipMove from 'react-flip-move';
import UploadIcon from '../../public/UploadIcon.svg';
import Crop from './crop.js';
import EditSvg from '../../public/EditSvg.svg';
const styles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%"
};
const ERROR = {
    NOT_SUPPORTED_EXTENSION: 'NOT_SUPPORTED_EXTENSION',
    FILESIZE_TOO_LARGE: 'FILESIZE_TOO_LARGE'
};
class ImageUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: [...props.defaultImages],
            files: [],
            fileErrors: [],
        };
        this.inputElement = '';
        this.onDropFile = this.onDropFile.bind(this);
        this.onUploadClick = this.onUploadClick.bind(this);
        this.triggerFileUpload = this.triggerFileUpload.bind(this);
        this.childRef = React.createRef();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.files !== this.state.files) {
            this.props.onChange(this.state.files, this.state.pictures);
        }
        if (prevProps.defaultImages !== this.props.defaultImages) {
            this.setState({ pictures: prevProps.defaultImages });
        }
    }
    // /*
    //  Load image at the beggining if defaultImage prop exists
    //  */
    // componentWillReceiveProps(nextProps) {
    //   if (nextProps.defaultImages !== this.props.defaultImages) {
    //     this.setState({ pictures: nextProps.defaultImages });
    //   }
    // }
    /*
     Check file extension (onDropFile)
     */
    hasExtension(fileName) {
        const pattern = '(' + this.props.imgExtension.join('|').replace(/\./g, '\\.') + ')$';
        return new RegExp(pattern, 'i').test(fileName);
    }
    /*
     Handle file validation
     */
    onDropFile(e) {
        const files = e.target.files;
        const allFilePromises = [];
        const fileErrors = [];
        // Iterate over all uploaded files
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let fileError = {
                name: file.name,
            };
            // Check for file extension
            if (!this.hasExtension(file.name)) {
                fileError = Object.assign(fileError, {
                    type: ERROR.NOT_SUPPORTED_EXTENSION
                });
                fileErrors.push(fileError);
                continue;
            }
            // Check for file size
            if (file.size > this.props.maxFileSize) {
                fileError = Object.assign(fileError, {
                    type: ERROR.FILESIZE_TOO_LARGE
                });
                fileErrors.push(fileError);
                continue;
            }
            allFilePromises.push(this.readFile(file));
        }
        this.setState({
            fileErrors
        });
        const { singleImage } = this.props;
        Promise.all(allFilePromises).then(newFilesData => {
            const dataURLs = singleImage ? [] : this.state.pictures.slice();
            const files = singleImage ? [] : this.state.files.slice();
            newFilesData.forEach(newFileData => {
                dataURLs.push(newFileData.dataURL);
                files.push(newFileData.file);
            });
            this.setState({ pictures: dataURLs, files: files });
        });
    }
    onUploadClick(e) {
        // Fixes https://github.com/JakeHartnell/react-images-upload/issues/55
        e.target.value = null;
    }
    /*
       Read a file and return a promise that when resolved gives the file itself and the data URL
     */
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            // Read the image via FileReader API and save image result in state.
            reader.onload = function (e) {
                // Add the file name to the data URL
                let dataURL = e.target.result;
                dataURL = dataURL.replace(";base64", `;name=${file.name};base64`);
                resolve({ file, dataURL });
            };
            reader.readAsDataURL(file);
        });
    }
    /*
     Remove the image from state
     */
    removeImage(picture) {
        const removeIndex = this.state.pictures.findIndex(e => e === picture);
        const filteredPictures = this.state.pictures.filter((e, index) => index !== removeIndex);
        const filteredFiles = this.state.files.filter((e, index) => index !== removeIndex);
        this.setState({ pictures: filteredPictures, files: filteredFiles }, () => {
            this.props.onChange(this.state.files, this.state.pictures);
        });
    }
    /*
     Check if any errors && render
     */
    renderErrors() {
        const { fileErrors } = this.state;
        return fileErrors.map((fileError, index) => {
            return (React.createElement("div", { className: 'errorMessage ' + this.props.errorClass, key: index, style: this.props.errorStyle },
                "* ",
                fileError.name,
                " ",
                fileError.type === ERROR.FILESIZE_TOO_LARGE ? this.props.fileSizeError : this.props.fileTypeError));
        });
    }
    /*
     Render the upload icon
     */
    renderIcon() {
        if (this.props.withIcon) {
            return React.createElement("img", { src: UploadIcon, className: "uploadIcon", alt: "Upload Icon" });
        }
    }
    /*
     Render label
     */
    renderLabel() {
        if (this.props.withLabel) {
            return React.createElement("p", { className: this.props.labelClass, style: this.props.labelStyles }, this.props.label);
        }
    }
    /*
     Render preview images
     */
    renderPreview() {
        return (React.createElement("div", { className: "uploadPicturesWrapper" },
            React.createElement(FlipMove, { enterAnimation: "fade", leaveAnimation: "fade", style: styles }, this.renderPreviewPictures()),
            this.props.crop && React.createElement(Crop, { ref: this.childRef, pictures: this.state.pictures, setPictures: (e) => this.setPictures(e) })));
    }
    renderPreviewPictures() {
        return this.state.pictures.map((picture, index) => {
            return (React.createElement("div", { key: index, className: "uploadPictureContainer" },
                React.createElement("div", { className: "deleteImage", onClick: () => this.removeImage(picture) }, "X"),
                this.props.crop && (React.createElement("div", { className: "editImage", onClick: () => this.displayModal(picture, index) },
                    React.createElement("img", { src: EditSvg, className: "EditSvg", alt: "Edit Svg" }))),
                React.createElement("img", { src: picture, className: "uploadPicture", alt: "preview" })));
        });
    }
    displayModal(picture, index) {
        this.childRef.current.displayModal(picture, index);
    }
    setPictures(props) {
        this.setState({
            pictures: props
        });
    }
    /*
     On button click, trigger input file to open
     */
    triggerFileUpload() {
        this.inputElement.click();
    }
    clearPictures() {
        this.setState({ pictures: [] });
    }
    render() {
        return (React.createElement("div", { className: "fileUploader " + this.props.className, style: this.props.style },
            React.createElement("div", { className: "fileContainer", style: this.props.fileContainerStyle },
                this.renderIcon(),
                this.renderLabel(),
                React.createElement("div", { className: "errorsContainer" }, this.renderErrors()),
                React.createElement("button", { type: this.props.buttonType, className: "chooseFileButton " + this.props.buttonClassName, style: this.props.buttonStyles, onClick: this.triggerFileUpload }, this.props.buttonText),
                React.createElement("input", { type: "file", ref: input => this.inputElement = input, name: this.props.name, multiple: !this.props.singleImage, onChange: this.onDropFile, onClick: this.onUploadClick, accept: this.props.accept }),
                this.props.withPreview ? this.renderPreview() : null)));
    }
}
ImageUploader.defaultProps = {
    className: '',
    fileContainerStyle: {},
    buttonClassName: "",
    buttonStyles: {},
    withPreview: false,
    accept: "image/*",
    name: "",
    withIcon: true,
    buttonText: "Choose images",
    buttonType: "button",
    withLabel: true,
    label: "Max file size: 5mb, accepted: jpg|gif|png",
    labelStyles: {},
    labelClass: "",
    imgExtension: ['.jpg', '.jpeg', '.gif', '.png'],
    maxFileSize: 5242880,
    fileSizeError: " file size is too big",
    fileTypeError: " is not a supported file extension",
    errorClass: "",
    style: {},
    errorStyle: {},
    singleImage: false,
    onChange: () => { },
    defaultImages: [],
    crop: false
};
ImageUploader.propTypes = {
    style: PropTypes.object,
    fileContainerStyle: PropTypes.object,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    buttonClassName: PropTypes.string,
    buttonStyles: PropTypes.object,
    buttonType: PropTypes.string,
    withPreview: PropTypes.bool,
    accept: PropTypes.string,
    name: PropTypes.string,
    withIcon: PropTypes.bool,
    buttonText: PropTypes.string,
    withLabel: PropTypes.bool,
    label: PropTypes.string,
    labelStyles: PropTypes.object,
    labelClass: PropTypes.string,
    imgExtension: PropTypes.array,
    maxFileSize: PropTypes.number,
    fileSizeError: PropTypes.string,
    fileTypeError: PropTypes.string,
    errorClass: PropTypes.string,
    errorStyle: PropTypes.object,
    singleImage: PropTypes.bool,
    defaultImages: PropTypes.array,
    crop: PropTypes.bool
};
export default ImageUploader;
//# sourceMappingURL=index.js.map