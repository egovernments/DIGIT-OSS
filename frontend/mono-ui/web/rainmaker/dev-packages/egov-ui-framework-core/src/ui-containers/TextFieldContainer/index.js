import React from "react";
import { connect } from "react-redux";
import { TextfieldWithIcon, Tooltip } from "../../ui-molecules";
import MenuItem from "@material-ui/core/MenuItem";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {
  epochToYmd,
  getLocaleLabels,
  appendModulePrefix
} from "../../ui-utils/commons";

class TextFieldContainer extends React.Component {
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
      return (
        <TextfieldWithIcon
          label={translatedLabel}
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
    sourceJsonPath
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
    } else if (sourceJsonPath) {
      dropdownData = constructDropdown(
        get(preparedFinalObject, sourceJsonPath, [])
      );
    }
  }

  return { value: fieldValue, dropdownData, state, localizationLabels };
};

export default connect(mapStateToProps)(TextFieldContainer);
