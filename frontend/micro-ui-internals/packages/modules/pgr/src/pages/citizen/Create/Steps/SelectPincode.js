import { FormStep } from "@egovernments/digit-ui-react-components";
import React from "react";
import useTenants from "../../../../hooks/useTenants";

const SelectPincode = ({ config, onSelect }) => {
  const goNext = (data) => {
    onSelect(data);
  };

  const tenants = useTenants();
  console.log("pincodceeeee", tenants);

  const onSkip = () => onSelect();
  return <FormStep config={config} onSelect={goNext} onSkip={onSkip}></FormStep>;
};

export default SelectPincode;
