import React from "react";
import { connect } from "react-redux";
import { TextfieldWithIcon, Tooltip } from "../../ui-molecules";
import MenuItem from "@material-ui/core/MenuItem";
import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";
import {
  epochToYmd,
  getLocaleLabels,
  appendModulePrefix
} from "../../ui-utils/commons";
import { sortDropdownLabels } from "egov-ui-framework/ui-utils/commons";

class TextFieldContainer extends React.PureComponent{
  componentDidMount() {
    const { hasDependant, onChange, value } = this.props;
    if (hasDependant && value) {
      onChange({ target: { value } });
    }
  }

  render() {
    let {
      label = {},
      placeholder = {},
      localePrefix = {},
      jsonPath,
      iconObj = {},
      value,
      dropdownData,
      data = [],
      optionValue = "code",
      optionLabel = "code",
      sourceJsonPath,
      index,
      componentJsonpath,
      hasLocalization,
      localizationLabels,
      state,
      infoIcon,
      dispatch,
      title,
      errorMessage,
      error,
      defaultSort=true,
      disabled=false,
      multiline=false,
      rows="1",
      ...rest
    } = this.props;
    if (!isEmpty(iconObj) && iconObj.onClickDefination) {
      iconObj = {
        ...iconObj,
        onClick: () =>
          iconObj.onClickDefination.callBack(state, dispatch, {
            index,
            componentJsonpath
          })
      };
    }

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
    let translateddefaultErrorMsg = getLocaleLabels(
      "Invalid input",
      "ERR_DEFAULT_INPUT_FIELD_MSG",
      localizationLabels
    );
    errorMessage = error
      ? getLocaleLabels(
          translateddefaultErrorMsg,
          errorMessage,
          localizationLabels
        )
      : "";
    if (dropdownData.length > 0) {
      dropdownData=defaultSort?dropdownData&&Array.isArray(dropdownData)&&dropdownData.sort(sortDropdownLabels):dropdownData||[];
      return (
        <TextfieldWithIcon
          label={translatedLabel}
          disabled={disabled}
          placeholder={translatedPlaceholder}
          iconObj={iconObj}
          value={value ? value : translatedPlaceholder}
          {...rest}
          error={error}
          helperText={errorMessage}
        >
          <MenuItem value={translatedPlaceholder} disabled>
            <div className="select-field-placeholder">
              {translatedPlaceholder}
            </div>
          </MenuItem>
          {hasLocalization === false
            ? dropdownData.map((option, key) => (
                <MenuItem key={key} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            : dropdownData.map((option, key) => (
                <MenuItem key={key} value={option.value}>
                  {getLocaleLabels(
                    option.value,
                    localePrefix && !isEmpty(localePrefix)
                      ? appendModulePrefix(option.value, localePrefix)
                      : option.label,
                    localizationLabels
                  )}
                </MenuItem>
              ))}
        </TextfieldWithIcon>
      );
    } else {
      return this.props.select ? (
        <div>
          <TextfieldWithIcon
            label={translatedLabel}
            placeholder={translatedPlaceholder}
            iconObj={iconObj}
            value={value ? value : translatedPlaceholder}
            {...rest}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            error={error}
            helperText={errorMessage}
          >
            <MenuItem value={translatedPlaceholder} disabled>
              <div className="select-field-placeholder">
                {translatedPlaceholder}
              </div>
            </MenuItem>
          </TextfieldWithIcon>
          {title && !isEmpty(title) && infoIcon && (
            <Tooltip val={title} icon={infoIcon} />
          )}
        </div>
      ) : (
        <div>
          <TextfieldWithIcon
            label={translatedLabel}
            placeholder={translatedPlaceholder}
            iconObj={iconObj}
            value={
              this.props.type === "date" && !value
                ? translatedPlaceholder
                : value
            }
            {...rest}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            error={error}
            helperText={errorMessage}
          />
          {title && !isEmpty(title) && infoIcon && (
            <Tooltip val={title} icon={infoIcon} />
          )}
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownprops) => {
  const {
    jsonPath,
    value,
    select,
    data,
    optionValue,
    optionLabel,
    sourceJsonPath,
    cityDropdown,
    autoSelect
  } = ownprops;
  const { screenConfiguration, app } = state;
  const { localizationLabels } = app;
  const { preparedFinalObject } = screenConfiguration;
  let fieldValue =
    value === undefined ? get(preparedFinalObject, jsonPath) : value;
  // Convert epoch to YYYY-MM-DD and set date picker value
  if (ownprops.type && ownprops.type === "date")
    fieldValue = epochToYmd(fieldValue);
  let dropdownData = [];
  if (select) {
    const constructDropdown = dt => {
      return dt.map(d => {
        return {
          value: d[optionValue],
          label: d[optionLabel]
        };
      });
    };
    if (data && data.length > 0) {
      dropdownData = constructDropdown(data || []);
      // if autoSelect is true and dropDownData is one, then select the value by default
      if( data.length ==1 && autoSelect){
        fieldValue = dropdownData[0].value;
        if(!get(preparedFinalObject,jsonPath)){
            set(preparedFinalObject,jsonPath,fieldValue);
        }
     }
    } else if (sourceJsonPath) {
      dropdownData = constructDropdown(
        get(preparedFinalObject, sourceJsonPath, [])
      );
    } else if (cityDropdown) {
      dropdownData = constructDropdown(get(state, cityDropdown, []));
    }
  }
  let disabled=ownprops.disabled;
if(ownprops.checkFieldDisable){
  let dependantJsonPath=ownprops.jsonPath;
  dependantJsonPath=dependantJsonPath.replace(ownprops.jsonPathRemoveKey,ownprops.dependantField)
  disabled= get(preparedFinalObject, dependantJsonPath, false)
}
  return { value: fieldValue, dropdownData, state, localizationLabels ,disabled};
};

export default connect(mapStateToProps)(TextFieldContainer);
