import React, { useMemo } from "react";
import { Route, BrowserRouter as Router, Switch, useRouteMatch, matchPath, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SelectRating from "./pages/citizen/Rating/SelectRating";

import { BackButton, Header, HomeLink, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";
import { getI18n } from "react-i18next";
import FileComplaint from "./pages/citizen/FileComplaint/index";

import { NewApplication } from "./pages/employee/NewApplication";
import { MyApplications } from "./pages/citizen/MyApplications";
import ApplicationDetails from "./pages/citizen/ApplicationDetails";
import EmployeeApplicationDetails from "./pages/employee/ApplicationDetails";
import CollectPayment from "./pages/employee/CollectPayment";
import ApplicationAudit from "./pages/employee/ApplicationAudit";
import Response from "./pages/Response";

const EmployeeApp = ({ path, url, userType }) => {
  return (
    <Switch>
      <div className="ground-container">
        <BackButton>Back</BackButton>
        <PrivateRoute exact path={`${path}/`} component={() => <FSMLinks matchPath={path} userType={userType} />} />
        <PrivateRoute path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} />
        <PrivateRoute path={`${path}/application-details`} component={EmployeeApplicationDetails} />
        <PrivateRoute path={`${path}/response`} component={() => <Response parentRoute={path} />} />
        <PrivateRoute path={`${path}/collect-payment`} component={() => <CollectPayment parentRoute={path} />} />
        <PrivateRoute path={`${path}/application-audit`} component={() => <ApplicationAudit parentRoute={path} />} />
      </div>
    </Switch>
  );
};

const CitizenApp = ({ path }) => {
  return (
    <Switch>
      <div className="ground-container">
        <BackButton>Back</BackButton>
        <PrivateRoute path={`${path}/file-property`} component={() => <FileComplaint parentRoute={path} />} />
        <PrivateRoute path={`${path}/my-applications`} component={MyApplications} />
        <PrivateRoute path={`${path}/application-details`} component={ApplicationDetails} />
        <PrivateRoute path={`${path}/rate/:id`} component={() => <SelectRating parentRoute={path} />} />
        <PrivateRoute path={`${path}/response`} component={() => <Response parentRoute={path} />} />
      </div>
    </Switch>
  );
};

export const FSMModule = ({ deltaConfig = {}, stateCode, cityCode, moduleCode = "FSM", userType }) => {
  const { path, url } = useRouteMatch();
  const state = useSelector((state) => state);
  const language = state?.common?.selectedLanguage;
  const store = { data: {} }; //Digit.Services.useStore({}, { deltaConfig, stateCode, cityCode, moduleCode, language });

  if (Object.keys(store).length === 0) {
    return <Loader />;
  }

  console.log("fsm", userType, state, store);

  if (userType === "citizen") {
    return <CitizenApp path={path} />;
  } else {
    return <EmployeeApp path={path} url={url} userType={userType} />;
  }
};

export const FSMLinks = ({ matchPath, userType }) => {
  if (userType === "citizen") {
    return (
      <React.Fragment>
        <Header>Properties</Header>
        <HomeLink to={`${matchPath}/file-property`}>File a Property</HomeLink>
        <HomeLink to={`${matchPath}/`}>My Properties</HomeLink>
        <Header>Applications</Header>
        <HomeLink to={`${matchPath}/my-applications`}>My Applications</HomeLink>
        <Header>Other Services</Header>
        <HomeLink to={`${matchPath}/`}>Apply for Desludging</HomeLink>
      </React.Fragment>
    );
  } else {
    return (
      <div className="employee-app-container">
        <div className="ground-container">
          <div className="employeeCard">
            <div className="complaint-links-container">
              <div className="header">
                <span className="logo">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"
                      fill="white"
                    ></path>
                  </svg>
                </span>
                <span className="text">FSM</span>
              </div>
              <div className="body">
                <span className="link">
                  <Link to={`${matchPath}/inbox`}>Inbox</Link>
                </span>
                <span className="link">
                  <Link to={`${matchPath}/new-application/`}>New Desludging Application</Link>
                </span>
                <span className="link">
                  <Link to={`${matchPath}/application-audit/`}>Application Audit</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
