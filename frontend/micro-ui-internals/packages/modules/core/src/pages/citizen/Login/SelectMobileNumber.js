import React from "react";
import { FormStep } from "@egovernments/digit-ui-react-components";

const SelectMobileNumber = ({ onSelect, config }) => {
  return <FormStep onSelect={onSelect} config={config}></FormStep>;
};

export default SelectMobileNumber;
