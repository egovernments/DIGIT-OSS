import React from "react";
import ReactDOM from "react-dom";

import { initLibraries } from "@egovernments/digit-ui-libraries";
import { PGRReducers } from "@egovernments/digit-ui-module-pgr";
import { PTModule, PTLinks, PTComponents } from "@egovernments/digit-ui-module-pt";
import { MCollectModule, MCollectLinks } from "@egovernments/digit-ui-module-mcollect";
// import { TLModule, TLLinks } from "@egovernments/digit-ui-module-tl";
import { initFSMComponents } from "@egovernments/digit-ui-module-fsm";
import { initPGRComponents } from "@egovernments/digit-ui-module-pgr";
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { initReceiptsComponents, ReceiptsModule } from "@egovernments/digit-ui-module-receipts";
import { initMCollectComponents } from "@egovernments/digit-ui-module-mcollect";
import { initTLComponents } from "@egovernments/digit-ui-module-tl";
import { PaymentModule, PaymentLinks, paymentConfigs } from "@egovernments/digit-ui-module-common";
import { HRMSModule } from "@egovernments/digit-ui-module-hrms";
import { initOBPSComponents } from "@egovernments/digit-ui-module-obps";
import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
import { initNOCComponents } from "@egovernments/digit-ui-module-noc";
import { initWSComponents } from "@egovernments/digit-ui-module-ws"; 
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { initCommonPTComponents } from "@egovernments/digit-ui-module-commonpt";

// import {initCustomisationComponents} from "./customisations";

// import { PGRModule, PGRLinks } from "@egovernments/digit-ui-module-pgr";
// import { Body, TopBar } from "@egovernments/digit-ui-react-components";
import "@egovernments/digit-ui-css/example/index.css";

// import * as comps from "@egovernments/digit-ui-react-components";

// import { subFormRegistry } from "@egovernments/digit-ui-libraries";

import { pgrCustomizations, pgrComponents } from "./pgr";


var Digit = window.Digit || {};

const enabledModules = ["PGR", "FSM", "Payment", "PT", "QuickPayLinks", "DSS", "MCollect", "HRMS", "TL", "Receipts", "OBPS", "Engagement", "NOC", "WS","CommonPT", "NDSS"];

const initTokens = (stateCode) => {
  const userType = window.sessionStorage.getItem("userType") || process.env.REACT_APP_USER_TYPE || "CITIZEN";

  const token =window.localStorage.getItem("token")|| process.env[`REACT_APP_${userType}_TOKEN`];
 
  const citizenInfo = window.localStorage.getItem("Citizen.user-info")
 
  const citizenTenantId = window.localStorage.getItem("Citizen.tenant-id") || stateCode;

  const employeeInfo = window.localStorage.getItem("Employee.user-info");
  const employeeTenantId = window.localStorage.getItem("Employee.tenant-id");

  const userTypeInfo = userType === "CITIZEN" || userType === "QACT" ? "citizen" : "employee";
  window.Digit.SessionStorage.set("user_type", userTypeInfo);
  window.Digit.SessionStorage.set("userType", userTypeInfo);

  if (userType !== "CITIZEN") {
    window.Digit.SessionStorage.set("User", { access_token: token, info: userType !== "CITIZEN" ? JSON.parse(employeeInfo) : citizenInfo });
  } else {
    // if (!window.Digit.SessionStorage.get("User")?.extraRoleInfo) window.Digit.SessionStorage.set("User", { access_token: token, info: citizenInfo });
  }

  window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);
 
 if(employeeTenantId && employeeTenantId.length) window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
};

const initDigitUI = () => {
  window?.Digit.ComponentRegistryService.setupRegistry({
    ...pgrComponents,
    PaymentModule,
    ...paymentConfigs,
    PaymentLinks,
    PTModule,
    PTLinks,
    ...PTComponents,
    MCollectLinks,
    MCollectModule,
    HRMSModule,
    ReceiptsModule,
    // TLModule,
    // TLLinks,
  });

  initFSMComponents();
  initPGRComponents();
  initDSSComponents();
  initMCollectComponents();
  initHRMSComponents();
  initTLComponents();
  initReceiptsComponents();
  initOBPSComponents();
  initEngagementComponents();
  initNOCComponents();
  initWSComponents();
  initCommonPTComponents();
// initCustomisationComponents();

const moduleReducers = (initData) => ({
    pgr: PGRReducers(initData),
  });

  window.Digit.Customizations = { PGR: pgrCustomizations ,TL:{customiseCreateFormData:(formData,licenceObject)=>licenceObject,
    customiseRenewalCreateFormData:(formData,licenceObject)=>licenceObject,customiseSendbackFormData:(formData,licenceObject)=>licenceObject}};

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  initTokens(stateCode);

  const registry = window?.Digit.ComponentRegistryService.getRegistry();
  ReactDOM.render(<DigitUI stateCode={stateCode} enabledModules={enabledModules} moduleReducers={moduleReducers} />, document.getElementById("root"));
};

initLibraries().then(() => {
  initDigitUI();
});
