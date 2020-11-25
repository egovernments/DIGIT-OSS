import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";

import initLibraries from "@egovernments/digit-ui-libraries";
import PGRApp from "@egovernments/digit-ui-module-pgr";
import { Body, TopBar, Header } from "@egovernments/digit-ui-react-components";

initLibraries();

const userServiceData = {
  userInfo: {
    id: 23349,
    uuid: "530968f3-76b3-4fd1-b09d-9e22eb1f85df",
    userName: "9404052047",
    name: "Aniket T",
    mobileNumber: "9404052047",
    emailId: "xc@gmail.com",
    locale: null,
    type: "CITIZEN",
    roles: [
      {
        name: "Citizen",
        code: "CITIZEN",
        tenantId: "pb",
      },
    ],
    active: true,
    tenantId: "pb",
  },
};

Digit.SessionStorage.set("citizen.userServiceData", userServiceData);
const citAuth = process.env.REACT_APP_CITIZEN_AUTH;

Digit.SessionStorage.set("citizen.token", citAuth);
window.sessionStorage.setItem("citizen.token", citAuth);

const GetLink = ({ to, children }) => (
  <Link to={to} style={{ marginLeft: 16 }}>
    {children}
  </Link>
);

ReactDOM.render(
  <Router>
    <Body>
      <TopBar />
      <Switch>
        <Route path="/digit-ui/pgr">
          <p>PGR</p>
          <PGRApp stateCode="pb" cityCode="pb.amritsar" moduleCode="PGR" />
        </Route>
        <Route>
          <Header>Home page</Header>
          <GetLink to="/digit-ui/pgr/citizen/create-complaint">Create Complaint</GetLink>
          <br />
          <GetLink to="/digit-ui/pgr/citizen/complaints">My Complaint</GetLink>
        </Route>
      </Switch>
    </Body>
  </Router>,
  document.getElementById("root")
);
