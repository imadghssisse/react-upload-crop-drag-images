export default class Crop extends React.Component<any, any, any> {
    constructor(props: any);
    state: {
        crop: {
            x: number;
            y: number;
        };
        zoom: number;
        cropImage: boolean;
        croppedAreaPixels: null;
        croppedImage: null;
        cropIndex: boolean;
    };
    render(): React.JSX.Element;
    renderCropPicture(): React.JSX.Element;
    showCroppedImage(): Promise<void>;
    setZoom(e: any): void;
    setCrop(e: any): void;
    onCropComplete(croppedArea: any, croppedAreaPixels: any): void;
    displayModal(props: any, index: any): void;
    closeModal(): void;
}
import React from 'react';
