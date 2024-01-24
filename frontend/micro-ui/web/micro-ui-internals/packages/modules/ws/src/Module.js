import React from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { Loader, CitizenHomeCard, WSICon } from "@egovernments/digit-ui-react-components";
import CitizenApp from "./pages/citizen";
import EmployeeApp from "./pages/employee";


//Page Components
import WSServiceName from "./pageComponents/WSServiceName";
import WSWaterConnectionDetails from "./pageComponents/WSWaterConnectionDetails";
import WSDocsRequired from "./pageComponents/WSDocsRequired";
import WSDocumentDetails from "./pageComponents/WSDocumentDetails";
import WSSewerageConnectionDetails from "./pageComponents/WSSewerageConnectionDetails";
import WSPlumberPreference from "./pageComponents/WSPlumberPreference";
import WSConnectionHolder from "./pageComponents/WSConnectionHolder";
import WSInfoLabel from "./pageComponents/WSInfoLabel";
import WSActivationDetails from "./pageComponents/WSActivationDetails";
import WSConnectionDetails from "./pageComponents/WSConnectionDetails";
import WSDocumentsRequired from "./pageComponents/WSDocumentsRequired";
import WSPlumberDetails from "./pageComponents/WSPlumberDetails";
import WSRoadCuttingDetails from "./pageComponents/WSRoadCuttingDetails";
import WSPropertyDetails from "./pageComponents/WSPropertyDetails";
import WSConnectionHolderDetails from "./pageComponents/WSConnectionHolderDetails";
import WSActivationConnectionDetails from "./pageComponents/WSActivationConnectionDetails";
import WSActivationPlumberDetails from "./pageComponents/WSActivationPlumberDetails";
import WSActivationPageDetails from "./pageComponents/WSActivationPageDetails";
import WSActivationCommentsDetails from "./pageComponents/WSActivationCommentsDetails";
import WSActivationSupportingDocuments from "./pageComponents/WSActivationSupportingDocuments";
import WSDocumentsEmployee from "./pageComponents/WSDocumentsEmployee";
import WSEditConnectionDetails from"./pageComponents/WSEditConnectionDetails";
import WSDisconnectionDocsRequired from "./pageComponents/WSDisconnectionDocsRequired";
import WSDisconnectionForm from "./pageComponents/WSDisconnectionForm";
import WSDisconnectionDocumentsForm from "./pageComponents/WSDisconnectionDocumentsForm";
import WSDisconnectAcknowledgement from "./pageComponents/WSDisconnectAcknowledgement";
import WSDisconnectionAppDetails from "./pageComponents/WSDisconnectionAppDetails";

//Components
import WSInbox from "./components/WSInbox";
import BillAmendmentCard from "./components/BillAmendmentCard";
import SearchApplication from "./components/SearchApplication";
import SearchWaterConnection from "./components/SearchWaterConnection";
import WSCard from "./components/WSCard";
import SWCard from "./components/SWCard";
import BillIAmendMentInbox from "./components/BillIAmendMentInbox";

//Citizen Components
import WSCreate from "./pages/citizen/WSCreate";
import WSDisconnection from "./pages/citizen/WSDisconnection";
import SearchConnectionComponent from "./pages/citizen/SearchConnection";
import SearchResultsComponent from "./pages/citizen/SearchResults";
import WSCitizenApplicationDetails from "./pages/citizen/WSApplicationDetails";
import WSAdditionalDetails from "./pages/citizen/WSMyApplications/additionalDetails";
import WSCitizenConnectionDetails from "./pages/citizen/MyConnection/ConnectionDetails";
import WSCitizenConsumptionDetails from "./pages/citizen/MyConnection/ConsumptionDetails";
import WSMyPayments from "./pages/citizen/MyPayment";
import WSCitizenEditApplication from "./pages/citizen/EditApplication";
import WSReSubmitDisconnectionApplication from "./pages/citizen/ReSubmitDisconnection";
import WSCheckPage from "./pages/citizen/WSCreate/CheckPage";
import WSMyConnections from "./pages/citizen/MyConnection";
import WSAcknowledgement from "./pages/citizen/WSCreate/WSAcknowledgement";
import WSDisconnectionCheckPage from "./pages/citizen/WSDisconnection/CheckPage";
import WSReSubmitDisconnectionCheckPage from "./pages/citizen/ReSubmitDisconnection/CheckPage"
import WNSMyBillsComponent from "./pages/citizen/WnSMyBills";

//Employee Components
import ApplicationBillAmendment from "./pages/employee/ApplicationBillAmendment";
import RequiredDocuments from "./pages/employee/RequiredDocuments";
import NewApplication from "./pages/employee/NewApplication" ;
import ApplicationDetails from "./pages/employee/ApplicationDetails";
import GetConnectionDetails from "./pages/employee/connectionDetails/connectionDetails";
import ActivateConnection from "./pages/employee/ActivateConnection";
import ApplicationDetailsBillAmendment from "./pages/employee/ApplicationDetailsBillAmendment";
import Search from "./pages/employee/search";
import SearchWater from "./pages/employee/SearchWater";
import WSEditApplication from "./pages/employee/EditApplication";
import ConsumptionDetails from "./pages/employee/connectionDetails/ConsumptionDetails";
import ModifyApplication from "./pages/employee/ModifyApplication";
import EditModifyApplication from "./pages/employee/EditModifyApplication";
import DisconnectionApplication from "./pages/employee/DisconnectionApplication";
import WSEditApplicationByConfig from './pages/employee/EditApplication/WSEditApplicationByConfig';
import GetDisconnectionDetails from "./pages/employee/DisconnectionDetails";
import ModifyApplicationDetails from "./pages/employee/ModifyApplicationDetails";
import EditDisconnectionApplication from "./pages/employee/EditDisconnectionApplication";
import EditDisconnectionByConfig from "./pages/employee/EditDisconnectionApplication/EditDisconnectionByConfig";
import ResubmitDisconnection from "./pages/employee/EditDisconnectionApplication/ResubmitDisconnection";



