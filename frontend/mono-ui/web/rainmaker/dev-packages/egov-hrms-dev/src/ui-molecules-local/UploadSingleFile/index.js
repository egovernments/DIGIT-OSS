import React from "react";
import { UploadFile, UploadedDocument } from "../../ui-atoms-local";

const UploadSingleFile = ({
  uploaded,
  classes,
  handleFileUpload,
  documents,
  removeDocument,
  onButtonClick,
  inputProps,
  buttonLabel,
  id
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
                <div key={documentIndex}>
                  <UploadedDocument
                    document={document}
                    removeDocument={removeDocument}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default UploadSingleFile;
