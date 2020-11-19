import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";

import { BackButton, ActionBar, Menu, SubmitBar } from "@egovernments/digit-ui-react-components";
import { ComplaintDetails } from "./ComplaintDetails";
import { CreateComplaint } from "./CreateComplaint";
import Inbox from "./Inbox";
import { Employee } from "../../constants/Routes";

const Complaint = () => {
  const [displayMenu, setDisplayMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  function popupCall(option) {
    console.log("option", option);
    setDisplayMenu(false);
    setPopup(true);
  }
  return (
    <React.Fragment>
      <div className="ground-container">
        <BackButton>Back</BackButton>
        <Switch>
          <Route path={Employee.ComplaintDetails + ":id"} component={() => <ComplaintDetails action={popup} />} />
          <Route path={Employee.CreateComplaint} component={() => <CreateComplaint />} />
          <Route path={Employee.Inbox} component={Inbox} />
        </Switch>
      </div>
      <ActionBar>
        {displayMenu ? <Menu options={["Assign Complaint", "Reject Complaint"]} onSelect={popupCall} /> : null}
        <SubmitBar label="Take Action" onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar>
    </React.Fragment>
  );
};

export default Complaint;
