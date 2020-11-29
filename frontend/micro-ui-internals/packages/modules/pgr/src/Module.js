import React from "react";
import { Route, BrowserRouter as Router, Switch, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";

import getRootReducer from "./redux/reducers";
import defaultConfig from "./config";
import CitizenApp from "./CitizenApp";

import EmployeeApp from "./EmployeeApp";
import { Header, HomeLink, Loader } from "@egovernments/digit-ui-react-components";
import { getI18n } from "react-i18next";

export const PGRReducers = getRootReducer;

export const PGRModule = ({ deltaConfig = {}, stateCode, cityCode, moduleCode = "PGR" }) => {
  const match = useRouteMatch();
  const state = useSelector((state) => state);
  const language = state?.common?.selectedLanguage;
  const store = Digit.Services.useStore(defaultConfig, { deltaConfig, stateCode, cityCode, moduleCode, language });

  if (Object.keys(store).length === 0) {
    return <Loader />;
  }

  console.log("pgr", state, store);
  console.log("pgr i18n keys", Object.keys(getI18n().getDataByLanguage("en_IN").translations).length);

  return (
    <React.Fragment>
      <Route path={`${match.path}/citizen`}>
        <CitizenApp />
      </Route>
      <Route path={`${match.path}/employee`}>
        <EmployeeApp />
      </Route>
    </React.Fragment>
  );
};

export const PGRLinks = ({ matchPath = "/digit-ui/pgr" }) => (
  <React.Fragment>
    <Header>Complaints</Header>
    <HomeLink to={`${matchPath}/citizen/create-complaint`}>File a Complaint</HomeLink>
    <HomeLink to={`${matchPath}/citizen/complaints`}>My Complaints</HomeLink>
  </React.Fragment>
);
