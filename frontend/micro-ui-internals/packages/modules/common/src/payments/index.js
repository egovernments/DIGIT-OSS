import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, useRouteMatch, Route } from "react-router-dom";
import { Body, Header, HomeLink, Loader } from "@egovernments/digit-ui-react-components";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import EmployeePayment from "./employee";
import CitizenPayment from "./citizen";
import { getKeyNotesConfig } from "./citizen/keynotesConfig";

export const PaymentModule = ({ deltaConfig = {}, stateCode, cityCode, moduleCode = "Payment", userType }) => {
  const { path, url } = useRouteMatch();
  const state = useSelector((state) => state);
  const language = state?.common?.selectedLanguage;
  const store = { data: {} }; //Digit.Services.useStore({}, { deltaConfig, stateCode, cityCode, moduleCode, language });

  if (Object.keys(store).length === 0) {
    return <Loader />;
  }

  const getPaymentHome = () => {
    if (userType === "citizen") return <CitizenPayment {...{ stateCode, moduleCode, cityCode, path, url }} />;
    else return <EmployeePayment {...{ stateCode, cityCode, moduleCode }} />;
  };
  return <React.Fragment>{getPaymentHome()}</React.Fragment>;
};

export const PaymentLinks = ({ matchPath }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {/* TODO: change */}
      <div>
        <Header>{t("CS_HOME_QUICK_PAY")}</Header>
        <div className="d-grid">
          <HomeLink to={`/digit-ui/citizen/payment/my-bills/PT`}>{t("CS_HOME_PT")}</HomeLink>
          {/* <HomeLink to={`${matchPath}/tl-renewal`}>{t("CS_HOME_TRADE_LICENCE_RENEWAL")}</HomeLink>
          <HomeLink to={`${matchPath}/water-bill`}>{t("CS_HOME_WATER_BILL")}</HomeLink> */}
        </div>
      </div>
    </React.Fragment>
  );
};

export const paymentConfigs = {
  getBillDetailsConfigWithBusinessService: getKeyNotesConfig,
};
