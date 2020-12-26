import React from "react";
import PropTypes from "prop-types";

const ImageViewer = (props) => {
  return (
    <div className="image-viewer-wrap">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px" onClick={props.onClose}>
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
      </svg>
      <img src={props.imageSrc} />
    </div>
  );
};

ImageViewer.propTypes = {
  imageSrc: PropTypes.string,
};

ImageViewer.defaultProps = {
  imageSrc: "",
};

export default ImageViewer;
