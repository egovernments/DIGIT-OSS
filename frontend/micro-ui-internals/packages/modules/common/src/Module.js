import React from "react";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { getI18n } from "react-i18next";
import { PGRModule, PGRLinks, PGRReducers } from "@egovernments/digit-ui-module-pgr";
import { Body, TopBar, Loader } from "@egovernments/digit-ui-react-components";

import getStore from "./redux/store";

export const DigitUI = ({ stateCode }) => {
  const initData = Digit.Services.useInitStore(stateCode);

  if (Object.keys(initData).length === 0) {
    return <Loader page={true} />;
  }

  console.log("common i18n keys", Object.keys(getI18n().getDataByLanguage("en_IN").translations).length);

  return (
    <Provider store={getStore(initData, { pgr: PGRReducers(initData) })}>
      <Router>
        <Body>
          <TopBar state={initData?.stateInfo?.name} img={initData?.stateInfo?.logoUrl} />
          <Switch>
            <Route path="/digit-ui/pgr">
              {/* <h2>PGR</h2> */}
              <PGRModule stateCode={stateCode} cityCode="pb.amritsar" moduleCode="PGR" />
            </Route>
            <Route>
              <PGRLinks matchPath="/digit-ui/pgr" />
            </Route>
          </Switch>
        </Body>
      </Router>
    </Provider>
  );
};
