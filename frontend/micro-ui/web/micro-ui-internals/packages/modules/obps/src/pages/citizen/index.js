import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import { PrivateRoute, BackButton } from "@egovernments/digit-ui-react-components";
import NewBuildingPermit from "./NewBuildingPermit";
import CreateEDCR from "./EDCR";
import CreateOCEDCR from "./OCEDCR";
import BPACitizenHomeScreen from "./home"; 
import StakeholderRegistration from "./StakeholderRegistration";
import MyApplication from "./MyApplication";
import ApplicationDetails from "./ApplicationDetail";
import OCBuildingPermit from "./OCBuildingPermit";


const App = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();
  const rest = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
  const serviceType = rest.split('/').pop();
  const applicationTypeUrl = rest.substring(0, rest.lastIndexOf("/"));
  const applicationType = applicationTypeUrl.split('/').pop();

  return (
    <React.Fragment>
      {!location.pathname.includes("response") && <BackButton style={{border: "none"}}>{t("CS_COMMON_BACK")}</BackButton>}
      <Switch>
      <PrivateRoute path={`${path}/home`} component={BPACitizenHomeScreen} />
        <PrivateRoute path={`${path}/edcrscrutiny/apply`} component={CreateEDCR} />   
        <PrivateRoute path={`${path}/edcrscrutiny/oc-apply`} component={CreateOCEDCR} />   
        <PrivateRoute path={`${path}/bpa/building_plan_scrutiny/new_construction`} component={NewBuildingPermit} />   
        <PrivateRoute path={`${path}/bpa/building_oc_plan_scrutiny/new_construction`} component={OCBuildingPermit} />   
        {/* <PrivateRoute
          path={`${path}/bpa/${applicationType}/${serviceType}`}
          component={NewBuildingPermit}
        />   */}
        <PrivateRoute path={`${path}/stakeholder/apply`} component={StakeholderRegistration} />       
        <PrivateRoute path={`${path}/my-applications`} component={MyApplication} />
        <PrivateRoute path={`${path}/stakeholder/:id`} component={ApplicationDetails} />
      </Switch>
    </React.Fragment>
  )
}

export default App; 