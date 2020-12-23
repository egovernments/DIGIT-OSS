import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getI18n } from "react-i18next";
import { PGRReducers } from "@egovernments/digit-ui-module-pgr/src/Module";
import { Body, Loader } from "@egovernments/digit-ui-react-components";

import { DigitApp } from "./components/App";

import getStore from "./redux/store";
import { ComponentProvider } from "./context";

const DigitUIWrapper = ({ stateCode }) => {
  const { isLoading, data: initData } = Digit.Hooks.useInitStore(stateCode);

  if (isLoading) {
    return <Loader page={true} />;
  }

  const i18n = getI18n();
  console.log("common i18n keys", Object.keys(i18n.getDataByLanguage("en_IN").translations).length);

  return (
    <Provider store={getStore(initData, { pgr: PGRReducers(initData) })}>
      <Router>
        <Body>
          <DigitApp stateCode={stateCode} modules={initData?.modules} appTenants={initData.tenants} logoUrl={initData?.stateInfo?.logoUrl} />
        </Body>
      </Router>
    </Provider>
  );
};

export const DigitUI = ({ stateCode, registry }) => {
  const userType = Digit.UserService.getType();
  const queryClient = new QueryClient();

  return (
    <div className={userType}>
      <QueryClientProvider client={queryClient}>
        <ComponentProvider.Provider value={registry}>
          <DigitUIWrapper stateCode={stateCode} />
        </ComponentProvider.Provider>
      </QueryClientProvider>
    </div>
  );
};
