import { UploadedDocument, UploadFile } from "egov-ui-framework/ui-atoms";
import React from "react";
import "./index.css";

const UploadSingleFile = ({
  uploaded,
  classes,
  handleFileUpload,
  documents,
  removeDocument,
  onButtonClick,
  inputProps,
  buttonLabel,
  id,
  disabled = false
}) => {
  return (
    <div>
      {!uploaded && (
        <UploadFile
          buttonProps={{
            variant: "outlined",
            color: "primary",
            onClick: onButtonClick
          }}
          id={id}
          handleFileUpload={handleFileUpload}
          inputProps={{ multiple: false, ...inputProps }}
          classes={classes}
          buttonLabel={buttonLabel}
        />
      )}
      {uploaded && (
        <div>
          {documents &&
            documents.map((document, documentIndex) => {
              return (
                <div className="pt-upoaded-document" key={documentIndex}>
                  {document && (
                    <UploadedDocument
                      document={document}
                      removeDocument={removeDocument}
                      disabled={disabled}
                    />
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default UploadSingleFile;
