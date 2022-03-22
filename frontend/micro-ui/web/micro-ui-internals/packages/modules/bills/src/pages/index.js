import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route } from "react-router-dom";
import { Link, Switch, useLocation } from "react-router-dom";
import GroupBillInbox from "./GroupBill";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const BillInbox = Digit.ComponentRegistryService.getComponent("BillInbox");

  const inboxInitialState = {
    searchParams: {},
  };
  const { isLoading, data: generateServiceType } = Digit.Hooks.useCommonMDMS(tenantId, "BillingService", "BillsGenieKey");

  const filterServiceType = generateServiceType?.BillingService?.BusinessService?.filter((element) => element.billGineiURL);

  let businessServiceList = [];

  filterServiceType?.forEach((element) => {
    businessServiceList.push(element.code);
  });

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
            <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
              {t("ES_COMMON_HOME")}
            </Link>{" "}
            / <span>{location.pathname === "/digit-ui/employee/bills/inbox" ? t("CR_COMMON_HEADER") : t("CR_COMMON_HEADER")}</span>
          </p>
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => <BillInbox parentRoute={path} filterComponent="BILLS_INBOX_FILTER" initialStates={inboxInitialState} isInbox={true} />}
          />
          <PrivateRoute
            path={`${path}/gb`}
            component={() => <GroupBillInbox parentRoute={path} filterComponent="BILLS_GROUP_FILTER" initialStates={{}} isInbox={true} />}
          />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
