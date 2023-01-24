import { initLibraries } from "@egovernments/digit-ui-libraries";
import {
  paymentConfigs, PaymentLinks, PaymentModule
} from "@egovernments/digit-ui-module-common";
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import React from "react";

window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

initLibraries();

const enabledModules = ["DSS", "NDSS"];
window.Digit.ComponentRegistryService.setupRegistry({
  PaymentModule,
  ...paymentConfigs,
  PaymentLinks,
});

initDSSComponents();
initHRMSComponents();
initEngagementComponents();

const moduleReducers = (initData) => ({
  initData,
});

function App() {
  window.contextPath =
    window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    process.env.REACT_APP_STATE_LEVEL_TENANT_ID;
  if (!stateCode) {
    return <h1>stateCode is not defined</h1>;
  }
  return (
    <DigitUI
      stateCode={stateCode}
      enabledModules={enabledModules}
      moduleReducers={moduleReducers}
    />
  );
}

export default App;
