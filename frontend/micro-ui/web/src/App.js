import React from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import {
  paymentConfigs,
  PaymentLinks,
  PaymentModule,
} from "@egovernments/digit-ui-module-common";
import {
  initPGRComponents,
  PGRReducers,
  PGRModule,
  PGRLinks,
} from "@egovernments/digit-ui-module-pgr";
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
import {
  HRMSModule,
  initHRMSComponents,
} from "@egovernments/digit-ui-module-hrms";
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";

window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

initLibraries();

const enabledModules = ["DSS", "HRMS", "PGR"];
window.Digit.ComponentRegistryService.setupRegistry({
  PaymentModule,
  ...paymentConfigs,
  PaymentLinks,
  HRMSModule,
  PGRModule,
  PGRLinks,
});

initDSSComponents();
initHRMSComponents();
initPGRComponents();
initEngagementComponents();
initUtilitiesComponents();

const moduleReducers = (initData) => ({
  initData,
  pgr: PGRReducers(initData),
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
