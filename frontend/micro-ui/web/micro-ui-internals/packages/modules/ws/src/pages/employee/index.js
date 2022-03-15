import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, Route } from "react-router-dom";
import { PrivateRoute, BackButton, BreadCrumb } from "@egovernments/digit-ui-react-components";
import NewApplication from "./NewApplication"
import WSDocsRequired from "../../pageComponents/WSDocsRequired";
import ApplicationDetails from "./ApplicationDetails";
import ActivateConnection from "./ActivateConnection";
// import SearchConnectionComponent from "./SearchConnection";
// import SearchResultsComponent from "./SearchResults";

const App = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();
  return (
    <React.Fragment>
      {/* <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton> */}
      <BreadCrumb></BreadCrumb>
      <Switch>
        <PrivateRoute path={`${path}/create-application`} component={WSDocsRequired} />
        <PrivateRoute path={`${path}/new-application`} component={NewApplication} />
        <PrivateRoute path={`${path}/application-details`} component={ApplicationDetails} />
        <PrivateRoute path={`${path}/activate-connection`} component={ActivateConnection} />
        {/* <Route path={`${path}/search`} component={SearchConnectionComponent} />
        <Route path={`${path}/search-results`} component={SearchResultsComponent} /> */}
      </Switch>
    </React.Fragment>
  )
}

export default App;