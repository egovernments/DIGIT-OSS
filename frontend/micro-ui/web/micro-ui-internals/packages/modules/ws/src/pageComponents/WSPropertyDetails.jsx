import { FormStep, Label, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Controller } from "react-hook-form";

const WSPropertyDetails = () => {
  return (
    <React.Fragment>
      <FormStep>
        <LabelFieldPair>
          <Label>Property Id</Label>
          {/* <Controller></Controller> */}
        </LabelFieldPair>
        <LabelFieldPair>
          <Label>Owner Name</Label>
        </LabelFieldPair>
        <LabelFieldPair>
          <Label>Address</Label>
        </LabelFieldPair>
      </FormStep>
    </React.Fragment>
  );
};

export default WSPropertyDetails;
