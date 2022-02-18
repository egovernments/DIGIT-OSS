import { Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import EmployeeApp from "./pages/employee";
import ApplicationOverview from "./pages/employee/ApplicationOverview";
import NOCCard from "./pages/employee/EmployeeCard";
import Inbox from "./pages/employee/Inbox";
import NOCSearchApplication from "./pages/employee/SearchApplication/Search";

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
    return <div></div>;
  }

  return <EmployeeApp path={path} stateCode={stateCode} />;
};

const componentsToRegister = {
  NOCModule,
  NOCCard,
  NOCApplicationOverview: ApplicationOverview,
  NOCInbox: Inbox,
  NOCSearchApplication
};

export const initNOCComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
