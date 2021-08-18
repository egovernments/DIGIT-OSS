import React, { Fragment } from "react";
import { useSelector } from "react-redux";
// import { useRouteMatch } from "react-router";
import { BackButton, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";
import DashBoard from "./pages";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Overview from "./pages/Overview";
import DSSCard from "./components/DSSCard";

const Routes = ({ path }) => {
  return (
    <>
      <BackButton></BackButton>
      <Switch>
        <PrivateRoute path={`${path}/dashboard`} component={DashBoard} />
      </Switch>
    </>
  );
};

const DSSModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "DSS";
  // const { path, url } = useRouteMatch();
  const state = useSelector((state) => state);
  const { path, url } = useRouteMatch();
  const language = state?.common?.selectedLanguage;
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) {
    return <Loader />;
  }

  Digit.SessionStorage.set("DSS_TENANTS", tenants);

  if (userType !== "citizen") {
    return <Routes path={path} />;
  }
};

const componentsToRegister = {
  DSSModule,
  DSSCard,
};

export const initDSSComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
