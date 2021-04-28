import React, { Component } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import Switch from "../../ui-atoms-local/Switch";
import get from "lodash/get";
import { connect } from "react-redux";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import "./index.css";

class SwitchWithLabel extends Component {
  onSwitchChange = (event, checked) => {
    const {
      screenConfig,
      compJPath,
      multiItems,
      screenKey,
      handleField
    } = this.props;

    if (compJPath) {
      if (multiItems.length > 0) {
        for (var i = 0; i < multiItems.length; i++) {
          handleField(
            screenKey,
            `${compJPath}[${i}].item${i}.children.cardContent.children.asmtDetailsCardContainer.children.currentAssignment`,
            "props.value",
            false
          );
        }
      }
    }
    this.props.onChange({ target: { value: event.target.checked } });
    // prepareFinalObject(jsonPath, event.target.checked);
  };

  render() {
    const {
      items,
      FormControlProps,
      SwitchProps,
      disabled = false,
      value,
      valueFromAPI,
      localizationLabels
    } = this.props;
    let translatedLabels = items.map(item => {
      return getLocaleLabels(
        item.label.labelName,
        item.label.labelKey,
        localizationLabels
      );
    });
    return (
      <FormGroup>
        {items.map((item, index) => {
          return (
            <FormControlLabel
              className={"form-control-switch"}
              key={`form-${index}`}
              control={
                <Switch
                  checked={value || valueFromAPI || false}
                  value={value || valueFromAPI || false}
                  onChange={event => this.onSwitchChange(event)}
                  disabled={disabled}
                  {...SwitchProps}
                />
              }
              label={translatedLabels[index]}
              {...FormControlProps}
            />
          );
        })}
      </FormGroup>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration, app } = state;
  const { screenConfig, preparedFinalObject } = screenConfiguration;
  const { value, screenKey, compJPath, jsonPath } = ownprops;
  const valueFromAPI = get(preparedFinalObject, jsonPath);
  const multiItems = get(screenConfig[screenKey], compJPath, []);
  const { localizationLabels } = app;
  return { multiItems, screenConfig, valueFromAPI, localizationLabels };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    handleField: (screenKey, componentJSONPath, property, value) =>
      dispatch(handleField(screenKey, componentJSONPath, property, value))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchWithLabel);
