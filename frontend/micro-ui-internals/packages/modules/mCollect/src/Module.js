import { Header, HomeLink, Loader, CitizenHomeCard, PTIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import EmployeeApp from "./pages/employee";
import MCollectCard from "./components/MCollectCard";
import InboxFilter from "./components/inbox/NewInboxFilter";
import CitizenApp from "./pages/citizen";

export const MCollectModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "UC";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  Digit.SessionStorage.set("MCollect_TENANTS", tenants);
  if (isLoading) {
    return <Loader />;
  }
  const { path, url } = useRouteMatch();

  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} userType={userType} />;
  } else return <CitizenApp />;
};

export const MCollectLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("PT_CREATE_PROPERTY112", {});

  useEffect(() => {
    clearParams();
  }, []);

  const links = [
    {
      link: `${matchPath}/search`,
      i18nKey: t("UC_SEARCH_AND_PAY"),
    },
    {
      link: `${matchPath}/My-Challans`,
      i18nKey: t("UC_MY_CHALLANS"),
    },
  ];

  return <CitizenHomeCard header={t("ACTION_TEST_MCOLLECT")} links={links} Icon={() => <PTIcon className="fill-path-primary-main" />} />;
};

const componentsToRegister = {
  MCollectCard,
  MCollectModule,
  MCollectLinks,
  MCOLLECT_INBOX_FILTER: (props) => <InboxFilter {...props} />,
};

export const initMCollectComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
