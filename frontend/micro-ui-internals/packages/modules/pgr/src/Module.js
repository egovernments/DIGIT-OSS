import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PGRCard from "./components/PGRCard";

import getRootReducer from "./redux/reducers";
import CitizenApp from "./pages/citizen";

import EmployeeApp from "./EmployeeApp";
import { Header, HomeLink, Loader } from "@egovernments/digit-ui-react-components";
import { PGR_CITIZEN_CREATE_COMPLAINT } from "./constants/Citizen";
import { useTranslation } from "react-i18next";
import { LOCALE } from "./constants/Localization";
export const PGRReducers = getRootReducer;

const PGRModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "PGR";
  const state = useSelector((state) => state["pgr"]);
  const language = state?.common?.selectedLanguage;
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

  return (
    <React.Fragment>
      <div>
        <Header>Complaints</Header>
        <div className="d-grid">
          <HomeLink to={`${matchPath}/create-complaint/complaint-type`}>{t("CS_COMMON_FILE_A_COMPLAINT")}</HomeLink>
          <HomeLink to={`${matchPath}/complaints`}>{t(LOCALE.MY_COMPLAINTS)}</HomeLink>
        </div>
      </div>
    </React.Fragment>
  );
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
