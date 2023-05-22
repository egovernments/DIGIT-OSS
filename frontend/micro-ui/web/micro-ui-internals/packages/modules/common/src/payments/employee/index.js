import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
import { useRouteMatch, Switch, Route, Link } from "react-router-dom";
import { CollectPayment } from "./payment-collect";
import { SuccessfulPayment, FailedPayment } from "./response";
// import { SubformComposer } from "../../hoc";
// import { subFormRegistry } from "../../hoc/subFormClass";
import { testForm } from "../../hoc/testForm-config";
import { subFormRegistry } from "@egovernments/digit-ui-libraries";
import { useTranslation } from "react-i18next";
import IFrameInterface from "./IFrameInterface";

subFormRegistry.addSubForm("testForm", testForm);

const EmployeePayment = ({ stateCode, cityCode, moduleCode }) => {
  const userType = "employee";
  const { path: currentPath } = useRouteMatch();

  const { t } = useTranslation();

  const [link, setLink] = useState(null);

  const commonProps = { stateCode, cityCode, moduleCode, setLink };

  const isFsm = location?.pathname?.includes("fsm") || location?.pathname?.includes("FSM");

  return (
    <React.Fragment>
      <p className="breadcrumb" style={{ marginLeft: "15px" }}>
        <Link to={`/${window?.contextPath}/employee`}>{t("ES_COMMON_HOME")}</Link>
        {isFsm ? <Link to={`/${window?.contextPath}/employee/fsm/home`}>/ {t("ES_TITLE_FSM")} </Link> : null}
        {isFsm ? <Link to={`/${window?.contextPath}/employee/fsm/inbox`}>/ {t("ES_TITLE_INBOX")}</Link> : null}/ {link}
      </p>
      <Switch>
        <Route path={`${currentPath}/collect/:businessService/:consumerCode`}>
          <CollectPayment {...commonProps} basePath={currentPath} />
        </Route>
        <Route path={`${currentPath}/success/:businessService/:receiptNumber/:consumerCode`}>
          <SuccessfulPayment {...commonProps} />
        </Route>
        <Route path={`${currentPath}/integration/:moduleName/:pageName`}>
          <IFrameInterface {...commonProps} />
        </Route>
        <Route path={`${currentPath}/failure`}>
          <FailedPayment {...commonProps} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};

export default EmployeePayment;
