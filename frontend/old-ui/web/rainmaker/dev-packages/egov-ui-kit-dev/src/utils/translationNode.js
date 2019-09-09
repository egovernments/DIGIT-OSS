import React from "react";
import { connect } from "react-redux";
import { getTranslatedLabel } from "./commons";
import { Label } from "../components";

const mapStateToProps = (state, ownProps) => {
  const { label, defaultLabel, dynamicValue, ...rest } = ownProps;
  const { localizationLabels } = state.app;
  const localizedLabel = getTranslatedLabel(label, localizationLabels);
  const translatedLabel = localizedLabel === label ? (defaultLabel ? defaultLabel : localizedLabel) : localizedLabel;
  return { ...rest, dynamicValue, label: translatedLabel };
};

export default connect(mapStateToProps)(Label);
