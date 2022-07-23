import React, { useEffect } from "react";
import CitizenApp from "./pages/citizen";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import CitizenFeedbackHome from "./pages/citizen/CitizenFeedbackHome";

const CFModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "CF";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  
  if (isLoading) {
    return <Loader />;
  }

  Digit.SessionStorage.set("CF_TENANTS", tenants);

  if (userType === "citizen") {
    return <CitizenApp />;
  }
};

const CFLinks = ({ matchPath }) => {
  const { t } = useTranslation();

  useEffect(() => {
  }, []);

  return <CitizenFeedbackHome />;
};

const componentsToRegister = {
  CFModule,
  CFLinks
};

export const initCFComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export default CFModule