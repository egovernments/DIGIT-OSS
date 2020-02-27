import React from "react";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import {
  getQueryArg} from "egov-ui-framework/ui-utils/commons";
import "./index.css";

function licenceNoContainer(props) {
  
  const { number } = props;
  return <div className="application-no-container"><LabelContainer labelName="License No." labelKey ={"TL_LICENSE_NO_CODE"} dynamicArray={[number]}/></div>;
}
export default licenceNoContainer;
