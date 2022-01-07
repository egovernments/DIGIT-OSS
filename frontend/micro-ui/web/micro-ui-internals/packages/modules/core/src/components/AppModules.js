import React, { useContext, useEffect } from "react";
import { Route, Switch, useRouteMatch, Redirect, useLocation } from "react-router-dom";


const LanguageSelection = React.lazy(() => import("../pages/employee/LanguageSelection"));
const ForgotPassword = React.lazy(() => import("../pages/employee/ForgotPassword/index"));
const EmployeeLogin = React.lazy(() => import("../pages/employee/Login/index"));
const Login = React.lazy(() => import("../pages/citizen/Login"));
const ChangePassword = React.lazy(() => import("../pages/employee/ChangePassword/index"));
const AppHome = React.lazy(() => import("./Home"));


const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) => codes?.map?.((item) => item.code).includes(tenant.code));
};

export const AppModules = ({ stateCode, userType, modules, appTenants }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const { path } = useRouteMatch();
  const location = useLocation();

  const user = Digit.UserService.getUser();
  if (!user) {
    return <Redirect to={{ pathname: "/digit-ui/employee/user/login", state: { from: location.pathname + location.search } }} />;
  }

  const appRoutes = modules.map(({ code, tenants }, index) => {
    const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
    return Module ? (
      <Route key={index} path={`${path}/${code.toLowerCase()}`}>
        <Module stateCode={stateCode} moduleCode={code} userType={userType} tenants={getTenants(tenants, appTenants)} />
      </Route>
    ): null
  });

  return (
    <div className="ground-container">
      <Switch>
        {appRoutes}
        <Route path={`${path}/login`}> <Redirect to={{ pathname: "/digit-ui/employee/user/login", state: { from: location.pathname + location.search } }} /></Route>
        <Route path={`${path}/forgot-password`}><ForgotPassword /></Route>
        <Route path={`${path}/change-password`}> <ChangePassword /></Route>
        <Route>
          <AppHome userType={userType} modules={modules} />
        </Route>
      </Switch>
    </div>
  );
};
