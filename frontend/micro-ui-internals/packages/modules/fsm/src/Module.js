import React, { useMemo } from "react";
import { Route, BrowserRouter as Router, Switch, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";

import { BackButton, Header, HomeLink, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";
import { getI18n } from "react-i18next";
import FileComplaint from "./FileComplaint/index";

import { NewApplication } from "./pages/employee/NewApplication";
import { MyApplications } from "./pages/citizen/MyApplications";
import ApplicationDetails from "./pages/citizen/ApplicationDetails";

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
        <PrivateRoute path={`${path}/file-property`} component={FileComplaint} />
        <Route path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} />
        <Route path={`${path}/my-applications`} component={MyApplications} />
        <Route path={`${path}/application-details`} component={ApplicationDetails} />
      </div>
    </Switch>
  );
};

export const FSMLinks = ({ matchPath }) => (
  <React.Fragment>
    <Header>Other Services</Header>
    <HomeLink to={`${matchPath}/create-request`}>Apply for Desludging</HomeLink>
  </React.Fragment>
);
