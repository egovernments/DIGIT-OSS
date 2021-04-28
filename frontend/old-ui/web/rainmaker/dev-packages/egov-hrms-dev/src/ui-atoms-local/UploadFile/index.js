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
    buttonLabel
  } = props;
  return (
    <div>
      <input
        accept={accept}
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={handleFileUpload}
        onClick={event => {
          event.target.value = null;
        }}
        {...inputProps}
      />
      <label htmlFor="contained-button-file">
        <Button component="span" className={classes.button} {...buttonProps}>
          <LabelContainer {...buttonLabel} />
        </Button>
      </label>
    </div>
  );
};

export default UploadFile;
