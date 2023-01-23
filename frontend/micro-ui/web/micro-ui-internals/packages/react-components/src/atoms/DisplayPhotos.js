import React from "react";
import PropTypes from "prop-types";
import {PDFSvg} from "./svgindex"

const ImageOrPDFIcon = ({source, index, last=false, onClick}) => {
  return Digit.Utils.getFileTypeFromFileStoreURL(source) === "pdf" ?
  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start", alignContent: "center" }}>
    <a target="_blank" href={source} style={{ minWidth: "100px", marginRight: "10px", maxWidth: "100px", height: "auto" }} key={index}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <PDFSvg style={{ background: "#f6f6f6", padding: "8px", width:"100px" }} width="100px" height="100px" minWidth="100px" />
      </div>
    </a>
  </div>
  :
  <img key={index} src={source} {...last ? {className:"last"} : {}} alt="issue thumbnail" onClick={() => onClick(source, index)}></img>
}

const DisplayPhotos = (props) => {
  return (
    <div className="photos-wrap">
      {props.srcs.map((source, index) => {
        return <ImageOrPDFIcon {...{source, index, ...props}} last={++index !== props.srcs.length ? false : true}/>
      })}
    </div>
  );
};

DisplayPhotos.propTypes = {
  /**
   * images
   */
  srcs: PropTypes.array,
  /**
   * optional click handler
   */
  onClick: PropTypes.func,
};

DisplayPhotos.defaultProps = {
  srcs: [],
};

export default DisplayPhotos;
