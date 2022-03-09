import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, Route } from "react-router-dom";
import { PrivateRoute, BackButton } from "@egovernments/digit-ui-react-components";
import WSCreate from "./WSCreate/index"
import SearchConnectionComponent from "./SearchConnection";
import SearchResultsComponent from "./SearchResults";
import { WSMyApplications } from "./WSMyApplications";
import WSApplicationDetails from "./WSApplicationDetails";
import WSAdditionalDetails from "./WSMyApplications/additionalDetails";

const App = ({ path }) => {
  const location = useLocation()
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>
      <Switch>
        <PrivateRoute path={`${path}/create-application`} component={WSCreate} />
        <Route path={`${path}/search`} component={SearchConnectionComponent} />
        <Route path={`${path}/search-results`} component={SearchResultsComponent} />
        <PrivateRoute path={`${path}/my-application`} component={WSMyApplications} />
        <PrivateRoute path={`${path}/connection/application/:acknowledgementIds`} component={WSApplicationDetails} />
        <PrivateRoute path={`${path}/connection/additional/:acknowledgementIds`} component={WSAdditionalDetails} />
      </Switch>
    </React.Fragment>
  )
}

export default App;