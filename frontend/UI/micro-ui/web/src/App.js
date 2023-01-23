import React from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";

window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

initLibraries();

const enabledModules = ["DSS", "NDSS"];
window.Digit.ComponentRegistryService.setupRegistry({});

initDSSComponents();

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
