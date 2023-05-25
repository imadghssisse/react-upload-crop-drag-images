import React from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import '../../public/style.css';
import SaveSvg from '../../public/SaveSvg.svg';

export default class Crop extends React.Component {
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
        return (
            <div>
                <div className="modal__overlay"></div>
                <div className="modal">
                    <div className="modal__close-btn" onClick={() => this.closeModal()}>
                        <i className="fa-solid fa-xmark">X</i>
                    </div>
                    {this.renderCropPicture()}
                    <div className="modal__right">
                    </div>
                </div>
            </div>
        )
    }


    renderCropPicture() {
        return (
            <div className="cropPicture">
                <Cropper
                    image={this.state.cropImage}
                    crop={this.state.crop}
                    zoom={this.state.zoom}
                    aspect={4 / 3}
                    onCropChange={(e) => this.setCrop(e)}
                    onCropComplete={(croppedArea, croppedAreaPixels) => this.onCropComplete(croppedArea, croppedAreaPixels)}
                    onZoomChange={(e) => this.setZoom(e)}
                />
                <div className="controls">
                    <input
                        type="range"
                        value={this.state.zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => {
                            this.setZoom(e.target.value)
                        }}
                        className="zoom-range"
                    />
                    <button
                        type="button"
                        className="modal__button"
                        onClick={() => this.showCroppedImage()}
                    >
                        <img src={SaveSvg} alt="Save Svg" />
                    </button>
                </div>
            </div>
        );
    }
    async showCroppedImage() {
        try {
            const croppedImage = await getCroppedImg(
                this.state.cropImage,
                this.state.croppedAreaPixels,
            )
            const pictures = this.state.pictures;
            this.props.pictures[this.state.cropIndex] = croppedImage;
            this.props.setPictures(this.props.pictures)
            this.closeModal()
        } catch (e) {
            console.error(e)
        }
    }

    setZoom(e) {
        this.setState({
            zoom: e
        })
    }

    setCrop(e) {
        this.setState({
            crop: e
        })
    }

    onCropComplete(croppedArea, croppedAreaPixels) {
        this.setState({
            croppedAreaPixels: croppedAreaPixels
        })
    }


    displayModal(props, index) {
        const modal = document.querySelector('.modal');
        const modalOverlay = document.querySelector('.modal__overlay');

        this.setState({
            cropImage: props,
            cropIndex: index
        })

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