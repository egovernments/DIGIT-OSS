import React from "react";

const DisplayPhotos = (props) => {
  return (
    <div className="photos-wrap">
      {props.srcs.map((source, index) => {
        return ++index !== props.srcs.length ? (
          <img key={index} src={source} alt="issue thumbnail"></img>
        ) : (
          <img key={index} src={source} className="last" alt="issue thumbnail"></img>
        );
      })}
    </div>
  );
};

export default DisplayPhotos;
