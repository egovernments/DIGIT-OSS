import React from "react";
import { Label } from "egov-ui-framework/ui-atoms";
import get from "lodash/get";
import { connect } from "react-redux";
import {
  getTranslatedLabel,
  transformById
} from "../../ui-config/screens/specs/utils/index";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";

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

const localizationLabels = JSON.parse(getLocalization("localization_en_IN"));

class LabelContainer extends React.Component {
  render() {
    let { labelName, labelKey, fieldValue, ...rest } = this.props;
    let transfomedKeys = transformById(localizationLabels, "code");
    let translatedLabel = getLocaleLabelsforTL(
      labelName,
      labelKey,
      transfomedKeys
    );
    return (
      <Label label={fieldValue ? fieldValue : translatedLabel} {...rest} />
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  let fieldValue = "";
  const { jsonPath } = ownprops;
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  if (jsonPath) {
    fieldValue = get(preparedFinalObject, jsonPath);
  }

  return { fieldValue };
};

export default connect(mapStateToProps)(LabelContainer);