import React from "react";
import { UploadFile } from "egov-ui-framework/ui-atoms";
import UploadedDocument from "../../ui-atoms-local/UploadedDocument"
import "./index.scss";

const UploadMultipleFile = ({
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
  if(!inputProps.multiple) {
    inputProps.multiple = inputProps.multiple == false ? true : false;
  }
  return (
    <div>
      {uploaded && (
        <div>
          {documents &&
            documents.map((document, documentIndex) => {
              return (
                <div className="divellip" key={documentIndex}>
                  {document && (
                    <UploadedDocument
                      document={document}
                      removeDocument={()=>removeDocument(documentIndex)}
                      disabled={!document.isClickable}
                    />
                  )}
                </div>
              ); 
            })}
        </div>
      )}
        <UploadFile
          buttonProps={{
            variant: "outlined",
            color: "primary",
            onClick: onButtonClick
          }}
          id={id}
          handleFileUpload={handleFileUpload}
          inputProps={{ ...inputProps }}
          classes={classes}
          buttonLabel={buttonLabel}
        />
      
    </div>
  );
};

export default UploadMultipleFile;