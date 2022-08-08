import {  CitizenHomeCard, PTIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import CitizenApp from "./pages/citizen";
import Create from "./pages/citizen/create/index";
import EmployeeApp from "./pages/employee";
import BrSelectName from "./pagecomponents/BrSelectName";
import BrSelectHospital from "./pagecomponents/BrSelectHospital";
const componentsToRegister = {
  BrSelectHospital,
  BrSelectName,
  BRCreate : Create,
};

export const BRModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  const moduleCode = "BR";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });



  // Digit.SessionStorage.set("BR_TENANTS", tenants);
  // useEffect(()=>userType === "employee"&&Digit.LocalizationService.getLocale({ 
  //   modules: [`rainmaker-${Digit.ULBService.getCurrentTenantId()}`],
  //    locale: Digit.StoreData.getCurrentLanguage(), 
  //    tenantId: Digit.ULBService.getCurrentTenantId()
  //   }),
  //  []);

  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} userType={userType} />;
  } else return <CitizenApp />;
};

export const BRLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();


  const links = [
  
    {
      link: `${matchPath}/birth`,
      i18nKey: t("Create_BirthRegistration"),
    },

   
  ];

  return <CitizenHomeCard header={t("BirthRegistration")} links={links} Icon={() => <PTIcon className="fill-path-primary-main" />} />;
};

export const initBRComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

