import React from "react";
import PropTypes from "prop-types";

const DisplayPhotos = (props) => {
  return (
    <div className="photos-wrap">
      {props.srcs.map((source, index) => {
        return ++index !== props.srcs.length ? (
          <img key={index} src={source} alt="issue thumbnail" onClick={() => props.onClick(source)}></img>
        ) : (
          <img key={index} src={source} className="last" alt="issue thumbnail" onClick={() => props.onClick(source)}></img>
        );
      })}
    </div>
  );
};

DisplayPhotos.propTypes = {
  /**
   * images
   */
  srcs: PropTypes.array.isRequired,
  /**
   * optional click handler
   */
  onClick: PropTypes.func,
};

DisplayPhotos.defaultProps = {
  srcs: [],
};

export default DisplayPhotos;
