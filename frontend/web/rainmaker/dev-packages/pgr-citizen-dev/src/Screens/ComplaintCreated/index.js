import React from "react";
import { ComplaintSubmited } from "modules/common";
import Label from "egov-ui-kit/utils/translationNode";

const ComplaintCreated = props => {
  return (
    <ComplaintSubmited
      /* Mseva 2.0 changes */
      homeRoute="/"
      lastLabel={
        <Label
          id="complaint-submitted-success-message"
          label="CS_COMPLAINT_SUBMITTED_LABEL2"
        />
      }
      {...props}
    />
  );
};

export default ComplaintCreated;
