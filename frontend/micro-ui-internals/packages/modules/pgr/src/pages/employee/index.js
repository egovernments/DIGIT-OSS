import React, { useState } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import { BackButton, ActionBar, Menu, SubmitBar } from "@egovernments/digit-ui-react-components";
import { ComplaintDetails } from "./ComplaintDetails";
import { CreateComplaint } from "./CreateComplaint";
import Inbox from "./Inbox";
import { Employee } from "../../constants/Routes";
import Response from "./Response";

const Complaint = ({ stateCode, cityCode }) => {
  const [displayMenu, setDisplayMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  const match = useRouteMatch();

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
          <Route path={match.url + Employee.CreateComplaint} component={() => <CreateComplaint stateCode={stateCode} cityCode={cityCode} />} />
          <Route
            path={match.url + Employee.ComplaintDetails + ":id"}
            component={() => <ComplaintDetails stateCode={stateCode} cityCode={cityCode} />}
          />
          <Route path={match.url + Employee.Inbox} component={() => <Inbox stateCode={stateCode} cityCode={cityCode} />} />
          <Route path={match.url + Employee.Response} component={() => <Response stateCode={stateCode} cityCode={cityCode} />} />
        </Switch>
      </div>
      {/* <ActionBar>
        {displayMenu ? <Menu options={["Assign Complaint", "Reject Complaint"]} onSelect={popupCall} /> : null}
        <SubmitBar label="Take Action" onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar> */}
    </React.Fragment>
  );
};

export default Complaint;
