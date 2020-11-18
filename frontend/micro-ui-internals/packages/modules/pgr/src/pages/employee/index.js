import React from "react";
import { Switch, Route } from "react-router-dom";

import { BackButton, ActionBar, Menu, SubmitBar } from "@egovernments/digit-ui-react-components";
import { ComplaintDetails } from "./ComplaintDetails";
import { CreateComplaint } from "./CreateComplaint";
import Inbox from "./Inbox";
import { Employee } from "../../constants/Routes";

const Complaint = () => {
  return (
    <React.Fragment>
      <BackButton>Back</BackButton>
      <Switch>
        <Route path={Employee.ComplaintDetails + ":id"} component={() => <ComplaintDetails />} />
        <Route path={Employee.CreateComplaint} component={() => <CreateComplaint />} />
        <Route path={Employee.Inbox} component={Inbox} />
      </Switch>
      <ActionBar>
        <Menu options={["Assign Complaint", "Reject Complaint"]} />
        <SubmitBar label="Take Action" />
      </ActionBar>
    </React.Fragment>
  );
};

export default Complaint;
