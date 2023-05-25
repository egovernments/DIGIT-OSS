import React, { useEffect } from "react";
import PGRCard from "./components/PGRCard";

import getRootReducer from "./redux/reducers";
import CitizenApp from "./pages/citizen";

import EmployeeApp from "./EmployeeApp";
import { ComplaintIcon, CitizenHomeCard, Loader } from "@egovernments/digit-ui-react-components";
import { PGR_CITIZEN_CREATE_COMPLAINT } from "./constants/Citizen";
import { useTranslation } from "react-i18next";
import { LOCALE } from "./constants/Localization";
export const PGRReducers = getRootReducer;

const PGRModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "PGR";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) {
    return <Loader />;
  }

  Digit.SessionStorage.set("PGR_TENANTS", tenants);

  if (userType === "citizen") {
    return <CitizenApp />;
  } else {
    return <EmployeeApp />;
  }
};

const PGRLinks = ({ matchPath }) => {
  const { t } = useTranslation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage(PGR_CITIZEN_CREATE_COMPLAINT, {});

  useEffect(() => {
    clearParams();
  }, []);

  const links = [
    {
      link: `${matchPath}/create-complaint/complaint-type`,
      i18nKey: t("CS_COMMON_FILE_A_COMPLAINT"),
    },
    {
      link: `${matchPath}/complaints`,
      i18nKey: t(LOCALE.MY_COMPLAINTS),
    },
  ];

  return <CitizenHomeCard header={t("CS_COMMON_HOME_COMPLAINTS")} links={links} Icon={ComplaintIcon} />;
};

const componentsToRegister = {
  PGRModule,
  PGRLinks,
  PGRCard,
};

export const initPGRComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
