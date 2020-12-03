import React from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Switch, useRouteMatch, Redirect } from "react-router-dom";
import { getI18n } from "react-i18next";
import { PGRModule, PGRLinks, PGRReducers } from "@egovernments/digit-ui-module-pgr/src/Module";
import { Body, TopBar, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";

import getStore from "./redux/store";

const AppModules = ({ stateCode, userType }) => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/pgr`}>
        <PGRModule stateCode={stateCode} cityCode="pb.amritsar" moduleCode="PGR" userType={userType} />
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
      </React.Fragment>
    );
  }
  return <h1>Employee home</h1>;
};

const PrivatePage = () => <h2>Private</h2>;

const DigitUIApp = ({ stateCode }) => {
  return (
    <Switch>
      <Route path="/digit-ui/employee">
        <AppModules stateCode={stateCode} userType="employee" />
      </Route>
      <Route path="/digit-ui/citizen">
        <AppModules stateCode={stateCode} userType="citizen" />
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
            <TopBar state={initData?.stateInfo?.name} img={initData?.stateInfo?.logoUrl} />
            <DigitUIApp stateCode={stateCode} />
          </Body>
        </Router>
      </ReactQueryCacheProvider>
    </Provider>
  );
};
