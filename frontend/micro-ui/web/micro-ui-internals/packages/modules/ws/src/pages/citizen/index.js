import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, Route } from "react-router-dom";
import { PrivateRoute, BackButton } from "@egovernments/digit-ui-react-components";
import WSCreate from "./WSCreate/index";
import SearchConnectionComponent from "./SearchConnection";
import SearchResultsComponent from "./SearchResults";
import TestAcknowledgment from "./TestAcknowledgment";
import WNSMyBillsComponent from "./WnSMyBills";
import { WSMyApplications } from "./WSMyApplications";
import WSApplicationDetails from "./WSApplicationDetails";
import WSAdditionalDetails from "./WSMyApplications/additionalDetails";
import MyConnections from "./MyConnection";
import ConnectionDetails from "./MyConnection/ConnectionDetails";
import consumptionDetails from "./MyConnection/ConsumptionDetails";
import NewApplication from "../employee/NewApplication";

const App = ({ path }) => {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>
      <Switch>
        <PrivateRoute path={`${path}/new-application`} component={NewApplication} />
        <PrivateRoute path={`${path}/create-application`} component={WSCreate} />
        <Route path={`${path}/search`} component={SearchConnectionComponent} />
        <Route path={`${path}/wns-my-bills`} component={WNSMyBillsComponent} />
        <Route path={`${path}/search-results`} component={SearchResultsComponent} />
        <Route path={`${path}/test-acknowledgment`} component={TestAcknowledgment} />
        <PrivateRoute path={`${path}/my-application`} component={WSMyApplications} />
        <PrivateRoute path={`${path}/my-connection`} component={MyConnections} />
        <PrivateRoute path={`${path}/connection/application/:acknowledgementIds`} component={WSApplicationDetails} />
        <PrivateRoute path={`${path}/connection/additional/:acknowledgementIds`} component={WSAdditionalDetails} />
        <PrivateRoute path={`${path}/connection/details/:acknowledgementIds`} component={ConnectionDetails} />
        <PrivateRoute path={`${path}/consumption/details`} component={consumptionDetails} />
      </Switch>
    </React.Fragment>
  );
};

export default App;
