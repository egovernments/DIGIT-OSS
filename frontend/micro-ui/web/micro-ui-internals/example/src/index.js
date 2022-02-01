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
import { initCommonPTComponents } from "@egovernments/digit-ui-module-commonPt";

// import {initCustomisationComponents} from "./customisations";

// import { PGRModule, PGRLinks } from "@egovernments/digit-ui-module-pgr";
// import { Body, TopBar } from "@egovernments/digit-ui-react-components";
import "@egovernments/digit-ui-css/example/index.css";

// import * as comps from "@egovernments/digit-ui-react-components";

// import { subFormRegistry } from "@egovernments/digit-ui-libraries";

import { pgrCustomizations, pgrComponents } from "./pgr";


var Digit = window.Digit || {};

const enabledModules = ["PGR", "FSM", "Payment", "PT", "QuickPayLinks", "DSS", "MCollect", "HRMS", "TL", "Receipts", "OBPS", "Engagement", "NOC", "WS","commonPt"];

const initTokens = (stateCode) => {
  const userType = window.sessionStorage.getItem("userType") || process.env.REACT_APP_USER_TYPE || "CITIZEN";

  const token ="3fba2467-456a-4300-839e-692be9619fc5"|| process.env[`REACT_APP_${userType}_TOKEN`];

  // console.log(token);
 
  const citizenInfo = window.localStorage.getItem("Citizen.user-info")
 
  const citizenTenantId = window.localStorage.getItem("Citizen.tenant-id") || stateCode;

  const employeeInfo = {
    "id": 12013,
    "uuid": "0031f6f9-67f7-4929-9cd5-4827376733d0",
    "userName": "QADSS",
    "name": "QA DSS",
    "mobileNumber": "7456454453",
    "emailId": "nav@egov.com",
    "locale": null,
    "type": "EMPLOYEE",
    "roles": [
        {
            "name": "LOA Creator",
            "code": "LOA_CREATOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Grievance Routing Officer",
            "code": "GRO",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "NoC counter employee",
            "code": "NOC_CEMP",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPA Builder",
            "code": "BPA_BUILDER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Finance Report View",
            "code": "EGF_REPORT_VIEW",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "AssetReportViewer",
            "code": "AssetReportViewer",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPA Field Inspector",
            "code": "BPA_FIELD_INSPECTOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "TL Field Inspector",
            "code": "TL_FIELD_INSPECTOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "EGF Bill Creator",
            "code": "EGF_BILL_CREATOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "PT Counter Employee",
            "code": "PT_CEMP",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPA Services Approver",
            "code": "BPA_APPROVER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Fire Noc Department Approver",
            "code": "FIRE_NOC_APPROVER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Counter Employee",
            "code": "CEMP",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Admin of a ULB",
            "code": "CITY_ADMIN",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "PT Field Inspector",
            "code": "PT_FIELD_INSPECTOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "WS Counter Employee",
            "code": "WS_CEMP",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "FSM Driver",
            "code": "FSM_DRIVER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Any User",
            "code": "ANONYMUS",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "WS Field Inspector",
            "code": "WS_FIELD_INSPECTOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Works Administrator",
            "code": "WORKS_ADMINISTRATOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "ULB Administrator",
            "code": "PTADMIN",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Property Tax Receipt Cancellator",
            "code": "CR_PT",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "PT Doc Verifier",
            "code": "PT_DOC_VERIFIER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "FSM Administrator",
            "code": "FSM_ADMIN",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Employee",
            "code": "EMPLOYEE",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Employee",
            "code": "EMPLOYEE",
            "tenantId": "pb.jalandhar"
        },
        {
            "name": "BPAREG Employee",
            "code": "BPAREG_EMPLOYEE",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "TL Counter Employee",
            "code": "TL_CEMP",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Commissioner",
            "code": "COMMISSIONER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "TL Creator",
            "code": "TL_CREATOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "EGF Bill Approver",
            "code": "EGF_BILL_APPROVER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPAREG doc verifier",
            "code": "BPAREG_DOC_VERIFIER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPA Structural Engineer",
            "code": "BPA_STRUCTURALENGINEER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Redressal Officer",
            "code": "RO",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Collection Report Viewer",
            "code": "COLL_REP_VIEW",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPA Engineer",
            "code": "BPA_ENGINEER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Universal Collection Employee",
            "code": "UC_EMP",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "FSM FSTP Opperator",
            "code": "FSM_EMP_FSTPO",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPA Services verifier",
            "code": "BPA_VERIFIER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "State Administrator",
            "code": "STADMIN",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "PT Counter Approver",
            "code": "PT_APPROVER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "NoC Field Inpector",
            "code": "NOC_FIELD_INSPECTOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Grievance Officer",
            "code": "GO",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "FSM Employee Application Creator",
            "code": "FSM_CREATOR_EMP",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "WS Clerk",
            "code": "WS_CLERK",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "NoC Doc Verifier",
            "code": "NOC_DOC_VERIFIER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Auto Escalation Employee",
            "code": "AUTO_ESCALATE",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "WS Document Verifier",
            "code": "WS_DOC_VERIFIER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "FSM Employee Report Viewer",
            "code": "FSM_REPORT_VIEWER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "AssetCreator",
            "code": "AssetCreator",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPA Architect",
            "code": "BPA_ARCHITECT",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "TL Approver",
            "code": "TL_APPROVER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "PGR Administrator",
            "code": "PGR-ADMIN",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPA Town Planner",
            "code": "BPA_TOWNPLANNER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Field Employee",
            "code": "FEMP",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "PTIS Admin",
            "code": "PTIS_ADMIN",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPA Supervisor",
            "code": "BPA_SUPERVISOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "FSM Payment Collector",
            "code": "FSM_COLLECTOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPAREG Approver",
            "code": "BPAREG_APPROVER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "FSM Employee Application Editor",
            "code": "FSM_EDITOR_EMP",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "TL doc verifier",
            "code": "TL_DOC_VERIFIER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "FSM Employee Application Viewer",
            "code": "FSM_VIEW_EMP",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Employee",
            "code": "EMPLOYEE",
            "tenantId": "pb.nawanshahr"
        },
        {
            "name": "PTIS Master",
            "code": "PTIS_MASTER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "FSM Desluding Operator",
            "code": "FSM_DSO",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "TL Admin",
            "code": "TL_ADMIN",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "SW Field Inspector",
            "code": "SW_FIELD_INSPECTOR",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "NoC counter Approver",
            "code": "NOC_APPROVER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "HRMS Admin",
            "code": "HRMS_ADMIN",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "WS Approver",
            "code": "WS_APPROVER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Super User",
            "code": "SUPERUSER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "BPA NOC Verifier",
            "code": "BPA_NOC_VERIFIER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "FSM Employee Dashboard Viewer",
            "code": "FSM_DASHBOARD_VIEWER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "System user",
            "code": "SYSTEM",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "SW Approver",
            "code": "SW_APPROVER",
            "tenantId": "pb.amritsar"
        },
        {
            "name": "Grivance Administrator",
            "code": "GA",
            "tenantId": "pb.amritsar"
        }
    ],
    "active": true,
    "tenantId": "pb.amritsar",
    "permanentCity": null
}
  const employeeTenantId = window.localStorage.getItem("Employee.tenant-id");

  const userTypeInfo = userType === "CITIZEN" || userType === "QACT" ? "citizen" : "employee";
  window.Digit.SessionStorage.set("user_type", userTypeInfo);
  window.Digit.SessionStorage.set("userType", userTypeInfo);

  if (userType !== "CITIZEN") {
    window.Digit.SessionStorage.set("User", { access_token: token, info: userType !== "CITIZEN" ? employeeInfo : citizenInfo });
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
  console.log(registry);
  ReactDOM.render(<DigitUI stateCode={stateCode} enabledModules={enabledModules} moduleReducers={moduleReducers} />, document.getElementById("root"));
};

initLibraries().then(() => {
  initDigitUI();
});
