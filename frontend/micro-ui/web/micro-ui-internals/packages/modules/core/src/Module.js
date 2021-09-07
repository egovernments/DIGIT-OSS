import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getI18n } from "react-i18next";
import { Body, Loader } from "@egovernments/digit-ui-react-components";

import { DigitApp } from "./App";

import getStore from "./redux/store";

const DigitUIWrapper = ({ stateCode, enabledModules, moduleReducers }) => {
  const { isLoading, data: initData } = Digit.Hooks.useInitStore(stateCode, enabledModules);

  if (isLoading) {
    return <Loader page={true} />;
  }

  const i18n = getI18n();
  // console.log("core module rendered", initData);
  return (
    <Provider store={getStore(initData, moduleReducers(initData))}>
      <Router>
        <Body>
          <DigitApp
            initData={initData}
            stateCode={stateCode}
            modules={initData?.modules}
            appTenants={initData.tenants}
            logoUrl={initData?.stateInfo?.logoUrl}
          />
        </Body>
      </Router>
    </Provider>
  );
};

export const DigitUI = ({ stateCode, registry, enabledModules, moduleReducers }) => {
  const userType = Digit.UserService.getType();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
      },
    },
  });

  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ComponentProvider.Provider value={registry}>
          <DigitUIWrapper stateCode={stateCode} enabledModules={enabledModules} moduleReducers={moduleReducers} />
        </ComponentProvider.Provider>
      </QueryClientProvider>
    </div>
  );
};
