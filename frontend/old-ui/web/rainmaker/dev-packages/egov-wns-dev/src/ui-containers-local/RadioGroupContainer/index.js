import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { connect } from "react-redux";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { togglePlumberFeilds } from '../CheckboxContainer/toggleFeilds';

const styles = theme => ({
  root: {
    display: "flex",
    marginBottom:0
  },
  formControl: {
    marginTop: 0,
    paddingBottom: 0
  },
  group: {
    display: "inline-block",
    margin: 0
  },
  radioRoot: {
    marginBottom: 12
  },
  formLabel: {
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 0.56,
    marginTop:14
  }
});

const disableRadioButton = {
  pointerEvents: "none",
  opacity: 0.5
}

class RadioButtonsGroup extends React.Component {
  handleChange = event => {
    const { screenKey, componentJsonpath, onFieldChange, onChange } = this.props;
    onChange ? onChange(event) : onFieldChange(screenKey, componentJsonpath, "props.value", event.target.value);
    if (event.target.value === "Self") {
      togglePlumberFeilds(onFieldChange, false);
    } else {
      togglePlumberFeilds(onFieldChange, true);
    }
  };

  render() {
    const { classes, required, preparedFinalObject } = this.props;
    const { applyScreen } = preparedFinalObject;
    const { additionalDetails } = applyScreen;
    let value = (additionalDetails !== undefined && additionalDetails.detailsProvidedBy !== undefined) ? additionalDetails.detailsProvidedBy : "";
    return (
      <div className={classes.root}>
        <FormControl
          component="fieldset"
          className={classes.formControl}
          required={required}>
          <FormLabel className={classes.formLabel}>
            <LabelContainer
              className={classes.formLabel}
              labelKey="WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY"
            />
          </FormLabel>
          <RadioGroup
            aria-label="Gender"
            name="gender1"
            value={value}
            className={classes.group}
            onChange={this.handleChange}>
            <FormControlLabel
              classes={{ label: "radio-button-label" }}
              value="ULB"
              control={<Radio className={classes.radioRoot} color="primary" />}
              label={<LabelContainer labelKey="WS_PLUMBER_ULB" />}
            />
            <FormControlLabel
              value="Self"
              classes={{ label: "radio-button-label" }}
              control={<Radio className={classes.radioRoot} color="primary" />}
              label={<LabelContainer labelKey="WS_PLUMBER_SELF" />}
            />
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  let fieldValue = "";
  const { screenConfiguration } = state;
  const { jsonPath } = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  if (jsonPath) fieldValue = get(preparedFinalObject, jsonPath);
  return { preparedFinalObject, jsonPath, fieldValue };
};

const mapDispatchToProps = dispatch => {
  return {
    approveCheck: (jsonPath, value) => {
      dispatch(prepareFinalObject(jsonPath, value));
    }
  };
};

RadioButtonsGroup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RadioButtonsGroup)
);
