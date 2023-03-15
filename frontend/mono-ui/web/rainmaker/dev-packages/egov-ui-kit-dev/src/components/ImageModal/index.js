import React from "react";
import Image from "../Image";
import Icon from "../Icon";
import "./index.css";

const ImageModal = ({ imageSource, width, height, style, className, onCloseClick, hide }) => {
  return (
    <div className="modal" style={hide ? { display: "none" } : { display: "flex" }}>
      <Image source={imageSource} width={width} height={height} style={hide ? { width: "0%" } : { width: "100%" }} className={className} />
      <div className="modal-close-cont" onClick={onCloseClick}>
        <Icon action="navigation" name="close" color="#ffffff" />
      </div>
    </div>
  );
};

export default ImageModal;
