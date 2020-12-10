import React from "react";
import { FormStep } from "@egovernments/digit-ui-react-components";

const SelectDetails = ({ config, onSelect, t }) => {
  return <FormStep config={config} onSelect={onSelect} t={t}></FormStep>;
};

export default SelectDetails;
