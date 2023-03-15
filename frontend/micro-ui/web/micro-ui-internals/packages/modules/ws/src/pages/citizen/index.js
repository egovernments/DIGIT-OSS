import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, Route } from "react-router-dom";
import { PrivateRoute, BackButton } from "@egovernments/digit-ui-react-components";
import TestAcknowledgment from "./TestAcknowledgment";
import { WSMyApplications } from "./WSMyApplications";

const App = ({ path }) => {
  const location = useLocation();
  const { t } = useTranslation();
  let isCommonPTPropertyScreen = window.location.href.includes("/ws/create-application/property-details");
  let isAcknowledgement = window.location.href.includes("/acknowledgement") || window.location.href.includes("/disconnect-acknowledge");
  const WSDisconnectAcknowledgement = Digit?.ComponentRegistryService?.getComponent("WSDisconnectAcknowledgement");

  const getBackPageNumber = () => {
    let goBacktoFromProperty = -1;
    if (sessionStorage.getItem("VisitedCommonPTSearch") === "true" && isCommonPTPropertyScreen) {
      goBacktoFromProperty = -4;
      return goBacktoFromProperty;
    }
    return goBacktoFromProperty;
  };

  const WSCreate = Digit?.ComponentRegistryService?.getComponent("WSCreate");
  const WSDisconnection = Digit?.ComponentRegistryService?.getComponent("WSDisconnection");
  const WSSearchConnectionComponent = Digit?.ComponentRegistryService?.getComponent("WSSearchConnectionComponent");
  const WSSearchResultsComponent = Digit?.ComponentRegistryService?.getComponent("WSSearchResultsComponent");
  const WSCitizenApplicationDetails = Digit?.ComponentRegistryService?.getComponent("WSCitizenApplicationDetails");
  const WSAdditionalDetails = Digit?.ComponentRegistryService?.getComponent("WSAdditionalDetails");
  const WSCitizenConnectionDetails = Digit?.ComponentRegistryService?.getComponent("WSCitizenConnectionDetails");
  const WSCitizenConsumptionDetails = Digit?.ComponentRegistryService?.getComponent("WSCitizenConsumptionDetails");
  const WSMyPayments = Digit?.ComponentRegistryService?.getComponent("WSMyPayments");
  const WSCitizenEditApplication = Digit?.ComponentRegistryService?.getComponent("WSCitizenEditApplication");
  const WSReSubmitDisconnectionApplication = Digit?.ComponentRegistryService?.getComponent("WSReSubmitDisconnectionApplication");
  const WSMyConnections = Digit?.ComponentRegistryService?.getComponent("WSMyConnections");
  const WNSMyBillsComponent = Digit?.ComponentRegistryService?.getComponent("WNSMyBillsComponent");
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
          <PrivateRoute path={`${path}/resubmit-disconnect-application`} component={WSReSubmitDisconnectionApplication} />
          <Route path={`${path}/search`} component={WSSearchConnectionComponent} />
          <PrivateRoute path={`${path}/my-bills`} component={WNSMyBillsComponent} />
          <Route path={`${path}/search-results`} component={WSSearchResultsComponent} />
          <Route path={`${path}/test-acknowledgment`} component={TestAcknowledgment} />
          <PrivateRoute path={`${path}/my-payments`} component={WSMyPayments} />
          <PrivateRoute path={`${path}/my-applications`} component={WSMyApplications} />
          <PrivateRoute path={`${path}/my-connections`} component={WSMyConnections} />
          <PrivateRoute path={`${path}/connection/application/:acknowledgementIds`} component={WSCitizenApplicationDetails} />
          <PrivateRoute path={`${path}/connection/additional/:acknowledgementIds`} component={WSAdditionalDetails} />
          <PrivateRoute path={`${path}/connection/details/:acknowledgementIds`} component={WSCitizenConnectionDetails} />
          <PrivateRoute path={`${path}/consumption/details`} component={WSCitizenConsumptionDetails} />
          <PrivateRoute path={`${path}/edit-application/:tenantId`} component={WSCitizenEditApplication} />
          <PrivateRoute path={`${path}/modify-connection/:tenantId`} component={WSCitizenEditApplication} />
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default App;
