import React from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import {
  paymentConfigs, PaymentLinks, PaymentModule
} from "@egovernments/digit-ui-module-common";
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { initUtilitiesComponents } from  "@egovernments/digit-ui-module-utilities";


window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

const enabledModules = ["DSS", "NDSS",  "Utilities",
"HRMS", "Engagement"
];
window.Digit.ComponentRegistryService.setupRegistry({
  PaymentModule,
  ...paymentConfigs,
  PaymentLinks,
});

initDSSComponents();
initHRMSComponents();
initEngagementComponents();
initUtilitiesComponents();

const moduleReducers = (initData) => ({
  initData,
});


const initDigitUI = () => {
  window.Digit.ComponentRegistryService.setupRegistry({});

  initDSSComponents();
  initHRMSComponents();
  initEngagementComponents();
  initUtilitiesComponents();

 
  window.Digit.Customizations = {
    PGR: {},
    TL: TLCustomisations,
    commonUiConfig: UICustomizations,
  };
};

initLibraries().then(() => {
  initDigitUI();
});

function App() {
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");
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
      // defaultLanding="employee"
    />
  );
}

export default App;
