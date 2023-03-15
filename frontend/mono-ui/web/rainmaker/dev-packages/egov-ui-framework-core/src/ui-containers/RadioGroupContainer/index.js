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

const styles = theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    marginTop: 0,
    paddingBottom: 0
  },
  group: {
    margin: 0,
    display: "flex",
    flexFlow: 'wrap'
  },
  radioRoot: {
    marginBottom: 12
  },
  radioHelperText: {
    color: '#f44336',
    fontSize: '1.4rem'
  },
  formLabel: {
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 0.56
  }
});

const disableRadioButton = {
  pointerEvents: "none",
  opacity: 0.5
}

class RadioButtonsGroup extends React.Component {
  handleChange = event => {
    const {
      screenKey,
      componentJsonpath,
      jsonPath,
      approveCheck,
      onFieldChange,
      onChange
    } = this.props;
    onChange ? onChange(event) : onFieldChange(
      screenKey,
      componentJsonpath,
      "props.value",
      event.target.value
    );
  };

  render() {
    //  const { classes, buttons, fieldValue } = this.props;
    //   error: true
    // helperText: "Required Field"
    const {
      label,
      classes,
      buttons,
      defaultValue,
      value,
      fieldValue,
      required,
      error,
      helperText, id
    } = this.props;

    return (
      <div className={classes.root}>
        {/* <FormControl component="fieldset" className={classes.formControl}> */}
        <FormControl
        required={required}
        error={error}
        helperText={helperText}
          id={id}
          component="fieldset"
          className={classes.formControl}
          required={required}
        >
          <FormLabel className={classes.formLabel}>
            {label && label.key && (
              <LabelContainer
                className={classes.formLabel}
                labelName={label.name}
                labelKey={label.key}
                
              />
            )}
          </FormLabel>
          <RadioGroup

            aria-label="Gender"
            name="gender1"
            className={classes.group}
            // value={this.state.value || fieldValue}
            value={value || fieldValue || defaultValue}
            onChange={this.handleChange}

          >
            {buttons &&
              buttons.map((button, index) => {
                return (
                  <FormControlLabel
                    disabled={button.disabled ? true : false}
                    key={index}
                    classes={{ label: "radio-button-label" }}
                    value={button.value}
                    control={
                      // <Radio
                      //   classes={{
                      //     root: "radio-root"
                      //   }}
                      //   color="primary"
                      // />
                      <Radio className={classes.radioRoot} color="primary" />
                    }
                    // label={button.label}
                    label={
                      <LabelContainer
                        labelName={button.labelName}
                        labelKey={button.labelKey}
                      />
                    }
                  />
                );
              })}
          </RadioGroup>
          {error && helperText && <p id={`${id}-helper-text`} className={classes.radioHelperText}>
            {helperText}
          </p >}
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
