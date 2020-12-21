import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { PGRModule } from "@egovernments/digit-ui-module-pgr/src/Module";
import { FSMModule } from "@egovernments/digit-ui-module-fsm/src/Module";

import { AppHome } from "./Home";
import Login from "../pages/citizen/Login";

const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) => codes.map((item) => item.code).includes(tenant.code));
};

export const AppModules = ({ stateCode, userType, modules, appTenants }) => {
  const { path } = useRouteMatch();
  const moduleList = ["PGR", "FSM"];

  const appRoutes = modules
    .filter((module) => moduleList.includes(module.code))
    .map(({ code, tenants }, index) => {
      if (code === "PGR") {
        return (
          <Route key={index} path={`${path}/pgr`}>
            <PGRModule stateCode={stateCode} cityCode="pb.amritsar" moduleCode={code} userType={userType} tenants={getTenants(tenants, appTenants)} />
          </Route>
        );
      }
      return;
    });

  return (
    <Switch>
      {appRoutes}
      {/* TODO: remove once FSM is enabled via MDMS */}
      <Route path={`${path}/fsm`}>
        <FSMModule stateCode={stateCode} cityCode="pb.amritsar" moduleCode="FSM" userType={userType} />
      </Route>
      {userType === "citizen" && (
        <Route path={`${path}/login`}>
          <Login stateCode={stateCode} cityCode="pb.amritsar" />
        </Route>
      )}
      <Route>
        <AppHome userType={userType} />
      </Route>
    </Switch>
  );
};
