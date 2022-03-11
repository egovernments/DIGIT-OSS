import React from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { Loader, CitizenHomeCard, WSICon } from "@egovernments/digit-ui-react-components";
import CitizenApp from "./pages/citizen";
import EmployeeApp from "./pages/employee";

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

const WSModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "ws";
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  Digit.SessionStorage.set("WS_TENANTS", tenants);

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
      link: ``,
      i18nKey: t("ACTION_TEST_WATER_AND_SEWERAGE_BILL"),
    },
    {
      link: ``,
      i18nKey: t("ACTION_TEST_MY_CONNECTIONS"),
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
      link: `${matchPath}/my-application`,
      i18nKey: t("ACTION_TEXT_WS_MY_APPLICATION"),
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
};

export const initWSComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
