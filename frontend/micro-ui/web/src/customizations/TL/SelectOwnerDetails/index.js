import React, { useState } from "react";
import { FormStep } from "@egovernments/digit-ui-react-components";

import IndividualOwnerDetails from "./SelectIndividualOwnerDetails";
import SelectNonIndividualOwner from "./SelectNonIndividualOwner";

const SelectOwnerDetails = ({ t, config, onSelect, userType, formData }) => {
  //console.log(formData?.ownershipCategory, ">>>>>>>");

  return (
    <React.Fragment>
      {formData?.ownershipCategory?.code?.includes("INDIVIDUAL") ? (
        <IndividualOwnerDetails
          {...{ t, config, onSelect, userType, formData }}
        />
      ) : (
        <SelectNonIndividualOwner
          {...{ t, config, onSelect, userType, formData }}
        />
      )}
    </React.Fragment>
  );
};

const customize = () => {
  window.Digit.ComponentRegistryService.setComponent(
    "SelectOwnerDetails",
    SelectOwnerDetails
  );
};

export default customize;
