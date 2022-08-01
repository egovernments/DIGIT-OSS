import React from "react";
import { FormStep } from "@egovernments/digit-ui-react-components";

const SelectName = ({ config, onSelect, t, isDisabled }) => {
  return <FormStep config={config} onSelect={onSelect} t={t} isDisabled={isDisabled}></FormStep>;
};

export default SelectName;
