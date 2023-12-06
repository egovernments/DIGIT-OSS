import React from "react";
import ReactDOM from "react-dom";

import { initLibraries } from "@egovernments/digit-ui-libraries";
import { paymentConfigs, PaymentLinks, PaymentModule } from "@egovernments/digit-ui-module-common";
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
import { HRMSModule, initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
import { PGRReducers, initPGRComponents } from "@egovernments/digit-ui-module-pgr";
// import { BRModule, initBRComponents, BRLinks } from "@egovernments/digit-ui-module-br";

// import "@egovernments/digit-ui-css/example/index.css";

import { pgrCustomizations } from "./pgr";
import { UICustomizations } from "./UICustomizations";

var Digit = window.Digit || {};

const enabledModules = [
  // "Payment",
  // "QuickPayLinks",
  "DSS",
  "HRMS",
  "PGR",
  // "Engagement",
  // "NDSS",
  // "Utilities",
  // //added to check fsm
  // "FSM",
  // "BR",
];

const initTokens = (stateCode) => {
  const userType = window.sessionStorage.getItem("userType") || process.env.REACT_APP_USER_TYPE || "CITIZEN";
  const token = window.localStorage.getItem("token") || process.env[`REACT_APP_${userType}_TOKEN`];

  // console.debug(userType);

  const citizenInfo = window.localStorage.getItem("Citizen.user-info");

  const citizenTenantId = window.localStorage.getItem("Citizen.tenant-id") || stateCode;

  const employeeInfo = window.localStorage.getItem("Employee.user-info");
  const employeeTenantId = window.localStorage.getItem("Employee.tenant-id");

  // console.debug("employeeInfo", employeeInfo);
  // console.debug("employeeTenantId", employeeTenantId);

  const userTypeInfo = userType === "CITIZEN" || userType === "QACT" ? "citizen" : "employee";
  window.Digit.SessionStorage.set("user_type", userTypeInfo);
  window.Digit.SessionStorage.set("userType", userTypeInfo);

  if (userType !== "CITIZEN") {
    window.Digit.SessionStorage.set("User", { access_token: token, info: userType !== "CITIZEN" ? JSON.parse(employeeInfo) : citizenInfo });
  } else {
    // if (!window.Digit.SessionStorage.get("User")?.extraRoleInfo) window.Digit.SessionStorage.set("User", { access_token: token, info: citizenInfo });
  }

  window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);

  if (employeeTenantId && employeeTenantId.length) window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
};

const initDigitUI = () => {
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";

  window?.Digit.ComponentRegistryService.setupRegistry({
    PaymentModule,
    ...paymentConfigs,
    PaymentLinks,
    HRMSModule,
  });

  // initBRComponents();
  initDSSComponents();
  initHRMSComponents();
  initPGRComponents();
  // initEngagementComponents();
  // initUtilitiesComponents();

  const moduleReducers = (initData) => ({
    pgr: PGRReducers(initData),
  });

  window.Digit.Customizations = {
    PGR: pgrCustomizations,
    commonUiConfig: UICustomizations,
  };

  const stateCode = "pg";
  initTokens(stateCode);

  ReactDOM.render(<DigitUI stateCode={stateCode} enabledModules={enabledModules} moduleReducers={moduleReducers} />, document.getElementById("root"));
};

initLibraries().then(() => {
  initDigitUI();
});
