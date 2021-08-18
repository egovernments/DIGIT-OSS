import React, { useContext, useEffect } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import { AppHome } from "./Home";
import Login from "../pages/citizen/Login";
import EmployeeLogin from "../pages/employee/Login/index";
import ChangePassword from "../pages/employee/ChangePassword/index";
import ForgotPassword from "../pages/employee/ForgotPassword/index";

const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) => codes.map((item) => item.code).includes(tenant.code));
};

export const AppModules = ({ stateCode, userType, modules, appTenants }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const { path } = useRouteMatch();

  const appRoutes = modules.map(({ code, tenants }, index) => {
    const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
    return (
      <Route key={index} path={`${path}/${code.toLowerCase()}`}>
        <Module stateCode={stateCode} moduleCode={code} userType={userType} tenants={getTenants(tenants, appTenants)} />
      </Route>
    );
  });

  return (
    <Switch>
      {appRoutes}
      <Route path={`${path}/login`}><EmployeeLogin /></Route>
      <Route path={`${path}/forgot-password`}><ForgotPassword /></Route>
      <Route path={`${path}/change-password`}> <ChangePassword /></Route>
      <Route>
        <AppHome userType={userType} modules={modules} />
      </Route>
    </Switch>
  );
};
