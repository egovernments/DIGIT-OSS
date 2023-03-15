import React from "react";
import Button from "@material-ui/core/Button";
import { LabelContainer } from "egov-ui-framework/ui-containers";

const UploadFile = props => {
  const {
    classes,
    handleFileUpload,
    buttonProps,
    inputProps,
    accept,
    buttonLabel,
    id
  } = props;
  return (
    <div>
      <input
        accept={accept}
        className={classes.input}
        id={id ? id : "contained-button-file"}
        multiple
        type="file"
        onChange={handleFileUpload}
        onClick={event => {
          event.target.value = null;
        }}
        {...inputProps}
      />
      {/* <label htmlFor={id ? id : "contained-button-file"}>
        <Button component="span" className={classes.button} {...buttonProps}>
          <LabelContainer {...buttonLabel} />
        </Button>
      </label> */}
    </div>
  );
};

export default UploadFile;
