import { FormStep } from "@egovernments/digit-ui-react-components";
import React from "react";

const SelectPincode = ({ config, onSelect }) => {
  const goNext = (data) => {
    onSelect(data);
  };

  const onSkip = () => onSelect();
  return <FormStep config={config} onSelect={goNext} onSkip={onSkip}></FormStep>;
};

export default SelectPincode;
