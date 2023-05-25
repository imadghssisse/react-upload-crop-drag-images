import React, { Component } from 'react';
import { render } from 'react-dom';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

renderPreviewPicturesSortable() {
    const SortableItem = SortableElement(({ picture, index }) => <li>
      <div className="uploadPictureContainer">
        <div className="deleteImage" onClick={() => this.removeImage(picture)}>X</div>
        {
          this.props.crop && (
            <div className="editImage" onClick={() => this.displayModal(picture, index)}>
              <img src={EditSvg} className="EditSvg" alt="Edit Svg" />
            </div>
          )
        }
        <img src={picture} className="uploadPicture" alt="preview" />
      </div>
    </li>);

    const SortableList = SortableContainer(({ items }) => {
      return (
        <ul>
          {items.map((picture, index) => (
            <SortableItem key={`item-${index}`} index={index} picture={picture} />
          ))}
        </ul>
      );
    });
    const onSortEnd = () => {

    }

    return <SortableList items={this.state.pictures} onSortEnd={onSortEnd} />
  }