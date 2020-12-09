import React, { useMemo } from "react";
// import { Route, BrowserRouter as Router, Switch, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";

import { Header, HomeLink, Loader } from "@egovernments/digit-ui-react-components";
import { getI18n } from "react-i18next";

export const FSMModule = ({ deltaConfig = {}, stateCode, cityCode, moduleCode = "FSM", userType }) => {
  // const { path } = useRouteMatch();
  const state = useSelector((state) => state);
  const language = state?.common?.selectedLanguage;
  const store = { data: {} }; //Digit.Services.useStore({}, { deltaConfig, stateCode, cityCode, moduleCode, language });

  if (Object.keys(store).length === 0) {
    return <Loader />;
  }

  console.log("fsm", userType, state, store);

  return (
    <React.Fragment>
      <Header>FSM Module</Header>
      <p>Apply form</p>
    </React.Fragment>
  );
};

export const FSMLinks = ({ matchPath }) => (
  <React.Fragment>
    <Header>Other Services</Header>
    <HomeLink to={`${matchPath}/create-request`}>Apply for Desludging</HomeLink>
  </React.Fragment>
);
