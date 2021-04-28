import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "../Icon";
import FilePicker from "../FilePicker";
import Label from "../../utils/translationNode";
import "./index.css";

const iconStyle = {
  background: "#00bbd3",
  marginLeft: "15px",
  color: "rgb(255, 255, 255)",
  borderRadius: "50%",
  padding: "12px",
  height: 48,
  width: 48,
};
const inputProps = {
  accept: "image/*",
  multiple: false, //for selecting single or multiple files
};
const galleryIconBtn = <Icon className="gallery-upload-drawer" id="uploadDrawerGallaryIcon" style={iconStyle} action="image" name={"image"} />;

class UploadDrawer extends Component {
  onRemoveClick = () => {
    this.props.removeFile();
    this.props.closeDrawer(false);
  };
  picUpload = (file, url) => {
    this.props.uploadfile(file, url);
    this.props.closeDrawer(false);
  };
  onOverlayBodyClick = () => {
    this.props.closeDrawer(false);
  };
  render() {
    return (
      <div>
        <div className="overlayBody" onClick={this.onOverlayBodyClick} />
        <div className="drawerContainer">
          <div className="iconContainer col-xs-12">
            {this.props.galleryIcon && (
              <div className="labelIconBox col-xs-6 text-center">
                <FilePicker id="photo-picker" inputProps={inputProps} handleimage={this.picUpload}>
                  {galleryIconBtn}
                </FilePicker>
                <Label className="galleryUploadlabel" label="COMMON_GALLERY_LABEL" color={"#484848"} labelStyle={this.props.labelStyle} />
              </div>
            )}
            {this.props.removeIcon && (
              <div className="labelIconBox col-xs-6 text-center">
                <div>
                  <Icon
                    className="remove-upload-drawer"
                    id="uploadDrawerRemoveIcon"
                    style={iconStyle}
                    action="action"
                    name={"delete"}
                    onClick={this.onRemoveClick}
                  />
                </div>
                <Label className="removeUploadlabel" label="COMMON_REMOVE_LABEL" color={"#484848"} labelStyle={this.props.labelStyle} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

UploadDrawer.propTypes = {
  cameraIcon: PropTypes.bool,
  videoCamIcon: PropTypes.bool,
  galleryIcon: PropTypes.bool,
  removeIcon: PropTypes.bool,
  openUploadSlide: PropTypes.bool,
  labelStyle: PropTypes.object,
  uploadfile: PropTypes.func,
  closeDrawer: PropTypes.func,
};
export default UploadDrawer;
