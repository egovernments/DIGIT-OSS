import React, { useContext, useEffect } from "react";
import { Route, Switch, useRouteMatch, Redirect, useLocation } from "react-router-dom";

import { AppHome } from "./Home";
import Login from "../pages/citizen/Login";
import EmployeeLogin from "../pages/employee/Login/index";
import ChangePassword from "../pages/employee/ChangePassword/index";
import ForgotPassword from "../pages/employee/ForgotPassword/index";
import LanguageSelection from "../pages/employee/LanguageSelection";
// import UserProfile from "./userProfile";

const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) => codes?.map?.((item) => item.code).includes(tenant.code));
};

export const AppModules = ({ stateCode, userType, modules, appTenants }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const { path } = useRouteMatch();
  const location = useLocation();

  const user = Digit.UserService.getUser();

  if (!user || !user?.access_token || !user?.info) {
    return <Redirect to={{ pathname: "/digit-ui/employee/user/login", state: { from: location.pathname + location.search } }} />;
  }

  const appRoutes = modules.map(({ code, tenants }, index) => {
    const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
    return Module ? (
      <Route key={index} path={`${path}/${code.toLowerCase()}`}>
        <Module stateCode={stateCode} moduleCode={code} userType={userType} tenants={getTenants(tenants, appTenants)} />
      </Route>
    ) :   <Route key={index} path={`${path}/${code.toLowerCase()}`}>
    <Redirect to={{ pathname: "/digit-ui/employee/user/error?type=notfound", state: { from: location.pathname + location.search } }} />
  </Route>;
  });

  return (
    <div className="ground-container">
      <Switch>
        {appRoutes}
        <Route path={`${path}/login`}>
          <Redirect to={{ pathname: "/digit-ui/employee/user/login", state: { from: location.pathname + location.search } }} />
        </Route>
        <Route path={`${path}/forgot-password`}>
          <ForgotPassword />
        </Route>
        <Route path={`${path}/change-password`}>
          <ChangePassword />
        </Route>
        <Route>
          <AppHome userType={userType} modules={modules} />
        </Route>
        {/* <Route path={`${path}/user-profile`}> <UserProfile /></Route> */}
      </Switch>
    </div>
  );
};
