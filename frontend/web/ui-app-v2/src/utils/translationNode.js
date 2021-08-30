import React from "react";
import { connect } from "react-redux";
import { getTranslatedLabel } from "./commons";
import Label from "../components/Label";

const mapStateToProps = (state, ownProps) => {
  const { label, ...rest } = ownProps;
  const { localizationLabels } = state.app;
  const translatedLabel = getTranslatedLabel(label, localizationLabels);
  return { ...rest, label: translatedLabel };
};

export default connect(mapStateToProps)(Label);
