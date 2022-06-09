import React, { Component } from "react";
import { connect } from "react-redux";
import { AutoSuggest } from "../../ui-atoms";
import { findItemInArrayOfObject, sortDropdownNames } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  transformById,
  getLocaleLabels,
  appendModulePrefix
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";

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
      required:requiredNew
    } = nextProps;
    if (locale != localeNew ||
      value != valueNew ||
      disabled != disabledNew ||
      required!=requiredNew||
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
      required,
      errorText,
      disabled,
      localePrefix,
      defaultSort=true,
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
      localizationLabels
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
          helperText={required && errorText}
          error={errorText == "Required" && required}
          isClearable={true}
          defaultSort={defaultSort}
          required={required}
          disabled={disabled}
          {...rest}
        />
      </div>
    );
  }
}

const getLocalisedSuggestions = (suggestions, localePrefix, transfomedKeys,defaultSort) => {
    
   let result= suggestions && suggestions.length > 0 && Array.isArray(suggestions) &&    suggestions.map((option, key) => {
      option.name = getLocaleLabels(
        option.code,
        localePrefix && !isEmpty(localePrefix)
          ? appendModulePrefix(option.code, localePrefix)
          : option.name,
        transfomedKeys
      );
      return option;
    }) || [];
   
    return defaultSort?result&& Array.isArray(result)&&result.sort(sortDropdownNames): result;

    
    
  
};

const getErrorText = (obj, id) => {
  const keys = Object.keys(obj);
  let errorText = "";
  for(let i = 0; i < keys.length; i++){
    if(obj[keys[i]].id == id) {
      errorText = obj[keys[i]].errorText;
      break;
    }
  }
  return errorText;
}

const mapStateToProps = (state, ownprops) => {
  const { localizationLabels,locale } = state.app;
  let {
    jsonPath,
    value,
    sourceJsonPath,
    labelsFromLocalisation,
    data,
    localePrefix,
    canFetchValueFromJsonpath=true,
    helperText,
    id,
    formName,
    defaultSort=true
  } = ownprops;
  let errorText = helperText ? helperText : (formName && state.form[formName] && state.form[formName].fields ? getErrorText(state.form[formName].fields, id) : "");
  let suggestions =
    data && data.length > 0
      ? data
      : get(state.screenConfiguration.preparedFinalObject, sourceJsonPath, []);
   if(canFetchValueFromJsonpath){
    value = value
      ? value
      : (get(state.screenConfiguration.preparedFinalObject, jsonPath) ? get(state.screenConfiguration.preparedFinalObject, jsonPath) : get(state.common.prepareFormData, jsonPath));
  
   }   

  return { value, jsonPath, suggestions, localizationLabels, errorText,locale };
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
