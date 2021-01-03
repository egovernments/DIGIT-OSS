import React from "react";
import { FormStep } from "@egovernments/digit-ui-react-components";

const SelectMobileNumber = ({ t, onSelect, config }) => {
  return <FormStep onSelect={onSelect} config={config} t={t}></FormStep>;
};

export default SelectMobileNumber;
