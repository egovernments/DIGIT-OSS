import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from '@material-ui/core/FormGroup';
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import "./index.css";

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    }
  },
  formControl: {
    marginTop: 0,
    paddingBottom: 0
  },
  group: {
    display: "inline-block",
    margin: 0
  },
  checked: {},
  radioRoot: {
    marginBottom: 12
  },
  formLabel: {
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 0.56
  }
};

class CheckboxLabels extends React.Component {
  handleChange = event => {
    const { screenKey, componentJsonpath, onFieldChange, onChange } = this.props;
    onChange ? onChange(event) : onFieldChange(screenKey, componentJsonpath, "props.value", event.target.value);
  };

  render() {
    const { classes, label, buttons, defaultValue, value, fieldValue, required } = this.props;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl} required={required}>
          <FormLabel className={classes.formLabel}>
            {label && label.key && (<LabelContainer className={classes.formLabel} labelName={label.name} labelKey={label.key} />)}
          </FormLabel>
          <FormGroup aria-label="Gender" name="gender1" className={classes.group} value={value || fieldValue || defaultValue} onChange={this.handleChange}>
            {buttons && buttons.map((button, index) => {
              return (
                <FormControlLabel
                  disabled={button.disabled ? true : false}
                  key={index}
                  classes={{ label: "checkbox-button-label" }}
                  value={button.value}
                  control={<Checkbox classes={{ root: classes.radioRoot, checked: classes.checked }} color="primary" />}
                  label={<LabelContainer labelName={button.labelName} labelKey={button.labelKey} />}
                />
              );
            })
            }
          </FormGroup>
        </FormControl>
      </div>
    )
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
  return { approveCheck: (jsonPath, value) => { dispatch(prepareFinalObject(jsonPath, value)); } };
};

CheckboxLabels.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(CheckboxLabels)
);
