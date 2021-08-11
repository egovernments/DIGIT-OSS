import React from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { Loader, CitizenHomeCard, OBPSIcon } from "@egovernments/digit-ui-react-components";
import CitizenApp from "./pages/citizen";

import BPACitizenHomeScreen from "./pages/citizen/home";
import EDCRForm from "./pageComponents/EDCRForm";


const OBPSModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "bpa";
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) {
    return <Loader />;
  }

  if (userType === "citizen") {
    return <CitizenApp path={path} stateCode={stateCode} />;
  }
}

const OBPSLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();

  const links = [
    {
      link: `${matchPath}/tradelicence/new-application`,
      i18nKey: t("BPA_CITIZEN_HOME_VIEW_APP_BY_CITIZEN_LABEL"),
    },
    {
      link: `${matchPath}/tradelicence/renewal-list`,
      i18nKey: t("BPA_CITIZEN_HOME_REGISTER_ARCHITECT_BUILDER_LABEL"),
    },
    {
      link: `${matchPath}/home`,
      i18nKey: t("BPA_CITIZEN_HOME_ARCHITECT_LOGIN_LABEL"),
    },
  ];

  return <CitizenHomeCard header={t("ACTION_TEST_BUILDING_PLAN_APPROVAL")} links={links} Icon={() => <OBPSIcon />} />;
} 

const componentsToRegister = {
  OBPSModule,
  OBPSLinks,
  BPACitizenHomeScreen,
  EDCRForm
}

export const initOBPSComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};