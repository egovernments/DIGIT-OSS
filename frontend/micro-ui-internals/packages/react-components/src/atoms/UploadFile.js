import React, { useEffect, useRef, useState } from "react";
import ButtonSelector from "./ButtonSelector";
import { Close } from "./svgindex";

const UploadFile = (props) => {
  const inpRef = useRef();
  const [hasFile, setHasFile] = useState(false);

  const handleChange = () => {
    if (inpRef.current.files[0]) setHasFile(true);
    else setHasFile(false);
  };

  const handleDelete = () => {
    inpRef.current.value = "";
    props.onDelete();
  };

  useEffect(() => handleChange(), [props.message]);

  return (
    <div className="upload-file">
      <div>
        <ButtonSelector theme="border" label="Choose File" />
        {!hasFile ? (
          <h2 className="file-upload-status">{props.message}</h2>
        ) : (
          <div className="tag-container">
            <div className="tag" style={{ height: "2rem", marginTop: "1rem" }}>
              <span className="text">{inpRef.current.files[0]?.name}</span>
              <span onClick={handleDelete}>
                <Close className="close" />
              </span>
            </div>
          </div>
        )}
      </div>
      <input ref={inpRef} type="file" name="file" accept={props.accept} onChange={(e) => props.onUpload(e)} />
    </div>
  );
};

export default UploadFile;
