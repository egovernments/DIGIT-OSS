import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, Route } from "react-router-dom";
import { PrivateRoute, BackButton } from "@egovernments/digit-ui-react-components";
import WSCreate from "./WSCreate/index";
import WSDisconnection from "./WSDisconnection/index";
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
import WSMyPayments from "./MyPayment";
import EditApplication from "./EditApplication";

const App = ({ path }) => {
  const location = useLocation();
  const { t } = useTranslation();
  let isCommonPTPropertyScreen = window.location.href.includes("/ws/create-application/property-details");
  let isAcknowledgement = window.location.href.includes("/acknowledgement");
  const WSDisconnectAcknowledgement = Digit?.ComponentRegistryService?.getComponent("WSDisconnectAcknowledgement");

  const getBackPageNumber = () => {
    let goBacktoFromProperty = -1;
    if (sessionStorage.getItem("VisitedCommonPTSearch") === "true" && isCommonPTPropertyScreen) {
      goBacktoFromProperty = -4;
      return goBacktoFromProperty;
    }
    return goBacktoFromProperty;
  };

  return (
    <React.Fragment>
      <div className="ws-citizen-wrapper">
        {!isAcknowledgement && <BackButton style={{ border: "none" }} /* isCommonPTPropertyScreen={isCommonPTPropertyScreen} */ getBackPageNumber={getBackPageNumber}>
          {t("CS_COMMON_BACK")}
        </BackButton>}
        <Switch>
          <PrivateRoute path={`${path}/create-application`} component={WSCreate} />
          <PrivateRoute path={`${path}/disconnect-application`} component={WSDisconnection} />
          <PrivateRoute path={`${path}/disconnect-acknowledge`} component={WSDisconnectAcknowledgement} />
          <Route path={`${path}/search`} component={SearchConnectionComponent} />
          <PrivateRoute path={`${path}/my-bills`} component={WNSMyBillsComponent} />
          <Route path={`${path}/search-results`} component={SearchResultsComponent} />
          <Route path={`${path}/test-acknowledgment`} component={TestAcknowledgment} />
          <PrivateRoute path={`${path}/my-payments`} component={WSMyPayments} />
          <PrivateRoute path={`${path}/my-applications`} component={WSMyApplications} />
          <PrivateRoute path={`${path}/my-connections`} component={MyConnections} />
          <PrivateRoute path={`${path}/connection/application/:acknowledgementIds`} component={WSApplicationDetails} />
          <PrivateRoute path={`${path}/connection/additional/:acknowledgementIds`} component={WSAdditionalDetails} />
          <PrivateRoute path={`${path}/connection/details/:acknowledgementIds`} component={ConnectionDetails} />
          <PrivateRoute path={`${path}/consumption/details`} component={consumptionDetails} />
          <PrivateRoute path={`${path}/edit-application/:tenantId`} component={EditApplication} />
          <PrivateRoute path={`${path}/modify-connection/:tenantId`} component={EditApplication} />
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default App;
