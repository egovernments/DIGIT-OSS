import React from "react";
import { UploadFile, UploadedDocument } from "egov-ui-framework/ui-atoms";

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
            onClick: onButtonClick,
            disabled: disabled
          }}
          id={id}
          handleFileUpload={handleFileUpload}
          inputProps={{ multiple: false, disabled: disabled, ...inputProps }}
          classes={classes}
          buttonLabel={buttonLabel}
        />
      )}
      {uploaded && (
        <div>
          {documents &&
            documents.map((document, documentIndex) => {
              return (
                <div key={documentIndex}>
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
