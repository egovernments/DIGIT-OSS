import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import get from "lodash/get";
import "./index.css"

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
  const { classes, content, labelName, labelKey,checked,name,changeMethod } = props;
  
  return (
        <FormGroup row>
            <FormControlLabel
              classes={{ label: "checkbox-label" }}
              control={
                <Checkbox
                  checked={checked?false:true}
                  onChange={(event)=>changeMethod(event.target.name)}
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
