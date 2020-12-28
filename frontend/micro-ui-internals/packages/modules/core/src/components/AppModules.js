import React, { useContext } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import { AppHome } from "./Home";

const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) => codes.map((item) => item.code).includes(tenant.code));
};

export const AppModules = ({ stateCode, userType, modules, appTenants }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const { path } = useRouteMatch();
  const registry = useContext(ComponentProvider);

  const appRoutes = modules.map(({ code, tenants }, index) => {
    const Module = registry.getComponent(`${code}Module`);
    return (
      <Route key={index} path={`${path}/${code.toLowerCase()}`}>
        <Module stateCode={stateCode} cityCode="pb.amritsar" moduleCode={code} userType={userType} tenants={getTenants(tenants, appTenants)} />
      </Route>
    );
  });

  return (
    <Switch>
      {appRoutes}
      <Route>
        <AppHome userType={userType} modules={modules} />
      </Route>
    </Switch>
  );
};
