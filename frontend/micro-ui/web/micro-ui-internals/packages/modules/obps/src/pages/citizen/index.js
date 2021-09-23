// import React from "react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, Route } from "react-router-dom";
import { PrivateRoute, BackButton } from "@egovernments/digit-ui-react-components";
import NewBuildingPermit from "./NewBuildingPermit";
import CreateEDCR from "./EDCR";
import CreateOCEDCR from "./OCEDCR";
import BPACitizenHomeScreen from "./home";
import StakeholderRegistration from "./StakeholderRegistration";
import MyApplication from "./MyApplication";
import ApplicationDetails from "./ApplicationDetail";
import OCBuildingPermit from "./OCBuildingPermit";
import BpaApplicationDetail from "./BpaApplicationDetail";
import BPASendToArchitect from "./BPASendToArchitect";
import OCSendToArchitect from "./OCSendToArchitect";


const App = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();
  return (
        <React.Fragment>
          {!location.pathname.includes("response") && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
          <Switch>
            <PrivateRoute path={`${path}/home`} component={BPACitizenHomeScreen} />
            <PrivateRoute path={`${path}/edcrscrutiny/apply`} component={CreateEDCR} />
            <PrivateRoute path={`${path}/edcrscrutiny/oc-apply`} component={CreateOCEDCR} />
            <PrivateRoute path={`${path}/bpa/:applicationType/:serviceType`} component={NewBuildingPermit} />
            <PrivateRoute path={`${path}/ocbpa/:applicationType/:serviceType`} component={OCBuildingPermit}/>
            <PrivateRoute path={`${path}/stakeholder/apply`} component={StakeholderRegistration} />
            <Route path={`${path}/openlink/stakeholder/apply`} component={StakeholderRegistration} /> 
            <PrivateRoute path={`${path}/my-applications`} component={MyApplication} />
            <PrivateRoute path={`${path}/stakeholder/:id`} component={ApplicationDetails} />
            <PrivateRoute path={`${path}/bpa/:id`} component={BpaApplicationDetail} />
            <PrivateRoute path={`${path}/editApplication/bpa/:tenantId/:applicationNo`} component={BPASendToArchitect} />
            <PrivateRoute path={`${path}/editApplication/ocbpa/:tenantId/:applicationNo`} component={OCSendToArchitect} />
          </Switch>
        </React.Fragment>
  )
}

export default App;