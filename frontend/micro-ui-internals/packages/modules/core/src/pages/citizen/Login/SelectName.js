import React from "react";
import { FormStep } from "@egovernments/digit-ui-react-components";

const SelectName = ({ config, onSelect }) => {
  return <FormStep config={config} onSelect={onSelect}></FormStep>;
};

export default SelectName;
