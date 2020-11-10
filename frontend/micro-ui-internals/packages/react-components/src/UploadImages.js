import React, { useEffect, useState } from "react";
import { CameraSvg } from "./svgindex";
import { DeleteBtn } from "./svgindex";

const MiniUpload = (props) => {
  return (
    <div className="upload-img-container">
      {/* <img src={camera} className="upload-camera-img" alt="upload"/> */}
      <CameraSvg className="upload-camera-img" />
      <input type="file" id="miniupload" accept="image/*" onChange={props.onUpload} />
    </div>
  );
};

const UploadImages = (props) => {
  const [thumbnails, setThumbnails] = useState(props.thumbnails ? props.thumbnails : null);
  useEffect(() => {
    setThumbnails(props.thumbnails);
  }, [props.thumbnails]);

  if (thumbnails && thumbnails.length > 0) {
    return (
      <div className="multi-upload-wrap">
        {thumbnails.map((thumbnail, index) => {
          return (
            <div key={index}>
              {/* <img src={deleteBtn} onClick={props.onDelete} className="delete" alt="delete"/> */}
              <DeleteBtn onClick={props.onDelete(thumbnail)} className="delete" />
              <img src={thumbnail} alt="uploaded thumbnail" />
            </div>
          );
        })}
        {thumbnails.length < 3 ? <MiniUpload /> : null}
      </div>
    );
  } else {
    return (
      <div className="upload-wrap" onClick={props.onUpload}>
        {/* <img src={camera} alt="upload"/>  */}
        <CameraSvg />
        <input type="file" id="upload" accept="image/*" onChange={props.onUpload} />
      </div>
    );
  }
};

export default UploadImages;
