import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from '@material-ui/core/FormGroup';
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import FormControl from "@material-ui/core/FormControl";
import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { getTextToLocalMapping } from "../../ui-config/screens/specs/utils";
import get from 'lodash/get';

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
  state = {
    checkedG: false
  };

  validator = () => {
    const { preparedFinalObject } = this.props;
    let city = get(
      preparedFinalObject,
      "Property.address.city"
    );
    let locality = get(
      preparedFinalObject,
      "Property.address.locality.code"
    );
    let doorNo = get(
      preparedFinalObject,
      "Property.address.doorNo"
    );
    let buildingName = get(
      preparedFinalObject,
      "Property.address.buildingName"
    );
    if (
      !_.isUndefined(city) &&
      !_.isUndefined(locality) &&
      !_.isUndefined(doorNo) &&
      !_.isUndefined(buildingName)
    ) {
      return true
    } else {
      return false
    }
  }

  handleChange = name => event => {
    const {
      jsonPath,
      approveCheck,
      destinationJsonPath,
      preparedFinalObject,
      raiseSnackbarAlert
    } = this.props;

    if (this.validator()) {
       let city = get(
          preparedFinalObject,
          "Property.address.city"
        );
        let locality = get(
          preparedFinalObject,
          "Property.address.locality.code"
        );
        let doorNo = get(
          preparedFinalObject,
          "Property.address.doorNo"
        );
        let buildingName = get(
          preparedFinalObject,
          "Property.address.buildingName"
        );
      let finalAddress = doorNo + ", " + buildingName + ", " + getTextToLocalMapping(city.toUpperCase().replace(/[.]/g,"_") + '_REVENUE_' + locality) + ", " + city.split(".")[1];
      this.setState({ [name]: event.target.checked }, () => {
        approveCheck(jsonPath, this.state.checkedG);
        finalAddress = (this.state.checkedG)?finalAddress:''
        let itemObj = jsonPath.lastIndexOf('.')        
        approveCheck(jsonPath.substring(0,itemObj+1) + destinationJsonPath, finalAddress);
      });      
      
    } else {
      raiseSnackbarAlert(
        "PT_COMMON_PROPERTY_LOCATION_FIELD_REQUIRED",
        "warning"
      );
    }
  };

  render() {
    const { classes, labelKey, required } = this.props;

    return (
      <div
        className={classes.root}
      >
        <FormControl
          component="fieldset"
          className={classes.formControl}
          required={required}
        >
          <FormGroup row>
            <FormControlLabel
              classes={{ label: "checkbox-button-label" }}
              control={
                <Checkbox
                  checked={this.state.checkedG}
                  onChange={this.handleChange("checkedG")}
                  classes={{
                    root: classes.radioRoot,
                    checked: classes.checked
                  }}
                  color="primary"
                />}
              label={<LabelContainer labelKey={labelKey} />}
            />
          </FormGroup>
        </FormControl>
      </div>
    )
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { jsonPath } = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject, jsonPath };
};

const mapDispatchToProps = dispatch => {
  return {
    approveCheck: (jsonPath, value) => {
      dispatch(
        prepareFinalObject(
          jsonPath,
          value
        )
      );
    },
    raiseSnackbarAlert: (labelKey, value) => {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelKey: labelKey,
          },
          value
        )
      );
    }
  };
};

CheckboxLabels.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CheckboxLabels)
);