const WSModule = ({ stateCode, userType, tenants }) => {
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();
  const moduleCode = ["ws", "pt", "common", tenantId, "bill-amend","abg"];
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  Digit.SessionStorage.set("WS_TENANTS", tenants);
  Digit.SessionStorage.set("PT_TENANTS", tenants);

  if (isLoading) {
    return <Loader />;
  }

  if (userType === "citizen") {
    return <CitizenApp path={path} stateCode={stateCode} />;
  }

  return <EmployeeApp path={path} stateCode={stateCode} />;
};

const WSLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();

  const links = [
    {
      link: `${matchPath}/my-bills`,
      i18nKey: t("ACTION_TEST_WNS_MY_BILLS"),
    },
    {
      link: `${matchPath}/my-payments`,
      i18nKey: t("ACTION_TEST_MY_PAYMENTS"),
    },
    {
      link: `${matchPath}/create-application`,
      i18nKey: t("ACTION_TEST_APPLY_NEW_CONNECTION"),
    },
    {
      link: `${matchPath}/search`,
      i18nKey: t("ACTION_TEXT_WS_SEARCH_AND_PAY"),
    },
    {
      link: `${matchPath}/my-applications`,
      i18nKey: t("ACTION_TEXT_WS_MY_APPLICATION"),
    },
    {
      link: `${matchPath}/my-connections`,
      i18nKey: t("ACTION_TEXT_WS_MY_CONNECTION"),
    },
  ];

  return <CitizenHomeCard header={t("ACTION_TEST_WATER_AND_SEWERAGE")} links={links} Icon={() => <WSICon />} />;
};

const componentsToRegister = {
  WSModule,
  WSLinks,

  // PageComponents
  WSServiceName,
  WSWaterConnectionDetails,
  WSDocsRequired,
  WSDocumentDetails,
  WSSewerageConnectionDetails,
  WSPlumberPreference,
  WSConnectionHolder,
  WSInfoLabel,
  WSActivationDetails,
  WSConnectionDetails,
  WSDocumentsRequired,
  WSPlumberDetails,
  WSRoadCuttingDetails,
  WSPropertyDetails,
  WSConnectionHolderDetails,
  WSActivationConnectionDetails,
  WSActivationPlumberDetails,
  WSActivationPageDetails,
  WSActivationCommentsDetails,
  WSActivationSupportingDocuments,
  WSDocumentsEmployee,
  WSEditConnectionDetails,
  WSDisconnectionDocsRequired,
  WSDisconnectionForm,
  WSDisconnectionDocumentsForm,
  WSDisconnectAcknowledgement,
  WSDisconnectionAppDetails,

  //Components
  WSInbox,
  BillAmendmentCard,
  WSSearchApplication: SearchApplication,
  WSSearchWaterConnection: SearchWaterConnection,
  WSCard,
  SWCard,
  WSBillIAmendMentInbox: BillIAmendMentInbox,

  //Citizen Components
  WSCreate: WSCreate,
  WSDisconnection: WSDisconnection,
  WSSearchConnectionComponent: SearchConnectionComponent,
  WSSearchResultsComponent: SearchResultsComponent,
  WSCitizenApplicationDetails: WSCitizenApplicationDetails,
  WSAdditionalDetails: WSAdditionalDetails,
  WSMyConnections: WSMyConnections,
  WSCitizenConnectionDetails: WSCitizenConnectionDetails,
  WSCitizenConsumptionDetails: WSCitizenConsumptionDetails,
  WSMyPayments: WSMyPayments,
  WSCitizenEditApplication: WSCitizenEditApplication,
  WSReSubmitDisconnectionApplication: WSReSubmitDisconnectionApplication,
  WNSMyBillsComponent: WNSMyBillsComponent,
  WSCheckPage,
  WSAcknowledgement,
  WSDisconnectionCheckPage,
  WSReSubmitDisconnectionCheckPage,

  //Employee Components
  WSApplicationBillAmendment: ApplicationBillAmendment,
  WSRequiredDocuments: RequiredDocuments,
  WSNewApplication: NewApplication,
  WSApplicationDetails: ApplicationDetails,
  WSGetConnectionDetails: GetConnectionDetails,
  WSActivateConnection: ActivateConnection,
  WSApplicationDetailsBillAmendment: ApplicationDetailsBillAmendment,
  WSSearch: Search,
  WSSearchWater: SearchWater,
  WSEditApplication: WSEditApplication,
  WSConsumptionDetails: ConsumptionDetails,
  WSModifyApplication: ModifyApplication,
  WSEditModifyApplication: EditModifyApplication,
  WSDisconnectionApplication: DisconnectionApplication,
  WSEditApplicationByConfig: WSEditApplicationByConfig,
  WSGetDisconnectionDetails: GetDisconnectionDetails,
  WSModifyApplicationDetails: ModifyApplicationDetails,
  WSEditDisconnectionApplication: EditDisconnectionApplication,
  WSEditDisconnectionByConfig: EditDisconnectionByConfig,
  WSResubmitDisconnection: ResubmitDisconnection
};

export const initWSComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
