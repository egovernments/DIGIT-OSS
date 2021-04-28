import React from "react";
import { connect } from "react-redux";
import { TextfieldWithIcon } from "egov-ui-framework/ui-molecules";
import MenuItem from "@material-ui/core/MenuItem";
import get from "lodash/get";
import {
  getTranslatedLabel,
  transformById
} from "../../ui-config/screens/specs/utils";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";

const localizationLabels = JSON.parse(getLocalization("localization_en_IN"));

const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return label;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

class TextFieldContainer extends React.Component {
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
      ...rest
    } = this.props;
    let transfomedKeys = transformById(localizationLabels, "code");
    let translatedLabel = getLocaleLabelsforTL(
      label.labelName,
      label.labelKey,
      transfomedKeys
    );
    let translatedPlaceholder = getLocaleLabelsforTL(
      placeholder.labelName,
      placeholder.labelKey,
      transfomedKeys
    );
    if (dropdownData.length > 0) {
      return (
        <TextfieldWithIcon
          label={translatedLabel}
          placeholder={translatedPlaceholder}
          iconObj={iconObj}
          value={value ? value : translatedPlaceholder}
          {...rest}
        >
          <MenuItem value={translatedPlaceholder} disabled>
            {translatedPlaceholder}
          </MenuItem>
          {dropdownData.map((option, key) => (
            <MenuItem key={key} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextfieldWithIcon>
      );
    } else {
      return (
        <TextfieldWithIcon
          label={translatedLabel}
          placeholder={translatedPlaceholder}
          iconObj={iconObj}
          value={value}
          {...rest}
        />
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
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const fieldValue =
    value === undefined ? get(preparedFinalObject, jsonPath) : value;
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
  return { value: fieldValue, dropdownData };
};

export default connect(
  mapStateToProps,
  {}
)(TextFieldContainer);
