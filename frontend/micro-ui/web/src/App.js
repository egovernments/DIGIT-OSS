import React from "react";

import {
  initPGRComponents,
  PGRReducers,
} from "@egovernments/digit-ui-module-pgr";
import { initFSMComponents } from "@egovernments/digit-ui-module-fsm";
import {
  PTModule,
  PTLinks,
  PTComponents,
} from "@egovernments/digit-ui-module-pt";
import {
  MCollectModule,
  MCollectLinks,
  initMCollectComponents,
} from "@egovernments/digit-ui-module-mcollect";
// import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import {
  PaymentModule,
  PaymentLinks,
  paymentConfigs,
} from "./customizations/common/src/Module";
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import {
  HRMSModule,
  initHRMSComponents,
} from "@egovernments/digit-ui-module-hrms";
import {
  TLModule,
  TLLinks,
  initTLComponents,
} from "@egovernments/digit-ui-module-tl";
import {
  initReceiptsComponents,
  ReceiptsModule,
} from "@egovernments/digit-ui-module-receipts";

import { customizations } from "./customizations";
import { useLocalities } from "./customizations/utils";
import { receipt_download } from "./customizations/utils";
import { enabledModules} from "./moduleconfigfile";

initLibraries();

// const enabledModules = [
  
//   "Payment",
//   "PT",
//   "QuickPayLinks",
//   "DSS",
//   "MCollect",
//   "HRMS",
//   "TL",
//   "Receipts",
// ];

window.Digit.ComponentRegistryService.setupRegistry({
  ...paymentConfigs,
  PTModule,
  PTLinks,
  PaymentModule,
  PaymentLinks,
  ...PTComponents,
  MCollectLinks,
  MCollectModule,
  HRMSModule,
  TLModule,
  TLLinks,
  ReceiptsModule,
});

initPGRComponents();
initFSMComponents();
// initDSSComponents();
initMCollectComponents();
initHRMSComponents();
initTLComponents();
initReceiptsComponents();

const moduleReducers = (initData) => ({
  pgr: PGRReducers(initData),
});

customizations.forEach((setup) => setup());

// console.log(window.Digit.ComponentRegistryService);

function App() {
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    process.env.REACT_APP_STATE_LEVEL_TENANT_ID;

  if (!stateCode) {
    return <h1>stateCode is not defined</h1>;
  }
window.Digit.Hooks.useBoundaryLocalities = useLocalities;
window.Digit.MCollectService.receipt_download = receipt_download;
window.Digit.LocalizationService.getLocale({
  modules: [`rainmaker-${window.Digit.ULBService.getCurrentTenantId()}`],
   locale: window.Digit.StoreData.getCurrentLanguage(),
   tenantId: window.Digit.ULBService.getCurrentTenantId()
  })
  
  return (
    <DigitUI
      stateCode={stateCode}
      enabledModules={enabledModules}
      moduleReducers={moduleReducers}
    />
  );
}

export default App;
