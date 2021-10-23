import React from "react";
import { useRouteMatch } from "react-router-dom";
import { Loader, CitizenHomeCard, OBPSIcon } from "@egovernments/digit-ui-react-components";
import EmployeeApp from "./pages/employee";
import NOCEmployeeHomeCard from "./pages/employee/EmployeeCard";

const NOCModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "common-noc";
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  Digit.SessionStorage.set("NOC_TENANTS", tenants);

  if (isLoading) {
    return <Loader />;
  }

  if (userType === "citizen") {
    return <CitizenApp path={path} stateCode={stateCode} />;
  }

  return <EmployeeApp path={path} stateCode={stateCode} />
}

const componentsToRegister = {
  NOCModule,
  NOCCard:NOCEmployeeHomeCard
}

export const initNOCComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};