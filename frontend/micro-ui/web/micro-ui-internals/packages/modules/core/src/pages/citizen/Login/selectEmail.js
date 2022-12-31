import React from "react";
import { CardText, FormStep } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

const SelectEmail = ({ t, onSelect, showRegisterLink, email, onEmailChange, config }) => {
  return (
    <FormStep
    //   isDisabled={email.length !== 10}
      onSelect={onSelect}
      config={config}
      t={t}
      onChange={onEmailChange}
      value={email}
    ></FormStep>
  );
};

export default SelectEmail;
