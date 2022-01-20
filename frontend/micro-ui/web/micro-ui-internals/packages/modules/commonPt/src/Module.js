import { CitizenHomeCard, PTIcon } from "@egovernments/digit-ui-react-components";
import  React,{ useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import CitizenApp from "./pages/citizen";
import EmployeeApp from "./pages/employee";
import PropertyAssemblyDetails from "./pages/pageComponents/PropertyAssemblyDetails";
import PropertyLocationDetails from "./pages/pageComponents/PropertyLocationDetails";
import PropertyOwnerDetails from "./pages/pageComponents/PropertyOwnerDetails";

import CPTPropertySearchForm from './components/search/CPTPropertySearchForm';
import CPTPropertySearchResults from './components/search/CPTPropertySearchResults';

const componentsToRegister = {
  CPTPropertySearchForm,
  CPTPropertySearchResults,
  PropertyAssemblyDetails,
  PropertyLocationDetails,
  PropertyOwnerDetails,
}

const addComponentsToRegistry = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export const CommonPTModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  const moduleCode = "PT";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  addComponentsToRegistry();

  Digit.SessionStorage.set("PT_TENANTS", tenants);

  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} userType={userType} />;
  } else return <CitizenApp stateCode={stateCode} />;
};

export const CommonPTLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("CPT_CREATE_PROPERTY", {});

  useEffect(() => {
    clearParams();
  }, []);

  const links = [
    {
      link: `${matchPath}/property/citizen-search`,
      i18nKey: t("PT_SEARCH_AND_PAY"),
    },

    {
      link: `${matchPath}/property/new-application`,
      i18nKey: t("PT_CREATE_PROPERTY"),
    },
  ];

  return <CitizenHomeCard header={t("ACTION_TEST_COMMON_PROPERTY_TAX")} links={links} Icon={() => <PTIcon className="fill-path-primary-main" />} />;
};

export const CommonPTComponents = {
  CommonPTModule,
  CommonPTLinks,
};

export const initCommonPTComponents = () => {
  Object.entries(CommonPTComponents).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
