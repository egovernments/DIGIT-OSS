import React from "react";
import { Card, CardHeader, CardSubHeader, CardLabel, TextInput } from "@egovernments/digit-ui-react-components";

export const CreateComplaint = () => {
  return (
    <Card>
      <CardSubHeader>New Complaint</CardSubHeader>
      <h2 className="heading-m">Complaint Details</h2>
      <CardLabel>Mobile Number *</CardLabel>
      <TextInput />
    </Card>
  );
};
