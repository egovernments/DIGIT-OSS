import React from "react";
import { Route, BrowserRouter as Router, Switch, useRouteMatch } from "react-router-dom";
import { Provider } from "react-redux";

import getStore from "./redux/store";
import defaultConfig from "./config";
import CitizenApp from "./CitizenApp";

const Module = ({ deltaConfig = {}, stateCode, cityCode, moduleCode }) => {
  const match = useRouteMatch();
  const store = Digit.Services.useStore(defaultConfig, { deltaConfig, stateCode, cityCode, moduleCode });

  if (Object.keys(store).length === 0) {
    return <div>Loading</div>;
  }

  return (
    <Provider store={getStore(store)}>
      <Router>
        <Switch>
          <Route path={`${match.path}/citizen`}>
            <CitizenApp />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};

export default Module;
