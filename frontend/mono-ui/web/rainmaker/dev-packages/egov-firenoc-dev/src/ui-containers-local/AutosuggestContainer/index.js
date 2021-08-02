import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  appendModulePrefix, getLocaleLabels, sortDropdownNames
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { Component } from "react";
import { connect } from "react-redux";
import { AutoSuggest } from "../../ui-atoms-local";
import { findItemInArrayOfObject } from "../../ui-utils/commons";

// const localizationLabels = JSON.parse(getLocalization("localization_en_IN"));
// const transfomedKeys = transformById(localizationLabels, "code");
class AutoSuggestor extends Component {
  onSelect = value => {
    const { onChange } = this.props;
    //Storing multiSelect values not handled yet
    onChange({ target: { value: value ? value.value : null } });
  };
  shouldComponentUpdate = (nextProps, nextState) => {
    let {
      value,
      suggestions = [],
      disabled = false,
      locale,
      required
    } = this.props;
    let {
      value: valueNew,
      suggestions: suggestionsNew = [],
      disabled: disabledNew = false,
      locale: localeNew,
      required: requiredNew
    } = nextProps;
    if (locale != localeNew ||
      value != valueNew ||
      disabled != disabledNew ||
      required != requiredNew ||
      Array.isArray(suggestionsNew) != Array.isArray(suggestions) ||
      suggestions.length != suggestionsNew.length) {
      return true
    }
    return false
  }

  render() {
    let {
      value,
      preparedFinalObject,
      label,
      placeholder,
      suggestions,
      className,
      localizationLabels,
      labelsFromLocalisation,
      localePrefix,
      defaultSort = true,
      ...rest
    } = this.props;
    let translatedLabel = getLocaleLabels(
      label.labelName,
      label.labelKey,
      localizationLabels
    );
    let translatedPlaceholder = getLocaleLabels(
      placeholder.labelName,
      placeholder.labelKey,
      localizationLabels
    );
    //For multiSelect to be enabled, pass isMultiSelect=true in props.

    //To fetch corresponding labels from localisation for the suggestions, if needed.
    if (labelsFromLocalisation) {
      suggestions = getLocalisedSuggestions(
        JSON.parse(JSON.stringify(suggestions)),
        localePrefix,
        localizationLabels,
        defaultSort
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



    return (
      <div>
        <AutoSuggest
          onSelect={this.onSelect}
          suggestions={suggestions}
          value={value}
          className={className}
          label={translatedLabel}
          placeholder={translatedPlaceholder}
          defaultSort={defaultSort}
          {...rest}
        />
      </div>
    );
  }
}

const getLocalisedSuggestions = (suggestions, localePrefix, transfomedKeys, defaultSort) => {
  suggestions = (
    suggestions &&
    Array.isArray(suggestions) &&
    suggestions.length > 0 &&
    suggestions.map((option, key) => {
      option.name = getLocaleLabels(
        option.code,
        localePrefix && !isEmpty(localePrefix)
          ? appendModulePrefix(option.code, localePrefix)
          : option.name,
        transfomedKeys
      );
      return option;
    })
  );
  suggestions = defaultSort && suggestions && Array.isArray(suggestions) ? suggestions.sort(sortDropdownNames) : suggestions || [];
  return suggestions;
};

const mapStateToProps = (state, ownprops) => {
  const { localizationLabels, locale } = state.app;
  let {
    jsonPath,
    value,
    sourceJsonPath,
    labelsFromLocalisation,
    data,
    localePrefix
  } = ownprops;
  let suggestions =
    data && data.length > 0
      ? data
      : get(state.screenConfiguration.preparedFinalObject, sourceJsonPath, []);
  value = value
    ? value
    : get(state.screenConfiguration.preparedFinalObject, jsonPath);

  // console.log(value, suggestions);
  return { value, jsonPath, suggestions, localizationLabels, locale };
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
