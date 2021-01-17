import React from "react";
import ReactDOM from "react-dom";

import { initLibraries } from "@egovernments/digit-ui-libraries";
import { PGRModule, PGRLinks, PGRReducers } from "@egovernments/digit-ui-module-pgr";
import { FSMModule, FSMLinks } from "@egovernments/digit-ui-module-fsm";
import { DigitUI } from "@egovernments/digit-ui-module-core";
// import { PGRModule, PGRLinks } from "@egovernments/digit-ui-module-pgr";
// import { Body, TopBar } from "@egovernments/digit-ui-react-components";
import "@egovernments/digit-ui-css/example/index.css";

import CITIZEN from "./userInfo/citizen.json";
import EMPLOYEE from "./userInfo/employee.json";
import LME from "./userInfo/lme.json";
import GRO from "./userInfo/gro.json";
import QACSR from "./userInfo/qa-csr.json";
import QACT from "./userInfo/qa-citizen.json";
import FSM_EMPLOYEE from "./userInfo/fsm-employee.json";

import Registry from "./ComponentRegistry";

import { pgrCustomizations, pgrComponents } from "./pgr";

initLibraries();

const userInfo = { CITIZEN, EMPLOYEE, LME, GRO, QACSR, QACT, FSM_EMPLOYEE };

const enabledModules = ["PGR"];
const registry = new Registry({
  ...pgrComponents,
  PGRLinks,
  PGRModule,
  FSMModule,
  FSMLinks,
});
const moduleReducers = (initData) => ({
  pgr: PGRReducers(initData),
});

window.Digit.Customizations = { PGR: pgrCustomizations };

const stateCode = globalConfigs.getConfig("STATE_LEVEL_TENANT_ID");

// console.clear();
console.log(stateCode);

const userType = window.sessionStorage.getItem("userType") || process.env.REACT_APP_USER_TYPE || "CITIZEN";

const token = process.env[`REACT_APP_${userType}_TOKEN`];

console.log(token);

const citizenInfo = window.localStorage.getItem("Citizen.user-info") || userInfo[userType];

const citizenTenantId = window.localStorage.getItem("Citizen.tenant-id") || stateCode;

const employeeInfo = window.localStorage.getItem("Employee.user-info") || userInfo[userType];
const employeeTenantId = window.localStorage.getItem("Employee.tenant-id") || "pb.amritsar";

const userTypeInfo = userType === "CITIZEN" ? "citizen" : "employee";
window.Digit.SessionStorage.set("user_type", userTypeInfo);
window.Digit.SessionStorage.set("userType", userTypeInfo);

// if (userType !== "CITIZEN") {
window.Digit.SessionStorage.set("User", { access_token: token, info: userType !== "CITIZEN" ? employeeInfo : citizenInfo });
// }

window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);
window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);

window.mdmsInitPre = ({ params, data }) => {
  console.log("mdms init pre", params, data);
  return { params, data };
};

window.mdmsInitPost = (data) => {
  console.log("mdms init post", data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 2000);
  });
};

ReactDOM.render(
  <DigitUI stateCode={stateCode} registry={registry} enabledModules={enabledModules} moduleReducers={moduleReducers} />,
  document.getElementById("root")
);
