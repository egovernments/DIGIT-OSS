import React from "react";
import { Switch, Route } from "react-router-dom";

import { BackButton, ActionBar, Menu, SubmitBar } from "@egovernments/digit-ui-react-components";
import { ComplaintDetails } from "./ComplaintDetails";
import { CreateComplaint } from "./CreateComplaint";

import { EmployeeRoutes } from "../../constants/Routes";

const Complaint = () => {
  return (
    <React.Fragment>
      <BackButton>Back</BackButton>
      <Switch>
        <Route path={EmployeeRoutes.ComplaintDetails + ":id"} component={() => <ComplaintDetails />} />
        <Route path={EmployeeRoutes.CreateComplaint} component={() => <CreateComplaint />} />
      </Switch>
      <ActionBar>
        <Menu options={["Assign Complaint", "Reject Complaint"]} />
        <SubmitBar label="Take Action" />
      </ActionBar>
    </React.Fragment>
  );
};

export default Complaint;
