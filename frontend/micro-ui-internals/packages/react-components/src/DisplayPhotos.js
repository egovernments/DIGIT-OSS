import React from "react";

const DisplayPhotos = ({ srcs, onClick }) => {
  return (
    <div className="photos-wrap">
      {srcs.map((source, index) => {
        return ++index !== srcs.length ? (
          <img key={index} src={source} alt="issue thumbnail" onClick={() => onClick(source)}></img>
        ) : (
          <img key={index} src={source} className="last" alt="issue thumbnail" onClick={() => onClick(source)}></img>
        );
      })}
    </div>
  );
};
export default DisplayPhotos;
