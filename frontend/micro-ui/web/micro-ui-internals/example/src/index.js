import React from "react";
import ReactDOM from "react-dom";
import { initLibraries } from "@egovernments/digit-ui-libraries";
 import { BRModule, initBRComponents ,BRLinks} from "@egovernments/digit-ui-module-br";
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { PaymentModule, PaymentLinks, paymentConfigs } from "@egovernments/digit-ui-module-common";
import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { PTModule, PTLinks, PTComponents } from "@egovernments/digit-ui-module-pt";
import { initCommonPTComponents } from "@egovernments/digit-ui-module-commonpt";

// import {initCustomisationComponents} from "./customisations";

// import { PGRModule, PGRLinks } from "@egovernments/digit-ui-module-pgr";
// import { Body, TopBar } from "@egovernments/digit-ui-react-components";
import "@egovernments/digit-ui-css/example/index.css";

// import * as comps from "@egovernments/digit-ui-react-components";

// import { subFormRegistry } from "@egovernments/digit-ui-libraries";


var Digit = window.Digit || {};

const enabledModules = [ "Payment", "PT","QuickPayLinks","HRMS", "DSS","Engagement", "CommonPT","BR"];

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
    PTModule,
    PTLinks,
    ...PTComponents,
    PaymentModule,
    BRModule,
    PaymentLinks,
    BRLinks,
    
   
  
    // TLModule,
    // TLLinks,
  });


  initDSSComponents();
  initEngagementComponents();
  initCommonPTComponents();
  initBRComponents();
// initCustomisationComponents();



  
  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  initTokens(stateCode);

  const registry = window?.Digit.ComponentRegistryService.getRegistry();
  ReactDOM.render(<DigitUI stateCode={stateCode} enabledModules={enabledModules} />, document.getElementById("root"));
};

initLibraries().then(() => {
  initDigitUI();
});
