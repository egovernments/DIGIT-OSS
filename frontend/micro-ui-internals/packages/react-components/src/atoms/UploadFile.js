import React, { useEffect, useRef, useState, Fragment } from "react";
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

  const showHint = props?.showHint || false;

  return (
    <Fragment>
      {showHint && <p className="cell-text">{t(props?.hintText)}</p>}
      <div className={`upload-file ${props.disabled ? " disabled" : ""}`}>
        <div>
          <ButtonSelector
            theme="border"
            label={t("CS_COMMON_CHOOSE_FILE")}
            style={{ ...(extraStyles ? extraStyles?.buttonStyles : {}), ...(props.disabled ? { display: "none" } : {}) }}
            textStyles={props?.textStyles}
            type={props.buttonType}
          />
          {!hasFile || props.error ? (
            <h2 className="file-upload-status">{props.message}</h2>
          ) : (
            <div className="tag-container" style={extraStyles ? extraStyles?.tagContainerStyles : null}>
              <div className="tag" style={extraStyles ? extraStyles?.tagStyles : null}>
                <span className="text" style={extraStyles ? extraStyles?.textStyles : null}>
                  {inpRef.current.files[0]?.name?.slice(0, 20)}
                </span>
                <span onClick={() => handleDelete()}>
                  <Close className="close" />
                </span>
              </div>
            </div>
          )}
        </div>
        <input
          className={props.disabled ? "disabled" : ""}
          style={extraStyles ? { ...extraStyles?.inputStyles, ...props?.inputStyles } : { ...props?.inputStyles }}
          ref={inpRef}
          type="file"
          name="file"
          accept={props.accept}
          disabled={props.disabled}
          onChange={(e) => props.onUpload(e)}
        />
      </div>
    </Fragment>
  );
};

export default UploadFile;
