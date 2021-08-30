import React from "react";
import { connect } from "react-redux";
import { getTranslatedLabel } from "./commons";
import { Label } from "../components";

const mapStateToProps = (state, ownProps) => {
  const { label, defaultLabel, dynamicArray, ...rest } = ownProps;
  const { localizationLabels } = state.app;
  const array =
    dynamicArray &&
    dynamicArray.map((item, index) => {
      if (typeof item !== "number") {
        return getTranslatedLabel(item, localizationLabels);
      } else {
        return item;
      }
    });
  const localizedLabel = getTranslatedLabel(label, localizationLabels);
  const translatedLabel = localizedLabel === label ? (defaultLabel ? defaultLabel : localizedLabel) : localizedLabel;
  return { ...rest, label: translatedLabel, labelKey: label, dynamicArray: array };
};

export default connect(mapStateToProps)(Label);
