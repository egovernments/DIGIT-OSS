import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import { PrivateRoute, BreadCrumb } from "@egovernments/digit-ui-react-components";
import ApplicationBillAmendment from "./ApplicationBillAmendment";
import RequiredDocuments from "./RequiredDocuments";
import NewApplication from "./NewApplication";
import ApplicationDetails from "./ApplicationDetails";
import GetConnectionDetails from "./connectionDetails/connectionDetails";
import ActivateConnection from "./ActivateConnection";
import WSResponse from "./WSResponse";
import Response from "./Response";
import ApplicationDetailsBillAmendment from "./ApplicationDetailsBillAmendment";
import Search from "./search";
import SearchWater from "./SearchWater";
import EditApplication from "./EditApplication";
import ConsumptionDetails from "./connectionDetails/ConsumptionDetails";
import ModifyApplication from "./ModifyApplication";
import EditModifyApplication from "./EditModifyApplication";

import BillIAmendMentInbox from "../../components/BillIAmendMentInbox";

const BILLSBreadCrumbs = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      path: "/digit-ui/employee",
      content: t("ES_COMMON_HOME"),
      show: true,
    },
    {
      path: "/digit-ui/employee/water/inbox",
      content: t("ES_COMMON_BILLS_WATER_INBOX_LABEL"),
      show: location.pathname.includes("/water/inbox") ? true : false,
    },
    {
      path: "/digit-ui/employee/sewerage/inbox",
      content: t("ES_COMMON_BILLS_SEWERAGE_INBOX_LABEL"),
      show: location.pathname.includes("/sewerage/inbox") ? true : false,
    },
  ];

  return <BreadCrumb crumbs={crumbs} />;
};
const App = ({ path }) => {
  const location = useLocation();
  const { t } = useTranslation();

  /* Update Other imports to similar way  */
  const WSDocsRequired = Digit?.ComponentRegistryService?.getComponent('WSDocsRequired');
  const WSInbox = Digit?.ComponentRegistryService?.getComponent('WSInbox');
  
  return (
    <React.Fragment>
      <BILLSBreadCrumbs location={location} />
      <Switch>
        <PrivateRoute path={`${path}/create-application`} component={WSDocsRequired} />
        <PrivateRoute path={`${path}/new-application`} component={NewApplication} />
        <PrivateRoute path={`${path}/edit-application`} component={EditApplication} />
        <PrivateRoute path={`${path}/application-details`} component={ApplicationDetails} />
        <PrivateRoute path={`${path}/connection-details`} component={GetConnectionDetails} />
        <PrivateRoute path={`${path}/bill-amendment`} component={() => <ApplicationBillAmendment {...{ path }} />} />
        <PrivateRoute path={`${path}/application-details-bill-amendment`} component={() => <ApplicationDetailsBillAmendment {...{ path }} />} />
        <PrivateRoute path={`${path}/response`} component={() => <Response {...{ path }} />} />
        <PrivateRoute path={`${path}/required-documents`} component={() => <RequiredDocuments {...{ path }} />} />
        <PrivateRoute path={`${path}/activate-connection`} component={ActivateConnection} />
        <PrivateRoute path={`${path}/search-application`} component={(props) => <Search {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/ws-response`} component={WSResponse} />
        <PrivateRoute path={`${path}/search`} component={(props) => <SearchWater {...props} parentRoute={path} />} />
        {/* <Route path={`${path}/search`} component={SearchConnectionComponent} />
        <Route path={`${path}/search-results`} component={SearchResultsComponent} /> */}
        <PrivateRoute path={`${path}/consumption-details`} component={ConsumptionDetails} />
        <PrivateRoute path={`${path}/modify-application`} component={ModifyApplication} />
        <PrivateRoute path={`${path}/modify-application-edit`} component={EditModifyApplication} />
        <PrivateRoute path={`${path}/bill-amend/inbox`} component={(props) => <BillIAmendMentInbox {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/water/inbox`} component={(props) => <WSInbox {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/sewerage/inbox`} component={(props) => <WSInbox {...props} parentRoute={path} />} />

        {/* <Route path={`${path}/search`} component={SearchConnectionComponent} />
        <Route path={`${path}/search-results`} component={SearchResultsComponent} /> */}
      </Switch>
    </React.Fragment>
  );
};

export default App;
