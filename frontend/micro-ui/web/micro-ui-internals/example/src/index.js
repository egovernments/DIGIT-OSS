//React micro ui index.js file
import React from "react";
import ReactDOM from "react-dom";
import { useQuery } from "react-query";

import { initLibraries } from "@egovernments/digit-ui-libraries";
import { PGRReducers } from "@egovernments/digit-ui-module-pgr";
import { PTModule, PTLinks, PTComponents } from "@egovernments/digit-ui-module-pt";
import { MCollectModule, MCollectLinks } from "@egovernments/digit-ui-module-mcollect";
// import { TLModule, TLLinks } from "@egovernments/digit-ui-module-tl";
import { initFSMComponents } from "@egovernments/digit-ui-module-fsm";
import { initPGRComponents } from "@egovernments/digit-ui-module-pgr";
import {initCoreComponents} from "@egovernments/digit-ui-module-core";
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
  // const userType = window.sessionStorage.getItem("userType") || process.env.REACT_APP_USER_TYPE || "CITIZEN";
  
  // const userType = "CITIZEN";
  // const token ="7cd58aae-30b3-41ed-a1b3-3417107a993c";
  const userType = window.location.href.includes("/citizen/")?"CITIZEN":"EMPLOYEE";
  const token = userType=="CITIZEN"?
  "1fc54d5d-717a-4e0e-9666-75a888953563":    //citizen latest token
  "7c2b45f4-5b5d-4c76-9758-55cf94f0306c";    // employee latest token
  
  // const token = window.sessionStorage.getItem("token") || process.env[`REACT_APP_${userType}_TOKEN`];

  console.log(token);
 
  const citizenInfo = window.localStorage.getItem("Citizen.user-info");
 
  const citizenTenantId = window.localStorage.getItem("Citizen.tenant-id") || stateCode;

  const employeeInfo = window.localStorage.getItem("Employee.user-info")||
  {
    "id": 24226,
    "uuid": "11b0e02b-0145-4de2-bc42-c97b96264807",
    "userName": "amr001",
    "name": "leela",
    "mobileNumber": "9814424443",
    "emailId": "leela@llgmail.com",
    "locale": null,
    "type": "EMPLOYEE",
    "roles": [
      {
        "name": "NoC counter employee",
        "code": "NOC_CEMP",
        "tenantId": "pg.citya"
      },
      {
        "name": "Grievance Routing Officer",
        "code": "CR_PT",
        "tenantId": "pg.citya"
      },
      {
        "name": "WS Document Verifier",
        "code": "WS_DOC_VERIFIER",
        "tenantId": "pg.citya"
      },
      {
        "name": "TL Field Inspector",
        "code": "TL_FIELD_INSPECTOR",
        "tenantId": "pg.citya"
      },
      {
        "name": "BPA Field Inspector",
        "code": "BPA_FIELD_INSPECTOR",
        "tenantId": "pg.citya"
      },
      {
        "name": "TL Approver",
        "code": "TL_APPROVER",
        "tenantId": "pg.citya"
      },
      {
        "name": "BPA Services Approver",
        "code": "BPA_APPROVER",
        "tenantId": "pg.citya"
      },
      {
        "name": "Field Employee",
        "code": "FEMP",
        "tenantId": "pg.citya"
      },
      {
        "name": "Counter Employee",
        "code": "CEMP",
        "tenantId": "pg.citya"
      },
      {
        "name": "WS Counter Employee",
        "code": "WS_CEMP",
        "tenantId": "pg.citya"
      },
      {
        "name": "BPAREG Approver",
        "code": "BPAREG_APPROVER",
        "tenantId": "pg.citya"
      },
      {
        "name": "WS Field Inspector",
        "code": "WS_FIELD_INSPECTOR",
        "tenantId": "pg.citya"
      },
      {
        "name": "Collection Operator",
        "code": "COLL_OPERATOR",
        "tenantId": "pg.citya"
      },
      {
        "name": "TL doc verifier",
        "code": "TL_DOC_VERIFIER",
        "tenantId": "pg.citya"
      },
      {
        "name": "CSC Collection Operator",
        "code": "CSC_COLL_OPERATOR",
        "tenantId": "pg.citya"
      },
      {
        "name": "Employee",
        "code": "EMPLOYEE",
        "tenantId": "pg.citya"
      },
      {
        "name": "TL Counter Employee",
        "code": "TL_CEMP",
        "tenantId": "pg.citya"
      },
      {
        "name": "TL Creator",
        "code": "TL_CREATOR",
        "tenantId": "pg.citya"
      },
      {
        "name": "BPAREG doc verifier",
        "code": "BPAREG_DOC_VERIFIER",
        "tenantId": "pg.citya"
      },
      {
        "name": "Customer Support Representative",
        "code": "CSR",
        "tenantId": "pg.citya"
      },
      {
        "name": "NoC counter Approver",
        "code": "NOC_APPROVER",
        "tenantId": "pg.citya"
      },
      {
        "name": "HRMS Admin",
        "code": "HRMS_ADMIN",
        "tenantId": "pg.citya"
      },
      {
        "name": "Universal Collection Employee",
        "code": "UC_EMP",
        "tenantId": "pg.citya"
      },
      {
        "name": "WS Approver",
        "code": "WS_APPROVER",
        "tenantId": "pg.citya"
      },
      {
        "name": "BPA Services verifier",
        "code": "BPA_VERIFIER",
        "tenantId": "pg.citya"
      },
      {
        "name": "PT Counter Approver",
        "code": "PT_APPROVER",
        "tenantId": "pg.citya"
      },
      {
        "name": "NoC Field Inpector",
        "code": "NOC_FIELD_INSPECTOR",
        "tenantId": "pg.citya"
      },
      {
        "name": "Grievance Officer",
        "code": "GO",
        "tenantId": "pg.citya"
      },
      {
        "name": "Super User",
        "code": "SUPERUSER",
        "tenantId": "pg.citya"
      },
      {
        "name": "NOC Department Approver",
        "code": "NOC_DEPT_APPROVER",
        "tenantId": "pg.citya"
      },
      {
        "name": "WS Clerk",
        "code": "WS_CLERK",
        "tenantId": "pg.citya"
      },
      {
        "name": "NoC Doc Verifier",
        "code": "NOC_DOC_VERIFIER",
        "tenantId": "pg.citya"
      }
    ],
    "active": true,
    "tenantId": "pg.citya"
  };
  const employeeTenantId = window.localStorage.getItem("Employee.tenant-id")||"pg.citya";

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
  // eslint-disable-next-line
  Digit.ComponentRegistryService.setupRegistry({
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

  initCoreComponents();
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

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pg";
  initTokens(stateCode);
  // eslint-disable-next-line
  const registry = Digit.ComponentRegistryService.getRegistry();
  console.log(registry);

  
   const getLocalities = {
    admin: async (tenant) => {   
      return (await Digit.LocationService.getLocalities(tenant)).TenantBoundary[0];
    },
    revenue: async (tenant) => {
      // console.log("find me here", tenant)
      return (await Digit.LocationService.getRevenueLocalities(tenant)).TenantBoundary[0];
    },
  };
  

  const useLocalities = (tenant, boundaryType = "revenue", config, t) => {
    // console.log("find boundary type here",boundaryType)
    return useQuery(["BOUNDARY_DATA", tenant, boundaryType], () => getLocalities[boundaryType.toLowerCase()](tenant), {
      select: (data) => {
        return Digit.LocalityService.get(data).map((key) => {
          return { ...key, i18nkey: t(key.i18nkey) };
        });
      },
      staleTime: Infinity,
      ...config,
    });
  };
  

  Digit.Hooks.useBoundaryLocalities = useLocalities;
  ReactDOM.render(<DigitUI stateCode={stateCode} enabledModules={enabledModules} moduleReducers={moduleReducers} />, document.getElementById("root"));
};





initLibraries().then(() => {
  initDigitUI();
});

