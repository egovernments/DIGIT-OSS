import React from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { UICustomizations } from "./Customisations/UICustomizations";
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
import {
  initPGRComponents,
  PGRReducers,
} from "@egovernments/digit-ui-module-pgr";
window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

const enabledModules = ["DSS", "NDSS",  "Utilities",
"HRMS", "Engagement",
"PGR"

];


const moduleReducers = (initData) => ({
  pgr: PGRReducers(initData),
});


const initDigitUI = () => {
  window.Digit.ComponentRegistryService.setupRegistry({});
  window.Digit.Customizations = {
    PGR: {},
    commonUiConfig: UICustomizations,
  };
  initHRMSComponents();
  initDSSComponents();
  initEngagementComponents();
  initPGRComponents()
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
