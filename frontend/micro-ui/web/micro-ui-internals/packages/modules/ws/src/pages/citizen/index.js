import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, Route } from "react-router-dom";
import { PrivateRoute, BackButton } from "@egovernments/digit-ui-react-components";
import WSCreate from "./WSCreate/index"
import SearchConnectionComponent from "./SearchConnection";
import SearchResultsComponent from "./SearchResults";
import { WSMyApplications } from "./WSMyApplications";

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
        <Route path={`${path}/my-application`} component={WSMyApplications} />
      </Switch>
    </React.Fragment>
  )
}

export default App;