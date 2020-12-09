import React from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Switch, useRouteMatch, Redirect } from "react-router-dom";
import { getI18n } from "react-i18next";
import { PGRModule, PGRLinks, PGRReducers } from "@egovernments/digit-ui-module-pgr/src/Module";
import { FSMModule, FSMLinks } from "@egovernments/digit-ui-module-fsm/src/Module";
import { Body, TopBar, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";

import getStore from "./redux/store";

const getTenants = (codes, tenants) => {
  return tenants.filter(tenant => codes.map(item => item.code).includes(tenant.code))
}

const AppModules = ({ stateCode, userType, modules, appTenants }) => {
  const { path } = useRouteMatch();
  const moduleList = ["PGR", "FSM"];

  const appRoutes = modules.filter(module => moduleList.includes(module.code)).map(({ code, tenants }, index) => {
    if (code === "PGR") {
      return (
        <Route key={index} path={`${path}/pgr`}>
          <PGRModule stateCode={stateCode} cityCode="pb.amritsar" moduleCode={code} userType={userType} tenants={getTenants(tenants, appTenants)} />
        </Route>
      )
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
      <Route>
        <AppHome userType={userType} />
      </Route>
    </Switch>
  );
};

const AppHome = ({ userType }) => {
  if (userType === "citizen") {
    return (
      <React.Fragment>
        <PGRLinks matchPath={`/digit-ui/${userType}/pgr`} userType={userType} />
        <FSMLinks matchPath={`/digit-ui/${userType}/fsm`} userType={userType} />
      </React.Fragment>
    );
  }
  return <h1>Employee home</h1>;
};

const PrivatePage = () => <h2>Private</h2>;

const DigitUIApp = ({ stateCode, modules, appTenants, logoUrl }) => {
  return (
    <Switch>
      <Route path="/digit-ui/employee">
        <AppModules stateCode={stateCode} userType="employee" modules={modules} appTenants={appTenants} />
      </Route>
      <Route path="/digit-ui/citizen">
        <TopBar img={logoUrl} />
        <AppModules stateCode={stateCode} userType="citizen" modules={modules} appTenants={appTenants} />
      </Route>
      <PrivateRoute exact path="/digit-ui/private" component={PrivatePage} />
      <Route>
        <Redirect to="/digit-ui/citizen" />
      </Route>
    </Switch>
  );
};

export const DigitUI = ({ stateCode }) => {
  const initData = Digit.Services.useInitStore(stateCode);
  const queryCache = new QueryCache();

  if (Object.keys(initData).length === 0) {
    return <Loader page={true} />;
  }

  console.log("common i18n keys", Object.keys(getI18n().getDataByLanguage("en_IN").translations).length);

  return (
    <Provider store={getStore(initData, { pgr: PGRReducers(initData) })}>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <Router>
          <Body>
            <DigitUIApp stateCode={stateCode} modules={initData?.modules} appTenants={initData.tenants} logoUrl={initData?.stateInfo?.logoUrl} />
          </Body>
        </Router>
      </ReactQueryCacheProvider>
    </Provider>
  );
};
