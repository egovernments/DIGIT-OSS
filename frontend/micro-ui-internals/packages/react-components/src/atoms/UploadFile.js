import React from "react";
import ButtonSelector from "./ButtonSelector";

const UploadFile = (props) => {
  return (
    <div className="upload-file">
      <div>
        <ButtonSelector theme="border" label="Choose File" />
        <h2 className="file-upload-status">{props.message}</h2>
      </div>
      <input type="file" name="file" accept={props.accept} onChange={(e) => props.onUpload(e)} />
    </div>
  );
};

export default UploadFile;
