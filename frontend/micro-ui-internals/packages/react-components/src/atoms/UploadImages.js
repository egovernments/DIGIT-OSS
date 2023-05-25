import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CameraSvg } from "./svgindex";
import { DeleteBtn } from "./svgindex";

const MiniUpload = (props) => {
  return (
    <div className="upload-img-container">
      <CameraSvg className="upload-camera-img" />
      <input type="file" id="miniupload" accept="image/*" onChange={(e) => props.onUpload(e)} />
    </div>
  );
};

const UploadImages = (props) => {
  if (props.thumbnails && props.thumbnails.length > 0) {
    return (
      <div className="multi-upload-wrap">
        {props.thumbnails.map((thumbnail, index) => {
          return (
            <div key={index}>
              <DeleteBtn onClick={() => props.onDelete(thumbnail)} className="delete" fill="#d4351c" />
              <img src={thumbnail} alt="uploaded thumbnail" />
            </div>
          );
        })}
        {props.thumbnails.length < 3 ? <MiniUpload onUpload={props.onUpload} /> : null}
      </div>
    );
  } else {
    return (
      <div className="upload-wrap" onClick={(e) => props.onUpload(e)}>
        <CameraSvg />
        <input type="file" id="upload" accept="image/*" onChange={(e) => props.onUpload(e)} />
      </div>
    );
  }
};

UploadImages.propTypes = {
  thumbnail: PropTypes.array,
  onUpload: PropTypes.func,
};

UploadImages.defaultProps = {
  thumbnail: [],
  onUpload: undefined,
};

export default UploadImages;
