import React from "react";
import ButtonSelector from "./ButtonSelector";

const UploadFile = () => {
  return (
    <div className="upload-file">
      <div>
        <ButtonSelector theme="border" label="Choose File" />
        <h2 className="file-upload-status">activity message</h2>
      </div>
      <input type="file" name="file" />
    </div>
  );
};

export default UploadFile;
