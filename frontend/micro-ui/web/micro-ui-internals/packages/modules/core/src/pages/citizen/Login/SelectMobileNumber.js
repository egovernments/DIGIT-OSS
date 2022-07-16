import React from "react";
import { CardText, FormStep } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

const SelectMobileNumber = ({ t, onSelect, showRegisterLink, mobileNumber, onMobileChange, config, canSubmit }) => {
  return (
    <FormStep
      isDisabled={!(mobileNumber.length === 10 && canSubmit)}
      onSelect={onSelect}
      config={config}
      t={t}
      componentInFront="+91"
      onChange={onMobileChange}
      value={mobileNumber}
    ></FormStep>
  );
};

export default SelectMobileNumber;
