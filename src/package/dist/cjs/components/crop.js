"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_easy_crop_1 = tslib_1.__importDefault(require("react-easy-crop"));
const cropImage_1 = tslib_1.__importDefault(require("./cropImage"));
require("../../public/style.css");
const SaveSvg_svg_1 = tslib_1.__importDefault(require("../../public/SaveSvg.svg"));
class Crop extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            crop: { x: 0, y: 0 },
            zoom: 1,
            cropImage: false,
            croppedAreaPixels: null,
            croppedImage: null,
            cropIndex: false
        };
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: "modal__overlay" }),
            react_1.default.createElement("div", { className: "modal" },
                react_1.default.createElement("div", { className: "modal__close-btn", onClick: () => this.closeModal() },
                    react_1.default.createElement("i", { className: "fa-solid fa-xmark" }, "X")),
                this.renderCropPicture(),
                react_1.default.createElement("div", { className: "modal__right" }))));
    }
    renderCropPicture() {
        return (react_1.default.createElement("div", { className: "cropPicture" },
            react_1.default.createElement(react_easy_crop_1.default, { image: this.state.cropImage, crop: this.state.crop, zoom: this.state.zoom, aspect: 4 / 3, onCropChange: (e) => this.setCrop(e), onCropComplete: (croppedArea, croppedAreaPixels) => this.onCropComplete(croppedArea, croppedAreaPixels), onZoomChange: (e) => this.setZoom(e) }),
            react_1.default.createElement("div", { className: "controls" },
                react_1.default.createElement("input", { type: "range", value: this.state.zoom, min: 1, max: 3, step: 0.1, "aria-labelledby": "Zoom", onChange: (e) => {
                        this.setZoom(e.target.value);
                    }, className: "zoom-range" }),
                react_1.default.createElement("button", { type: "button", className: "modal__button", onClick: () => this.showCroppedImage() },
                    react_1.default.createElement("img", { src: SaveSvg_svg_1.default, alt: "Save Svg" })))));
    }
    async showCroppedImage() {
        try {
            const croppedImage = await (0, cropImage_1.default)(this.state.cropImage, this.state.croppedAreaPixels);
            const pictures = this.state.pictures;
            this.props.pictures[this.state.cropIndex] = croppedImage;
            this.props.setPictures(this.props.pictures);
            this.closeModal();
        }
        catch (e) {
            console.error(e);
        }
    }
    setZoom(e) {
        this.setState({
            zoom: e
        });
    }
    setCrop(e) {
        this.setState({
            crop: e
        });
    }
    onCropComplete(croppedArea, croppedAreaPixels) {
        this.setState({
            croppedAreaPixels: croppedAreaPixels
        });
    }
    displayModal(props, index) {
        const modal = document.querySelector('.modal');
        const modalOverlay = document.querySelector('.modal__overlay');
        this.setState({
            cropImage: props,
            cropIndex: index
        });
        if (document.cookie.indexOf('modalpopup') == -1) {
            modal.classList.add('active');
            modalOverlay.classList.add('active');
        }
    }
    closeModal() {
        const modal = document.querySelector('.modal');
        const modalOverlay = document.querySelector('.modal__overlay');
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
    }
}
exports.default = Crop;
//# sourceMappingURL=crop.js.map