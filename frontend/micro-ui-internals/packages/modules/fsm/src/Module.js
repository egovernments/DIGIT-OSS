import React, { useMemo } from "react";
import { Route, BrowserRouter as Router, Switch, useRouteMatch, matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import SelectRating from "./pages/citizen/Rating/SelectRating";

import { BackButton, Header, HomeLink, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";
import { getI18n } from "react-i18next";
import FileComplaint from "./pages/citizen/FileComplaint/index";

import { NewApplication } from "./pages/employee/NewApplication";
import { MyApplications } from "./pages/citizen/MyApplications";
import ApplicationDetails from "./pages/citizen/ApplicationDetails";
import EmployeeApplicationDetails from "./pages/employee/ApplicationDetails";
import Response from "./pages/Response";

export const FSMModule = ({ deltaConfig = {}, stateCode, cityCode, moduleCode = "FSM", userType }) => {
  const { path, url } = useRouteMatch();
  const state = useSelector((state) => state);
  const language = state?.common?.selectedLanguage;
  const store = { data: {} }; //Digit.Services.useStore({}, { deltaConfig, stateCode, cityCode, moduleCode, language });

  if (Object.keys(store).length === 0) {
    return <Loader />;
  }

  console.log("fsm", userType, state, store);

  return (
    <Switch>
      <div className="ground-container">
        <BackButton>Back</BackButton>
        <PrivateRoute exact path={`${path}/`} component={() => <FSMLinks matchPath={path} />} />
        <PrivateRoute path={`${path}/file-property`} component={FileComplaint} />
        <PrivateRoute path={`${path}/my-applications`} component={MyApplications} />
        <PrivateRoute path={`${path}/application-details`} component={ApplicationDetails} />
        <PrivateRoute path={`${path}/rate/:id`} component={() => <SelectRating parentRoute={path} />} />
        <PrivateRoute path={`${path}/employee/new-application`} component={() => <NewApplication parentUrl={url} />} />
        <Route path={`${path}/employee/application-details`} component={EmployeeApplicationDetails} />
        <PrivateRoute path={`${path}/response`} component={() => <Response parentRoute={path} />} />
      </div>
    </Switch>
  );
};

export const FSMLinks = ({ matchPath }) => (
  <React.Fragment>
    <Header>Other Services</Header>
    <HomeLink to={`${matchPath}/create-request`}>Apply for Desludging</HomeLink>
    <HomeLink to={`${matchPath}/my-applications`}>My Applications</HomeLink>
  </React.Fragment>
);
