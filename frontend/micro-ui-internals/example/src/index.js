import React from "react";
import ReactDOM from "react-dom";

import { initLibraries } from "@egovernments/digit-ui-libraries";
import { PGRModule, PGRLinks, PGRReducers } from "@egovernments/digit-ui-module-pgr";
import { PTModule, PTLinks, PTComponents } from "@egovernments/digit-ui-module-pt";
import { initFSMComponents } from "@egovernments/digit-ui-module-fsm";
import { initPGRComponents } from "@egovernments/digit-ui-module-pgr";
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { PaymentModule, PaymentLinks, paymentConfigs } from "@egovernments/digit-ui-module-common";
import { DigitUI } from "@egovernments/digit-ui-module-core";
// import { PGRModule, PGRLinks } from "@egovernments/digit-ui-module-pgr";
// import { Body, TopBar } from "@egovernments/digit-ui-react-components";
import "@egovernments/digit-ui-css/example/index.css";

import CITIZEN from "./userInfo/citizen.json";
import EMPLOYEE from "./userInfo/employee.json";
import LME from "./userInfo/lme.json";
import GRO from "./userInfo/gro.json";
import QAGRO from "./userInfo/qa-gro.json";
import QACSR from "./userInfo/qa-csr.json";
import QACT from "./userInfo/qa-citizen.json";
import QADSO from "./userInfo/qa-dso.json";

import FSM_EDITOR from "./userInfo/fsm-editor.json";
import FSM_COLLECTOR from "./userInfo/fsm-collector.json";
import FSM_FSTP from "./userInfo/fsm-fstp.json";
import FSM_DSO from "./userInfo/fsm-dso.json";
import FSM_ADMIN from "./userInfo/fsm-admin.json";
import FSM_CREATOR from "./userInfo/fsm-creator.json";
import QA_FSM_CREATOR from "./userInfo/QACE.json";
import QA_FSM_EDITOR from "./userInfo/QAEE.json";
import QA_FSM_COLLECTOR from "./userInfo/QACOLL.json";
import QA_FSM_DSO from "./userInfo/QADSO.json";
import QA_FSM_FSTP from "./userInfo/QAFSTPO.json";
import QA_CECOLL from "./userInfo/qa-cecoll.json";
import QACREDITOR from "./userInfo/QACREDITOR.json";
import QACREATOR from "./userInfo/QACREATOR.json";

import QAFSTP from "./userInfo/fstp.json";
import QAADMIN from "./userInfo/QAADMIN.json";

import QAPTCE from "./userInfo/QAPTCE.json";
import QAPTDV from "./userInfo/QAPTDV.json";
import QAPTFI from "./userInfo/QAPTFI.json";
import QAPTA from "./userInfo/QAPTA.json";

import UATSU from "./userInfo/UATSU.json";
import UATCSR from "./userInfo/UATCSR.json";
import UATHRMS from "./userInfo/UATHRMS.json";

import NAWANSHAHR_QA_GRO from "./userInfo/qa-gro-nawanshahr.json";

import * as comps from "@egovernments/digit-ui-react-components";

import { subFormRegistry } from "@egovernments/digit-ui-libraries";

import { pgrCustomizations, pgrComponents } from "./pgr";

const userInfo = {
  CITIZEN,
  EMPLOYEE,
  LME,
  GRO,
  QACSR,
  QACT,
  QAGRO,
  QADSO,
  FSM_ADMIN,
  FSM_CREATOR,
  FSM_EDITOR,
  FSM_COLLECTOR,
  FSM_FSTP,
  FSM_DSO,
  NAWANSHAHR_QA_GRO,
  QA_FSM_COLLECTOR,
  QA_FSM_CREATOR,
  QA_FSM_DSO,
  QA_FSM_EDITOR,
  QA_FSM_FSTP,
  QA_CECOLL,
  QACREDITOR,
  QAADMIN,
  QACREATOR,
  UATSU,
  UATCSR,
  UATHRMS,
  QAPTCE,
  QAPTDV,
  QAPTFI,
  QAPTA,
};

const enabledModules = ["PGR", "FSM", "Payment", "PT", "DSS"];

const initTokens = (stateCode) => {
  const userType = window.sessionStorage.getItem("userType") || process.env.REACT_APP_USER_TYPE || "CITIZEN";

  const token = window.sessionStorage.getItem("token") || process.env[`REACT_APP_${userType}_TOKEN`];

  // console.log(token);

  const citizenInfo = window.localStorage.getItem("Citizen.user-info") || userInfo[userType];

  const citizenTenantId = window.localStorage.getItem("Citizen.tenant-id") || stateCode;

  const employeeInfo = window.localStorage.getItem("Employee.user-info") || userInfo[userType];
  const employeeTenantId = window.localStorage.getItem("Employee.tenant-id") || "pb.amritsar";

  const userTypeInfo = userType === "CITIZEN" || userType === "QACT" ? "citizen" : "employee";
  window.Digit.SessionStorage.set("user_type", userTypeInfo);
  window.Digit.SessionStorage.set("userType", userTypeInfo);

  if (userType !== "CITIZEN") {
    window.Digit.SessionStorage.set("User", { access_token: token, info: userType !== "CITIZEN" ? employeeInfo : citizenInfo });
  } else {
    if (!window.Digit.SessionStorage.get("User")?.extraRoleInfo) window.Digit.SessionStorage.set("User", { access_token: token, info: citizenInfo });
  }

  window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);
  window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
};

const initDigitUI = () => {
  Digit.ComponentRegistryService.setupRegistry({
    ...pgrComponents,
    PaymentModule,
    ...paymentConfigs,
    PaymentLinks,
    PTModule,
    PTLinks,
    ...PTComponents,
  });

  initFSMComponents();
  initPGRComponents();
  initDSSComponents();

  const moduleReducers = (initData) => ({
    pgr: PGRReducers(initData),
  });

  window.Digit.Customizations = { PGR: pgrCustomizations };

  const stateCode = globalConfigs.getConfig("STATE_LEVEL_TENANT_ID");
  initTokens(stateCode);

  const registry = Digit.ComponentRegistryService.getRegistry();

  ReactDOM.render(<DigitUI stateCode={stateCode} enabledModules={enabledModules} moduleReducers={moduleReducers} />, document.getElementById("root"));
};

initLibraries().then(() => {
  initDigitUI();
});
