import React from "react";
import { LabelContainer } from "egov-ui-framework/ui-containers";

const styles = {
  backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "19px",
  paddingRight: "19px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px"
};

function ApplicationNoContainer(props) {
  const { number } = props;
  return <div style={styles}>
  <LabelContainer
    labelName={'Application No.'}
    labelKey={'NOC_COMMON_TABLE_COL_APP_NO_LABEL'}
  />
  <span> </span>{number}</div>;
}

export default ApplicationNoContainer;
