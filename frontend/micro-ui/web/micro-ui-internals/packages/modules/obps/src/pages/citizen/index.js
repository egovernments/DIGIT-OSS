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

const App = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {!location.pathname.includes("response") && <BackButton>{t("CS_COMMON_BACK")}</BackButton>}
      <Switch>
      <PrivateRoute path={`${path}/home`} component={BPACitizenHomeScreen} />
        <PrivateRoute path={`${path}/edcrscrutiny/apply`} component={CreateEDCR} />   
        <PrivateRoute path={`${path}/edcrscrutiny/oc-apply`} component={CreateOCEDCR} />   
        <PrivateRoute
          path={`${path}/new-building-permit`}
          component={() => <NewBuildingPermit />}
        />  
        <PrivateRoute path={`${path}/stakeholder/apply`} component={StakeholderRegistration} />       
        <PrivateRoute path={`${path}/my-applications`} component={MyApplication} />
      </Switch>
    </React.Fragment>
  )
}

export default App; 