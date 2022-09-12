import React from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { Loader, CitizenHomeCard, WSICon } from "@egovernments/digit-ui-react-components";
import CitizenApp from "./pages/citizen";
import EmployeeApp from "./pages/employee";
import Search from "./pages/employee/search";
import WSServiceName from "./pageComponents/WSServiceName";
import WSWaterConnectionDetails from "./pageComponents/WSWaterConnectionDetails";
import WSDocsRequired from "./pageComponents/WSDocsRequired";
import WSDocumentDetails from "./pageComponents/WSDocumentDetails";
import WSSewerageConnectionDetails from "./pageComponents/WSSewerageConnectionDetails";
import WSPlumberPreference from "./pageComponents/WSPlumberPreference";
import WSConnectionHolder from "./pageComponents/WSConnectionHolder";
import WSCheckPage from "./pages/citizen/WSCreate/CheckPage";
import WSInfoLabel from "./pageComponents/WSInfoLabel";
import WSActivationDetails from "./pageComponents/WSActivationDetails";
import WSConnectionDetails from "./pageComponents/WSConnectionDetails";
import WSDocumentsRequired from "./pageComponents/WSDocumentsRequired";
import WSPlumberDetails from "./pageComponents/WSPlumberDetails";
import WSRoadCuttingDetails from "./pageComponents/WSRoadCuttingDetails";
import WSPropertyDetails from "./pageComponents/WSPropertyDetails";
import WSConnectionHolderDetails from "./pageComponents/WSConnectionHolderDetails";
import EditApplication from "./pages/citizen/EditApplication";

import SearchApplication from "./components/SearchApplication";
import SearchWaterConnection from "./components/SearchWaterConnection";
import WSCard from "./components/WSCard";
import SWCard from "./components/SWCard";
import MyConnections from "./pages/citizen/MyConnection";
import ConnectionDetails from "./pages/citizen/MyConnection/ConnectionDetails";

import WSActivationConnectionDetails from "./pageComponents/WSActivationConnectionDetails";
import WSActivationPlumberDetails from "./pageComponents/WSActivationPlumberDetails";
import WSActivationPageDetails from "./pageComponents/WSActivationPageDetails";
import WSActivationCommentsDetails from "./pageComponents/WSActivationCommentsDetails";
import WSActivationSupportingDocuments from "./pageComponents/WSActivationSupportingDocuments";
import WSDocumentsEmployee from "./pageComponents/WSDocumentsEmployee";
import WSAcknowledgement from "./pages/citizen/WSCreate/WSAcknowledgement";
import WSPayments from "./pages/citizen/MyPayment/WSPayments";
import WSEditConnectionDetails from"./pageComponents/WSEditConnectionDetails";
import ConsumptionDetails from "./pages/employee/connectionDetails/ConsumptionDetails";
import WSDisconnectionDocsRequired from "./pageComponents/WSDisconnectionDocsRequired";
import WSDisconnectionForm from "./pageComponents/WSDisconnectionForm";
import WSDisconnectionDocumentsForm from "./pageComponents/WSDisconnectionDocumentsForm";
import WSDisconnectionCheckPage from "./pages/citizen/WSDisconnection/CheckPage";
import WSDisconnectAcknowledgement from "./pageComponents/WSDisconnectAcknowledgement";
import WSDisconnectionAppDetails from "./pageComponents/WSDisconnectionAppDetails";
import WSInbox from "./components/WSInbox";
import WSEditApplicationByConfig from './pages/employee/EditApplication/WSEditApplicationByConfig';

import BillAmendmentCard from "./components/BillAmendmentCard";

const WSModule = ({ stateCode, userType, tenants }) => {
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();
  const moduleCode = ["ws", "pt", "common", tenantId];
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
  WSDocsRequired,
  WSDocumentDetails,
  WSServiceName,
  WSWaterConnectionDetails,
  WSSewerageConnectionDetails,
  WSPlumberPreference,
  WSConnectionHolder,
  WSCheckPage,
  WSInfoLabel,
  WSActivationDetails,
  WSConnectionDetails,
  WSDocumentsRequired,
  WSPlumberDetails,
  WSRoadCuttingDetails,
  WSPropertyDetails,
  WSConnectionHolderDetails,
  WSSearch: Search,
  WSSearchApplication: SearchApplication,
  MyConnections,
  ConnectionDetails,
  WSActivationConnectionDetails,
  WSActivationPlumberDetails,
  WSActivationPageDetails,
  WSActivationCommentsDetails,
  WSActivationSupportingDocuments,
  WSCard,
  WSDocumentsEmployee,
  WSSearchWaterConnection: SearchWaterConnection,
  WSAcknowledgement,
  WSPayments,
  WSEditConnectionDetails,
  ConsumptionDetails,
  EditApplication,
  WSDisconnectionDocsRequired,
  WSInbox,
  WSEditApplicationByConfig,
  SWCard,
  WSDisconnectionForm,
  WSDisconnectionDocumentsForm,
  WSDisconnectionCheckPage,
  WSDisconnectAcknowledgement,
  BillAmendmentCard,
  WSDisconnectionAppDetails
};

export const initWSComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
