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
import DisconnectionApplication from './DisconnectionApplication/'
import WSEditApplicationByConfig from "./EditApplication/WSEditApplicationByConfig";
import ResponseBillAmend from "./ResponseBillAmend";
import BillIAmendMentInbox from "../../components/BillIAmendMentInbox";
import GetDisconnectionDetails from "./DisconnectionDetails";
import WSDisconnectionResponse from "./DisconnectionApplication/WSDisconnectionResponse";
import ModifyApplicationDetails from "./ModifyApplicationDetails";
import EditDisconnectionApplication from "./EditDisconnectionApplication";
import EditDisconnectionByConfig from "./EditDisconnectionApplication/EditDisconnectionByConfig"
import ResubmitDisconnection from "./EditDisconnectionApplication/ResubmitDisconnection";

const BILLSBreadCrumbs = ({ location }) => {
  const { t } = useTranslation();

  const search = useLocation().search;
  const fromScreen = new URLSearchParams(search).get("from") || null;
  const IsEdit = new URLSearchParams(search).get("isEdit") || null;
  const applicationNumbercheck = new URLSearchParams(search).get("applicationNumber") || null;

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
      show: location.pathname.includes("/water/inbox") ? true : false,
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
      isBack: fromScreen && true,
    },
    {
      path: "/digit-ui/employee/ws/sewerage/search-application",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_SEARCH_APPLICATIONS")}` : t("WS_SEARCH_APPLICATIONS"),
      show: location.pathname.includes("/sewerage/search-application") ? true : false,
      isBack: fromScreen && true,
    },
    {
      path: "/digit-ui/employee/ws/sewerage/search-connection",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_SEARCH_CONNECTION")}` : t("WS_SEARCH_CONNECTION"),
      show: location.pathname.includes("/sewerage/search-connection") ? true : false,
      isBack: fromScreen && true,
    },
    {
      path: "/digit-ui/employee/sewerage/inbox",
      content: t("ES_COMMON_BILLS_SEWERAGE_INBOX_LABEL"),
      show: location.pathname.includes("/sewerage/inbox") ? true : false,
    },
    {
      path: "/digit-ui/employee/ws/new-application",
      content: t("ES_COMMON_WS_NEW_CONNECTION"),
      show: location.pathname.includes("/new-application") ? true : false,
    },
    {
      path: `${location?.pathname}${location.search}`,
      content: t("ACTION_TEST_RESPONSE"),
      show: location.pathname.includes("/ws-response") ? true : false,
    },
    {
      path: "/digit-ui/employee/ws/consumption-details",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_VIEW_CONSUMPTION_DETAIL")}` : t("WS_VIEW_CONSUMPTION_DETAIL"),
      show: location.pathname.includes("/consumption-details") ? true : false,
      isBack: fromScreen && true,
    },
    {
      path: sessionStorage.getItem("redirectedfromEDIT") === "true"? (applicationNumbercheck?.includes("SW_AP")?  "/digit-ui/employee/ws/sewerage/search-application" : "/digit-ui/employee/ws/water/search-application") : "/digit-ui/employee/ws/application-details",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_APPLICATION_DETAILS_HEADER")}` : t("WS_APPLICATION_DETAILS_HEADER"),
      show: location.pathname.includes("/application-details") ? true : false,
      isBack: sessionStorage.getItem("redirectedfromEDIT") !== "true" && fromScreen && true,
    },
    {
      path: sessionStorage.getItem("redirectedfromEDIT") === "true"? (applicationNumbercheck?.includes("SW_AP")?  "/digit-ui/employee/ws/sewerage/search-application" : "/digit-ui/employee/ws/water/search-application") : "/digit-ui/employee/ws/modify-details",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_APPLICATION_DETAILS_HEADER")}` : t("WS_APPLICATION_DETAILS_HEADER"),
      show: location.pathname.includes("/modify-details") ? true : false,
      isBack: sessionStorage.getItem("redirectedfromEDIT") !== "true" && fromScreen && true,
    },
    {
      path: "/digit-ui/employee/ws/disconnection-details",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_APPLICATION_DETAILS_HEADER")}` : t("WS_APPLICATION_DETAILS_HEADER"),
      show: location.pathname.includes("/disconnection-details") ? true : false,
      isBack: fromScreen && true,
    },
    {
      path: "/digit-ui/employee/ws/connection-details",
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_COMMON_CONNECTION_DETAIL")}` : t("WS_COMMON_CONNECTION_DETAIL"),
      show: location.pathname.includes("/connection-details") ? true : false,
      isBack: fromScreen && true,
    },
    {
      path: "/digit-ui/employee/ws/edit-application",
      content: `${t("WS_APPLICATION_DETAILS_HEADER")} / ${t("WS_APP_FOR_WATER_AND_SEWERAGE_EDIT_LABEL")}`,
      show: location.pathname.includes("/edit-application") ? true : false,
      isBack: true,
    },
    {
      path: `${location?.pathname}${location.search}`,
      content: `${t("WS_APPLICATION_DETAILS_HEADER")} / ${t("WF_EMPLOYEE_NEWSW1_ACTIVATE_CONNECTION")}`,
      show: location.pathname.includes("/activate-connection") ? true : false,
      isBack: true,
    },
    {
      path: `${location?.pathname}${location.search}`,
      content: `${t("WS_APPLICATION_DETAILS_HEADER")} / ${t("WS_WATER_SEWERAGE_DISCONNECTION_EDIT_LABEL")}`,
      show: location.pathname.includes("edit-disconnection-application") ? true : false,
      isBack: true,
    },
    {
      path: `${location?.pathname}${location.search}`,
      content: `${t("WS_APPLICATION_DETAILS_HEADER")} / ${t("WS_WATER_SEWERAGE_DISCONNECTION_EDIT_LABEL")}`,
      show: location.pathname.includes("config-by-disconnection-application") ? true : false,
      isBack: true,
    },
    {
      path: `${location?.pathname}${location.search}`,
      content: `${t("WS_APPLICATION_DETAILS_HEADER")} / ${t("WS_WATER_SEWERAGE_DISCONNECTION_EDIT_LABEL")}`,
      show: location.pathname.includes("resubmit-disconnection-application") ? true : false,
      isBack: true,
    },
    {
      path: `/digit-ui/employee/ws/new-disconnection/docsrequired`,
      content: t("WS_NEW_DISCONNECTION_DOCS_REQUIRED"),
      show: location.pathname.includes("/new-disconnection/docsrequired") ? true : false,
    },
    {
      path: `/digit-ui/employee/ws/new-disconnection/application-form`,
      content: `${t("WS_NEW_DISCONNECTION_DOCS_REQUIRED")} / ${t("WS_NEW_DISCONNECTION_APPLICATION")}`,
      show: location.pathname.includes("/new-disconnection/application-form") ? true : false,
      isBack: true
    },
    {
      path: `${location?.pathname}${location.search}`,
      content: `${t("WS_NEW_DISCONNECTION_RESPONSE")}`,
      show: location.pathname.includes("/ws-disconnection-response") ? true : false,
      isBack: true
    },
    {
      path: "/digit-ui/employee/sewerage/bill-amendment/inbox",
      content: t("ES_COMMON_BILLS_SEWERAGE_INBOX_LABEL"),
      show: location.pathname.includes("/sewerage/bill-amendment/inbox") ? true : false,
    },
    {
      path: `${location?.pathname}${location.search}`,
      content: fromScreen ? `${t(fromScreen)} / ${t("WS_MODIFY_CONNECTION_BUTTON")}`:t("WS_MODIFY_CONNECTION_BUTTON"),
      show: location.pathname.includes("ws/modify-application") ? true : false,
      isBack:true,
    },
    {
      path: "/digit-ui/employee/ws/required-documents",
      content: t("ES_COMMON_WS_DOCUMENTS_REQUIRED"),
      show: location.pathname.includes("/required-documents") ? true : false,
    },
    {
      path: "/digit-ui/employee/ws/bill-amendment",
      content: t("WS_BILL_AMEND_APP"),
      show: location.pathname.includes("ws/bill-amendment") && !IsEdit ? true : false,
    },
    {
      path: "/digit-ui/employee/ws/bill-amendment",
      content: t("WS_BILL_AMEND_EDIT_APP"),
      show: location.pathname.includes("ws/bill-amendment") && IsEdit ? true : false,
    },
    {
      path: "/digit-ui/employee/ws/response",
      content: t("WS_ACK_SCREEN"),
      show: location.pathname.includes("/employee/ws/response") ? true : false,
    }
  ];

  return <div style={window?.location.href.includes("/employee/ws/bill-amendment") || window?.location.href.includes("/employee/ws/response")? {marginLeft:"20px"} : {}}><BreadCrumb crumbs={crumbs}  spanStyle={{ maxWidth: "min-content"}} /></div>;
};
const App = ({ path }) => {
  const location = useLocation();

  const WSDocsRequired = Digit?.ComponentRegistryService?.getComponent("WSDocsRequired");
  const WSInbox = Digit?.ComponentRegistryService?.getComponent("WSInbox");
  const WSDisconnectionDocsRequired = Digit?.ComponentRegistryService?.getComponent('WSDisconnectionDocsRequired');
  
  // const locationCheck = window.location.href.includes("/employee/ws/new-application") || window.location.href.includes("/employee/ws/create-application");

  const locationCheck = 
  window.location.href.includes("/employee/ws/new-application") || 
  window.location.href.includes("/employee/ws/modify-application") ||
  window.location.href.includes("/employee/ws/edit-application") ||
  window.location.href.includes("/employee/ws/activate-connection") ||
  window.location.href.includes("/employee/ws/application-details") ||
  window.location.href.includes("/employee/ws/modify-details") || 
  window.location.href.includes("/employee/ws/ws-response") ||
  window.location.href.includes("/employee/ws/new-disconnection/application-form") ||
  window.location.href.includes("/employee/ws/ws-disconnection-response") ||
  window.location.href.includes("/employee/ws/consumption-details") || 
  window.location.href.includes("/employee/ws/edit-disconnection-application") ||
  window.location.href.includes("/employee/ws/config-by-disconnection-application");
  window.location.href.includes("/employee/ws/resubmit-disconnection-application");
  
  


  const locationCheckReqDocs = window.location.href.includes("/employee/ws/create-application") || window.location.href.includes("/employee/ws/new-disconnection/docsrequired");

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <div style={locationCheck ? { marginLeft: "12px" } : (locationCheckReqDocs?{marginLeft:"25px"}:{ marginLeft: "-4px" })}>
            <BILLSBreadCrumbs location={location} />
          </div>

          <PrivateRoute path={`${path}/create-application`} component={WSDocsRequired} />
          <PrivateRoute path={`${path}/new-application`} component={NewApplication} />
          <PrivateRoute path={`${path}/edit-application`} component={EditApplication} />
          <PrivateRoute path={`${path}/edit-disconnection-application`} component={EditDisconnectionApplication} />
          <PrivateRoute path={`${path}/resubmit-disconnection-application`} component={ResubmitDisconnection} />
          <PrivateRoute path={`${path}/config-by-disconnection-application`} component={EditDisconnectionByConfig} />
          <PrivateRoute path={`${path}/application-details`} component={ApplicationDetails} />
          <PrivateRoute path={`${path}/modify-details`} component={ModifyApplicationDetails} />
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
          <PrivateRoute path={`${path}/ws-disconnection-response`} component={WSDisconnectionResponse} />
          <PrivateRoute path={`${path}/water/search-connection`} component={(props) => <SearchWater {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/sewerage/search-connection`} component={(props) => <SearchWater {...props} parentRoute={path} />} />

          <PrivateRoute path={`${path}/consumption-details`} component={ConsumptionDetails} />
          <PrivateRoute path={`${path}/modify-application`} component={ModifyApplication} />
          <PrivateRoute path={`${path}/modify-application-edit`} component={EditModifyApplication} />
          <PrivateRoute path={`${path}/disconnection-application`} component={WSDisconnectionDocsRequired} />
          <PrivateRoute path={`${path}/new-disconnection`} component={DisconnectionApplication} />
          <PrivateRoute path={`${path}/bill-amend/inbox`} component={(props) => <BillIAmendMentInbox {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/water/inbox`} component={(props) => <WSInbox {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/sewerage/inbox`} component={(props) => <WSInbox {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/edit-application-by-config`} component={WSEditApplicationByConfig} />
          <PrivateRoute path={`${path}/disconnection-details`} component={GetDisconnectionDetails} />
          <PrivateRoute path={`${path}/water/bill-amendment/inbox`} component={(props) => <BillIAmendMentInbox {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/sewerage/bill-amendment/inbox`} component={(props) => <BillIAmendMentInbox {...props} parentRoute={path} />} />

          {/* <Route path={`${path}/search`} component={SearchConnectionComponent} />
          <Route path={`${path}/search-results`} component={SearchResultsComponent} /> */}
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default App;
