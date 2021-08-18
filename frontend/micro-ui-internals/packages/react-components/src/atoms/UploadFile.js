import React, { useEffect, useRef, useState } from "react";
import ButtonSelector from "./ButtonSelector";
import { Close } from "./svgindex";
import { useTranslation } from "react-i18next";

const getCitizenStyles = (value) => {
  let citizenStyles = {};
  if (value == "propertyCreate") {
    citizenStyles = {
      textStyles: {
        whiteSpace: "nowrap",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      tagStyles: {
        width: "90%",
      },
      inputStyles: {
        width: "44%",
      },
      buttonStyles: {
        height: "auto",
        minHeight: "2rem",
        width: "40%",
      },
      tagContainerStyles: {
        width: "60%",
      },
    };
  } else {
    citizenStyles = {
      textStyles: {},
      tagStyles: {},
      inputStyles: {},
      buttonStyles: {},
      tagContainerStyles: {},
    };
  }
  return citizenStyles;
};

const UploadFile = (props) => {
  const { t } = useTranslation();
  const inpRef = useRef();
  const [hasFile, setHasFile] = useState(false);
  let extraStyles = {};
  const handleChange = () => {
    if (inpRef.current.files[0]) setHasFile(true);
    else setHasFile(false);
  };
  switch (props.extraStyleName) {
    case "propertyCreate":
      extraStyles = getCitizenStyles("propertyCreate");
      break;
    default:
      extraStyles = getCitizenStyles("");
  }

  const handleDelete = () => {
    inpRef.current.value = "";
    props.onDelete();
  };

  useEffect(() => handleChange(), [props.message]);

  return (
    <div className="upload-file">
      <div>
        <ButtonSelector theme="border" label="Choose File" style={extraStyles ? extraStyles?.buttonStyles : null} textStyles={props?.textStyles} />
        {!hasFile ? (
          <h2 className="file-upload-status">{props.message}</h2>
        ) : (
          <div className="tag-container" style={extraStyles ? extraStyles?.tagContainerStyles : null}>
            {!props.error ? (
              <div className="tag" style={extraStyles ? extraStyles?.tagStyles : null}>
                <span className="text" style={extraStyles ? extraStyles?.textStyles : null}>
                  {inpRef.current.files[0]?.name?.slice(0, 20)}
                </span>
                <span onClick={() => handleDelete()}>
                  <Close className="close" />
                </span>
              </div>
            ) : (
              <h2 className="file-upload-status" style={{ marginTop: "18px" }}>
                {t(`PT_ACTION_NO_FILEUPLOADED`)}
              </h2>
            )}
          </div>
        )}
      </div>
      <input
        style={extraStyles ? extraStyles?.inputStyles : null}
        ref={inpRef}
        type="file"
        name="file"
        accept={props.accept}
        onChange={(e) => props.onUpload(e)}
      />
    </div>
  );
};

export default UploadFile;
