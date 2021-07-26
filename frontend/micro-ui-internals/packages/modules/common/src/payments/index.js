import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, useRouteMatch, Route } from "react-router-dom";
import { Body, Header, Loader, CitizenHomeCard, RupeeIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

import EmployeePayment from "./employee";
import CitizenPayment from "./citizen";
import { getKeyNotesConfig } from "./citizen/keynotesConfig";

export const PaymentModule = ({ deltaConfig = {}, stateCode, cityCode, moduleCode = "Payment", userType }) => {
  const { path, url } = useRouteMatch();
  const store = { data: {} }; //Digit.Services.useStore({}, { deltaConfig, stateCode, cityCode, moduleCode, language });

  if (Object.keys(store).length === 0) {
    return <Loader />;
  }

  const getPaymentHome = () => {
    console.log(userType, "inside ayment index");
    if (userType === "citizen") return <CitizenPayment {...{ stateCode, moduleCode, cityCode, path, url }} />;
    else return <EmployeePayment {...{ stateCode, cityCode, moduleCode }} />;
  };
  return <React.Fragment>{getPaymentHome()}</React.Fragment>;
};

export const PaymentLinks = ({ matchPath }) => {
  const { t } = useTranslation();

  // const links = [
  //   {
  //     link: `/digit-ui/citizen/payment/my-bills/PT`,
  //     i18nKey: t("CS_HOME_PT"),
  //   },
  // ];

  // return <CitizenHomeCard header={t("CS_HOME_QUICK_PAY")} links={links} Icon={RupeeIcon} />;
  return null;
};

export const paymentConfigs = {
  getBillDetailsConfigWithBusinessService: getKeyNotesConfig,
};
