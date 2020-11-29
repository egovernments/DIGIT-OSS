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

export const PGRModule = ({ deltaConfig = {}, stateCode, cityCode, moduleCode = "PGR", userType }) => {
  const { path } = useRouteMatch();
  const state = useSelector((state) => state);
  const language = state?.common?.selectedLanguage;
  const store = Digit.Services.useStore(defaultConfig, { deltaConfig, stateCode, cityCode, moduleCode, language });

  if (Object.keys(store).length === 0) {
    return <Loader />;
  }

  console.log("pgr", userType, state, store);
  console.log("pgr i18n keys", Object.keys(getI18n().getDataByLanguage("en_IN").translations).length);

  if (userType === "citizen") {
    return <CitizenApp />;
  }

  return <h2>employee: {path}</h2>;

  // return (
  //   <Route>
  //     <Switch>
  //       <Route path={`${path}/citizen`}>
  //         {/* <CitizenApp /> */}
  //         <h2>citizen</h2>
  //       </Route>
  //       <Route path={`${path}/employee`}>
  //         {/* <CitizenApp /> */}
  //         <h2>employee</h2>
  //       </Route>
  //       <Route><h1>pgr home</h1></Route>
  //     </Switch>
  //   </Route>
  // );
};

export const PGRLinks = ({ matchPath }) => (
  <React.Fragment>
    <Header>Complaints</Header>
    <HomeLink to={`${matchPath}/create-complaint`}>File a Complaint</HomeLink>
    <HomeLink to={`${matchPath}/complaints`}>My Complaints</HomeLink>
  </React.Fragment>
);
