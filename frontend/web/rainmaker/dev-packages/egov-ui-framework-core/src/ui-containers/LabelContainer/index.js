import React from "react";
import { Label } from "../../ui-atoms";
import get from "lodash/get";
import { connect } from "react-redux";
import { getLocaleLabels, appendModulePrefix } from "../../ui-utils/commons";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";
import isEmpty from "lodash/isEmpty";

class LabelContainer extends React.Component {
  render() {
    let {
      labelName,
      labelKey,
      localePrefix,
      fieldValue,
      localizationLabels,
      dynamicArray,
      checkValueForNA,
      ...rest
    } = this.props;

    let translatedLabel = getLocaleLabels(
      labelName,
      labelKey,
      localizationLabels
    );

    if (dynamicArray) {
      if (dynamicArray.length > 1) {
        dynamicArray.forEach((item, index) => {
          translatedLabel = translatedLabel.replace(
            new RegExp("\\{" + index + "\\}", "gm"),
            item
          );
        });
      } else {
        let index = 0;
        translatedLabel = translatedLabel.replace(
          new RegExp("\\{" + index + "\\}", "gm"),
          dynamicArray[0]
        );
      }
    }

    if (typeof fieldValue === "boolean") {
      fieldValue = fieldValue ? getLocaleLabels("SCORE_YES","SCORE_YES") : getLocaleLabels("SCORE_NO","SCORE_NO");
    }

    let fieldLabel =
      typeof fieldValue === "string"
        ? getLocaleLabels(
            fieldValue,

            localePrefix && !isEmpty(localePrefix)
              ? appendModulePrefix(fieldValue, localePrefix)
              : fieldValue,
            localizationLabels
          )
        : fieldValue;
    let labelValue = fieldValue ? fieldLabel : translatedLabel;
    labelValue =
      checkValueForNA && typeof checkValueForNA === "function"
        ? checkValueForNA(labelValue)
        : labelValue;
    return (
      <Label
        data-localization={
          labelKey ? labelKey : labelName ? labelName : fieldLabel
        }
        label={labelValue}
        {...rest}
      />
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  let fieldValue = "";
  const { localizationLabels } = state.app;
  const { jsonPath, callBack } = ownprops;
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  if (jsonPath) {
    fieldValue = get(preparedFinalObject, jsonPath);
    if (callBack && typeof callBack === "function") {
      fieldValue = callBack(fieldValue);
    }
  }
  return { fieldValue, localizationLabels };
};

export default connect(
  mapStateToProps,
  {}
)(LabelContainer);
