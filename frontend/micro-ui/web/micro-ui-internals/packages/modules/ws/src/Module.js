import React from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { Loader, CitizenHomeCard, WSICon, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";
import CitizenApp from "./pages/citizen";


const WSModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "ws";
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  Digit.SessionStorage.set("OBPS_TENANTS", tenants);

  if (isLoading) {
    return <Loader />;
  }

  if (userType === "citizen") {
    return <CitizenApp path={path} stateCode={stateCode} />;
  }

  // return <EmployeeApp path={path} stateCode={stateCode} />
}

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
      link: ``,
      i18nKey: t("ACTION_TEST_APPLY_NEW_CONNECTION"),
    },
  ];

  return <CitizenHomeCard header={t("ACTION_TEST_WATER_AND_SEWERAGE")} links={links} Icon={() => <WSICon />} />

}

const componentsToRegister = {
  WSModule,
  WSLinks
}

export const initWSComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};