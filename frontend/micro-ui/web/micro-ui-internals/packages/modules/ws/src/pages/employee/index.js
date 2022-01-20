import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, Route } from "react-router-dom";
import { PrivateRoute, BackButton } from "@egovernments/digit-ui-react-components";
import ApplicationDetails  from "./ApplicationDetails";


const EmployeeApp = ({ path }) => {
    console.log(path);
  const location = useLocation()
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>
      <Switch>
      <PrivateRoute path={`${path}/application-details`} component={() => <ApplicationDetails parentRoute={path} />} />
        {/* <Route path={`${path}/search`} component={SearchConnectionComponent} />
        <Route path={`${path}/search-results`} component={SearchResultsComponent} /> */}
      </Switch>
    </React.Fragment> 
  )
}

export default EmployeeApp; 