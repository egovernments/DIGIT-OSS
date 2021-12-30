import React, { useEffect } from "react";

// import getRootReducer from "./redux/reducers";
import CitizenApp from "./pages/citizen";

import { ComplaintIcon, CitizenHomeCard, Loader } from "@egovernments/digit-ui-react-components";
// import { PGR_CITIZEN_CREATE_COMPLAINT } from "./constants/Citizen";
import { useTranslation } from "react-i18next";
import CitizenFeedbackHome from "./pages/citizen/CitizenFeedbackHome";
// import { LOCALE } from "./constants/Localization";
// export const PGRReducers = getRootReducer;

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
  } else {
    // return <EmployeeApp />;
  }
};

const CFLinks = ({ matchPath }) => {
  const { t } = useTranslation();
  // const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage(PGR_CITIZEN_CREATE_COMPLAINT, {});

  useEffect(() => {
    // clearParams();
  }, []);

  return <CitizenFeedbackHome header={t("CS_COMMON_HOME_COMPLAINTS")} />;
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