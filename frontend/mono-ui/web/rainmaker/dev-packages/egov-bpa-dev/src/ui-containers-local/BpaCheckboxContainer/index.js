import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";
import {
  getTranslatedLabel,
  transformById
} from "../../ui-config/screens/specs/utils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

import get from "lodash/get";
import "./index.scss";



const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    }
  },
  checked: {}
};

class BpaCheckboxContainer extends React.Component {
  state = {
    fieldValue: true
  };

  handleChange = name => event => {
    const { jsonPath, approveCheck, fieldValue } = this.props;
    approveCheck(jsonPath, !fieldValue);
  };

  componentWillReceiveProps(nextProps) {
    let { fieldValue, jsonPath, approveCheck } = nextProps;
    if (this.props.fieldValue != fieldValue) {
      approveCheck(jsonPath, fieldValue)
    }
  }

  render() {
    let {
      label = {},
      placeholder = {},
      jsonPath,
      iconObj = {},
      value,
      dropdownData,
      data = [],
      optionValue = "code",
      optionLabel = "code",
      sourceJsonPath,
      classes,
      componentJsonpath,
      fieldValue,
      localizationLabels,
      ...rest
    } = this.props;

    let translatedLabel = "";
    if (label && label.labelKey && Array.isArray(label.labelKey)) {
      label.labelKey.forEach(key => {
        translatedLabel += getLocaleLabels(key, key, localizationLabels) + " ";
      })
    } else {
      translatedLabel = getLocaleLabels(
        label.labelName,
        label.labelKey,
        localizationLabels
      );
    }
    

    return (
      <FormGroup row>
        <FormControlLabel
          classes={{ label: "bpacheckbox-label" }}
          key={fieldValue}
          control={
            <Checkbox
              checked={fieldValue}
              onChange={this.handleChange(fieldValue)}
              value={fieldValue}
              classes={{
                root: classes.root,
                checked: classes.checked
              }}
            />
          }
          label={translatedLabel}
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  let fieldValue = false;
  const { screenConfiguration, app } = state;
  const { localizationLabels } = app;
  const { jsonPath } = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  if (jsonPath) fieldValue = get(preparedFinalObject, jsonPath);
  return { preparedFinalObject, jsonPath, fieldValue, localizationLabels };
};

const mapDispatchToProps = dispatch => {
  return {
    approveCheck: (jsonPath, value) => {
      dispatch(prepareFinalObject(jsonPath, value));
    }
  };
};

BpaCheckboxContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BpaCheckboxContainer)
);
