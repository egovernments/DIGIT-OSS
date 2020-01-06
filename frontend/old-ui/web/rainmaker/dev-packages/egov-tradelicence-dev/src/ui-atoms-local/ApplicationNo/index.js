import React from "react";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import "./index.css";

function ApplicationNoContainer(props) {
  const { number } = props;
  return <div className="application-no-container"><LabelContainer labelName="Application No." labelKey ={"TL_APPLICATION_NO_CODE"} dynamicArray={[number]}/></div>;
}

export default ApplicationNoContainer;
