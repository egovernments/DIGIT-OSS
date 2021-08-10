import React, { Component } from "react";
import { connect } from "react-redux";
import { FilePicker, Icon, Image, LoadingIndicator } from "components";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { getFileSize, isFileImage } from "egov-ui-kit/utils/commons";
import Label from "egov-ui-kit/utils/translationNode";
import { fileUpload, removeFile } from "egov-ui-kit/redux/form/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import "./index.css";

const iconStyle = {
  width: "19px",
  height: "19px",
  fontSize: "12px",
};

const labelStyle = {
  letterSpacing: "0.6px",
  lineHeight: 1,
  margin: "0 auto",
  width: "75px",
};

const Placeholder = ({ className, onFilePicked, inputProps, hide }) => {
  return (
    <div className={`${className} upload-placeholder`} style={hide ? { visibility: "hidden" } : {}}>
      <FilePicker inputProps={{ ...inputProps, multiple: false }} handleimage={onFilePicked}>
        <FloatingActionButton backgroundColor="#767676" iconStyle={{ height: "40px", width: "40px" }} style={{ boxShadow: 0, marginBottom: "4px" }}>
          <Icon id="image-upload" name="add-a-photo" action="image" style={{ height: "20px", width: "20px" }} color={"#ffffff"} />
        </FloatingActionButton>
        <Label label="CS_COMMON_UPLOAD_PHOTOS" labelStyle={labelStyle} fontSize="12px" />
      </FilePicker>
    </div>
  );
};

class ImageUpload extends Component {
  fillPlaceholder = (images, onFilePicked, inputProps) => {
    const placeholders = [];
    for (let i = 0; i < 3 - images.length; i++) {
      placeholders.push(<Placeholder key={i} inputProps={inputProps} onFilePicked={onFilePicked} hide={i === 1 ? true : false} />);
    }
    return placeholders;
  };

  removeImage = (fileIndex) => {
    const { formKey, fieldKey, removeFile } = this.props;
    removeFile(formKey, fieldKey, fileIndex);
  };

  onFilePicked = (file, imageUri) => {
    const { images, formKey, fieldKey, module, fileUpload, toggleSnackbarAndSetText } = this.props;
    const MAX_IMAGE_SIZE = 5000;
    const fileSize = getFileSize(file);
    const isImage = isFileImage(file);
    if (!isImage) {
      toggleSnackbarAndSetText(true, { labelName: "The file is not a valid image", labelKey: "ERR_NOT_VALID_IMAGE" }, "error");
    } else if (fileSize > MAX_IMAGE_SIZE) {
      toggleSnackbarAndSetText(true, { labelName: "The file is more than 5mb", labelKey: "ERR_FILE_MORE_THAN_FIVEMB" },"error");
    } else {
      if (images.length < 3) {
        fileUpload(formKey, fieldKey, { module, file, imageUri });
      }
    }
  };

  render() {
    const { onFilePicked, removeImage } = this;
    const { images, loading } = this.props;
    // file Size in kb
    const inputProps = { accept: "image/*", maxFiles: 3, multiple: true };

    return (
      <div className="upload-photo-overlay">
        {loading && <LoadingIndicator />}
        {!images.length ? (
          <FilePicker inputProps={inputProps} handleimage={onFilePicked}>
            <div className="upload-icon-cont">
              <Icon id="image-upload" action="image" name="add-a-photo" style={iconStyle} color={"#ffffff"} />
            </div>
            <Label label="CS_COMMON_UPLOAD_PHOTOS" labelStyle={labelStyle} fontSize="12px" />
          </FilePicker>
        ) : (
          <div className="upload-images-cont">
            {images.map((image, index) => {
              return (
                <div key={index} className="upload-image-cont">
                  <Image source={image.imageUri} style={{ height: "100px" }} />
                  <div className="image-remove" onClick={() => removeImage(index)}>
                    <Icon id="image-close-icon" action="navigation" name="close" color="#ffffff" style={{ width: "14px", height: "14px" }} />
                  </div>
                </div>
              );
            })}
            {this.fillPlaceholder(images, onFilePicked, inputProps)}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const images = (state.form[ownProps.formKey] && state.form[ownProps.formKey].files && state.form[ownProps.formKey].files[ownProps.fieldKey]) || [];
  const loading = images.reduce((loading, file) => {
    return loading || file.loading;
  }, false);
  return { images, loading };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    fileUpload: (formKey, fieldKey, module, fileObject) => dispatch(fileUpload(formKey, fieldKey, module, fileObject)),
    removeFile: (formKey, fieldKey, index) => dispatch(removeFile(formKey, fieldKey, index)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageUpload);
