import { CitizenHomeCard, PTIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";

import CitizenApp from "./pages/citizen";
import EmployeeApp from "./pages/employee";

import CPTPropertyAssemblyDetails from "./pages/components/PropertyAssemblyDetails";
import CPTPropertyLocationDetails from "./pages/components/PropertyLocationDetails";
import CPTPropertyOwnerDetails from "./pages/components/PropertyOwnerDetails";
import CPTSearchProperty from "./pages/citizen/SearchProperty";
import CPTPropertySearchForm from "./components/search/CPTPropertySearchForm";
import CPTPropertySearchResults from "./components/search/CPTPropertySearchResults";
import CPTKnowYourProperty from "./pages/pageComponents/KnowYourProperty";
import CPTPropertyDetails from "./pages/pageComponents/PropertyDetails";
import CPTPropertySearchNSummary from "./pages/pageComponents/PropertySearchNSummary";
import CPTSearchResults from "./pages/citizen/SearchResults";
import CPTCreateProperty from "./pages/pageComponents/createForm";
import CPTAcknowledgement from "./pages/pageComponents/PTAcknowledgement";
import CommonPTCard from "./components/CommonPTCard";

const componentsToRegister = {
  CPTPropertySearchForm,
  CPTPropertySearchResults,
  CPTSearchProperty,
  CPTPropertyAssemblyDetails,
  CPTPropertyLocationDetails,
  CPTPropertyOwnerDetails,
  CPTKnowYourProperty,
  CPTPropertyDetails,
  CPTPropertySearchNSummary,
  CPTSearchResults,
  CPTCreateProperty,
  CPTAcknowledgement,
};

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

/* 
  CommonPTCardTemp name should be updated without temp keyword to see a card in employee home screen
  CommonPTLinksTemp name should be updated without temp keyword to see a card in citizen home screen
*/
export const CommonPTComponents = {
  CommonPTCardTemp: CommonPTCard,
  CommonPTModule,
  CommonPTLinksTemp: CommonPTLinks,
  ...componentsToRegister,
};

export const initCommonPTComponents = () => {
  Object.entries(CommonPTComponents).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
