import React, { Component } from "react";
import { connect } from "react-redux";
import { AutoSuggest } from "../../ui-atoms-local";
import { findItemInArrayOfObject } from "../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  transformById,
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";

const localizationLabels = JSON.parse(getLocalization("localization_en_IN"));
const transfomedKeys = transformById(localizationLabels, "code");

class AutoSuggestor extends Component {
  onSelect = value => {
    const { onChange } = this.props;
    //Storing multiSelect values not handled yet
    onChange({ target: { value: value } });
  };

  render() {
    const {
      value,
      preparedFinalObject,
      label,
      placeholder,
      suggestions,
      ...rest
    } = this.props;
    let translatedLabel = getLocaleLabels(
      label.labelName,
      label.labelKey,
      transfomedKeys
    );
    let translatedPlaceholder = getLocaleLabels(
      placeholder.labelName,
      placeholder.labelKey,
      transfomedKeys
    );
    //For multiSelect to be enabled, pass "isMulti: true" in props.
    return (
      <div>
        <AutoSuggest
          onSelect={this.onSelect}
          suggestions={suggestions}
          value={value}
          label={translatedLabel}
          placeholder={translatedPlaceholder}
          {...rest}
        />
      </div>
    );
  }
}

const getLocalisedSuggestions = suggestions => {
  return (
    suggestions &&
    suggestions.length > 0 &&
    suggestions.map((option, key) => {
      option.name = getLocaleLabels(
        option.code,
        `TL_${option.code}`,
        transfomedKeys
      );
      return option;
    })
  );
};

const mapStateToProps = (state, ownprops) => {
  let {
    jsonPath,
    value,
    sourceJsonPath,
    labelsFromLocalisation,
    data,
    labelName,
    valueName
  } = ownprops;
  let suggestions =
    data && data.length > 0
      ? data
      : get(state.screenConfiguration.preparedFinalObject, sourceJsonPath, []);
  value = value
    ? value
    : get(state.screenConfiguration.preparedFinalObject, jsonPath);
  //To fetch corresponding labels from localisation for the suggestions, if needed.
  // console.log("========>", value, suggestions);
  if (value) {
    value = Array.isArray(value) ? value : [value]; // Convert to array in case of single object
    value.map(item => {
      return {
        label: get(item, labelName) == null ? item.label : get(item, labelName),
        value: get(item, valueName) == null ? item.value : get(item, valueName)
      };
    });
  }
  // value = { label: "Emmm", value: "EMP" };
  if (labelsFromLocalisation) {
    suggestions = getLocalisedSuggestions(
      JSON.parse(JSON.stringify(suggestions))
    );
  }
  //To find correct option object as per the value (for showing the selected value).
  const selectedItem = findItemInArrayOfObject(suggestions, item => {
    if (item.code === value) {
      return true;
    } else return false;
  });
  //Make value object as the Autosuggest expects.
  if (selectedItem && selectedItem.name) {
    value = { label: selectedItem.name, value: selectedItem.code };
  }
  return { value, jsonPath, suggestions };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoSuggestor);
