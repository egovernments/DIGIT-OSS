import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import { withStyles } from "@material-ui/core/styles";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import React from "react";
import "./index.css";

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    }
  },
  checked: {}
};

const CheckBoxContainer = (props) => {
  const { classes, content, labelName, labelKey, checked, name, changeMethod } = props;

  return (
    <FormGroup row>
      <FormControlLabel
        classes={{ label: "checkbox-label" }}
        control={
          <Checkbox
            checked={checked ? false : true}
            onChange={(event) => changeMethod(event.target.name)}
            // value={this.state.checkedG}
            classes={{
              root: classes.root,
              checked: classes.checked
            }}
            name={name}
          />
        }
        label={
          labelKey && (
            <LabelContainer
              // className={classes.formLabel}
              className={"amend-checkbox-label"}
              labelName={labelName}
              labelKey={labelKey}
            />
          )
        }
      />
    </FormGroup>
  );
};

CheckBoxContainer.propTypes = {
};

export default withStyles(styles)(CheckBoxContainer);
