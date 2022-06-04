import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";
import GroupBillInbox from "./GroupBill";
import SearchApp from "./SearchApp";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;
  const tenantId = Digit.ULBService.getCurrentTenantId();


  const inboxInitialState = {
    searchParams: {},
  };

  const { isLoading, data: generateServiceType } = Digit.Hooks.useCommonMDMS(tenantId, "BillingService", "BillsGenieKey");

  const filterServiceType = generateServiceType?.BillingService?.BusinessService?.filter((element) => element.billGineiURL);

  let businessServiceList = [];

  filterServiceType?.forEach((element) => {
    businessServiceList.push(element.code);
  });
  const BillInbox = Digit.ComponentRegistryService.getComponent("BillInbox");

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
            <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
              {t("ES_COMMON_HOME")}
            </Link>{" "}
            /{" "}
            <span>
              {window?.location?.pathname === "/digit-ui/employee/bills/inbox" ? t("ABG_SEARCH_BILL_COMMON_HEADER") : t("ABG_SEARCH_BILL_COMMON_HEADER")}
            </span>
          </p>
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => <BillInbox parentRoute={path} filterComponent="BILLS_INBOX_FILTER" initialStates={inboxInitialState} isInbox={true} />}
          />
          <PrivateRoute
            path={`${path}/group-bill`}
            component={() => <GroupBillInbox parentRoute={path} filterComponent="BILLS_GROUP_FILTER" initialStates={{}} isInbox={true} keys={generateServiceType?.["common-masters"]?.uiCommonPay} />}
          />
          <PrivateRoute
            path={`${path}/search-bill`}
            component={() => <SearchApp parentRoute={path} filterComponent="BILLS_INBOX_FILTER" initialStates={inboxInitialState} isInbox={true} />}
          />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
