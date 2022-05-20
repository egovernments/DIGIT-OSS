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
import WSDisconnectionDocsRequired from "../../pageComponents/WSDisconnectionDocsRequired";
import ResponseBillAmend from "./ResponseBillAmend"
import BillIAmendMentInbox from "../../components/BillIAmendMentInbox";

const BILLSBreadCrumbs = ({ location }) => {
  const { t } = useTranslation();

  const search = useLocation().search;
  const fromScreen = new URLSearchParams(search).get("from") || null;

  const crumbs = [
    {
      path: "/digit-ui/employee",
      content: t("ES_COMMON_HOME"),
      show: true,
    },
    {
      path: "/digit-ui/employee/ws/create-application",
      content: t("ES_COMMON_WS_DOCUMENTS_REQUIRED"),
      show: location.pathname.includes("/create-application") ? true : false,
    },
    {
      path: "/digit-ui/employee/water/inbox",
      content: t("ES_COMMON_BILLS_WATER_INBOX_LABEL"),
      show: location.pathname.includes("/water/inbox")  ? true : false,
    },
    {
      path: "/digit-ui/employee/ws/water/search-application",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_SEARCH_APPLICATIONS")}` : t("WS_SEARCH_APPLICATIONS"),
      show: location.pathname.includes("/water/search-application") ? true : false,
      isBack: fromScreen && true,
    },
    {
      path: "/digit-ui/employee/ws/water/search-connection",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_SEARCH_CONNECTION")}` : t("WS_SEARCH_CONNECTION"),
      show: location.pathname.includes("/water/search-connection") ? true : false,
      isBack:fromScreen && true,
    },
    {
      path: "/digit-ui/employee/sewerage/inbox",
      content: t("ES_COMMON_BILLS_SEWERAGE_INBOX_LABEL"),
      show: location.pathname.includes("/sewerage/inbox") ? true : false,
    },
    {
      path: "/digit-ui/employee/ws/new-application",
      content: t("ES_COMMON_WS_NEW_CONNECTION"),
      show:location.pathname.includes("/new-application") ? true : false,
    },
    {
      path: "/digit-ui/employee/ws/ws-response",
      content: t("ACTION_TEST_RESPONSE"),
      show: location.pathname.includes("/ws-response") ? true : false,
    },
    {
      path: "/digit-ui/employee/ws/consumption-details",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_VIEW_CONSUMPTION_DETAIL")}` : t("WS_VIEW_CONSUMPTION_DETAIL"),
      show: location.pathname.includes("/consumption-details") ? true : false,
      isBack:fromScreen && true,
    },
    {
      path: "/digit-ui/employee/ws/application-details",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_APPLICATION_DETAILS_HEADER")}` : t("WS_APPLICATION_DETAILS_HEADER"),
      show: location.pathname.includes("/application-details") ? true : false,
      isBack: fromScreen && true,
    },
    {
      path: "/digit-ui/employee/ws/connection-details",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_COMMON_CONNECTION_DETAIL")
}`: t("WS_COMMON_CONNECTION_DETAIL"),
      show: location.pathname.includes("/connection-details") ? true : false,
      isBack: fromScreen && true,
    },
    {
      path: "/digit-ui/employee/ws/edit-application",
      content: `${t("WS_APPLICATION_DETAILS_HEADER")} / ${t("WS_APP_FOR_WATER_AND_SEWERAGE_EDIT_LABEL")}`,
      show: location.pathname.includes("/edit-application") ? true : false,
      isBack:  true,
    }
  ];

  return <BreadCrumb crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};
const App = ({ path }) => {
  const location = useLocation();
  const { t } = useTranslation();

  /* Update Other imports to similar way  */
  const WSDocsRequired = Digit?.ComponentRegistryService?.getComponent('WSDocsRequired');
  const WSInbox = Digit?.ComponentRegistryService?.getComponent('WSInbox');
  
  const locationCheck = window.location.href.includes("/employee/ws/new-application") || window.location.href.includes("/employee/ws/create-application")


  return (
    <Switch>
    <React.Fragment>
      <div className="ground-container">
        <div style={locationCheck ? { marginLeft: "12px" } : {marginLeft:"10px"} } >
          <BILLSBreadCrumbs location={location} />
        </div>
      
        <PrivateRoute path={`${path}/create-application`} component={WSDocsRequired} />
        <PrivateRoute path={`${path}/new-application`} component={NewApplication} />
        <PrivateRoute path={`${path}/edit-application`} component={EditApplication} />
        <PrivateRoute path={`${path}/application-details`} component={ApplicationDetails} />
        <PrivateRoute path={`${path}/connection-details`} component={GetConnectionDetails} />
        <PrivateRoute path={`${path}/bill-amendment`} component={() => <ApplicationBillAmendment {...{ path }} />} />
        <PrivateRoute path={`${path}/application-details-bill-amendment`} component={() => <ApplicationDetailsBillAmendment {...{ path }} />} />
        <PrivateRoute path={`${path}/response`} component={() => <Response {...{ path }} />} />
        <PrivateRoute path={`${path}/response-bill-amend`} component={() => <ResponseBillAmend {...{ path }} />} />
        <PrivateRoute path={`${path}/required-documents`} component={() => <RequiredDocuments {...{ path }} />} />
        <PrivateRoute path={`${path}/activate-connection`} component={ActivateConnection} />
        <PrivateRoute path={`${path}/water/search-application`} component={(props) => <Search {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/sewerage/search-application`} component={(props) => <Search {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/ws-response`} component={WSResponse} />
        <PrivateRoute path={`${path}/water/search-connection`} component={(props) => <SearchWater {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/sewerage/search`} component={(props) => <SearchWater {...props} parentRoute={path} />} />
        {/* <Route path={`${path}/search`} component={SearchConnectionComponent} />
        <Route path={`${path}/search-results`} component={SearchResultsComponent} /> */}
        <PrivateRoute path={`${path}/consumption-details`} component={ConsumptionDetails} />
        <PrivateRoute path={`${path}/modify-application`} component={ModifyApplication} />
        <PrivateRoute path={`${path}/modify-application-edit`} component={EditModifyApplication} />
        <PrivateRoute path={`${path}/disconnection-application`} component={WSDisconnectionDocsRequired} />
        <PrivateRoute path={`${path}/bill-amend/inbox`} component={(props) => <BillIAmendMentInbox {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/water/inbox`} component={(props) => <WSInbox {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/sewerage/inbox`} component={(props) => <WSInbox {...props} parentRoute={path} />} />
        {/* <Route path={`${path}/search`} component={SearchConnectionComponent} />
        <Route path={`${path}/search-results`} component={SearchResultsComponent} /> */}
      </div>
    </React.Fragment>
    </Switch>
  );
};

export default App;
