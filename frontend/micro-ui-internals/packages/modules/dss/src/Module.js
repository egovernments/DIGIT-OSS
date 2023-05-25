import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
// import { useRouteMatch } from "react-router";
import { BackButton, Loader, PrivateRoute, BreadCrumb } from "@egovernments/digit-ui-react-components";
import DashBoard from "./pages";
import { Route, Switch, useRouteMatch, useLocation } from "react-router-dom";
import Overview from "./pages/Overview";
import DSSCard from "./components/DSSCard";
import DrillDown from "./pages/DrillDown";

const DssBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      path: "/digit-ui/employee",
      content: t("ES_COMMON_HOME"),
      show: true,
    },
    {
      path: "/digit-ui/employee/dss/dashboard/fsm",
      content: t("ES_COMMON_DSS"),
      show: true,
    },
    {
      path: "/digit-ui/employee/dss/drilldown",
      content: t("ES_COMMON_DSS_DRILL"),
      show: location.pathname.includes("drilldown") ? true : false,
    },
  ];

  return <BreadCrumb crumbs={crumbs} />;
};

const Routes = ({ path, stateCode }) => {
  const location = useLocation();
  return (
    <div className="chart-wrapper">
      <DssBreadCrumb location={location} />
      <Switch>
        <PrivateRoute path={`${path}/dashboard/:moduleCode`} component={() => <DashBoard stateCode={stateCode} />} />
        <PrivateRoute path={`${path}/drilldown`} component={() => <DrillDown />} />
      </Switch>
    </div>
  );
};

const DSSModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "DSS";
  // const { path, url } = useRouteMatch();
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) {
    return <Loader />;
  }

  Digit.SessionStorage.set("DSS_TENANTS", tenants);

  if (userType !== "citizen") {
    return <Routes path={path} stateCode={stateCode} />;
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
