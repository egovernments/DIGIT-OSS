import React from 'react';

import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { PTModule, PTLinks, PTComponents } from "@egovernments/digit-ui-module-pt";
import { PaymentModule, PaymentLinks, paymentConfigs } from "@egovernments/digit-ui-module-common";
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
// import { initWSComponents } from "@egovernments/digit-ui-module-ws"; 
import {initCustomisationComponents} from "./Customisations";
import { initCommonPTComponents } from "@egovernments/digit-ui-module-commonpt";
import { BRModule ,initBRComponents ,BRLinks} from "@egovernments/digit-ui-module-br";

initLibraries();
//"WS" removed the ws enabledModules ;
const enabledModules = ["Payment", "PT","QuickPayLinks","HRMS", "DSS","Engagement", "CommonPT","BR"];
window.Digit.ComponentRegistryService.setupRegistry({
  ...paymentConfigs,
  PaymentModule,
  PaymentLinks,
  PTModule,
  PTLinks,
  ...PTComponents,
  BRModule,
  BRLinks,

});

initBRComponents();
initDSSComponents();
initEngagementComponents();
initCommonPTComponents();
// initWSComponents();

initCustomisationComponents();




function App() {
  const stateCode = window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || process.env.REACT_APP_STATE_LEVEL_TENANT_ID;
  if (!stateCode) {
    return <h1>stateCode is not defined</h1>
  }
  return (
    <DigitUI stateCode={stateCode} enabledModules={enabledModules}  />
  );
}

export default App;
