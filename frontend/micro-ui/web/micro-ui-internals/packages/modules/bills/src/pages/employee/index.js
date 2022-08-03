import { PrivateRoute,BreadCrumb } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";
import DownloadBillInbox from "./DownloadBill";

import GroupBillInbox from "./GroupBill/index";

import ResponseCancelBill from "./ResponseCancelBill";
import BillDetailsv1 from "./BillDetailsv1";
import CancelBill from "./CancelBill";
import GroupBill from "./GroupBill";
import DownloadBill from "./DownloadBill";
import SearchApp from "./SearchApp";
const BILLSBreadCrumbs = ({ location }) => {
  const { t } = useTranslation();

  const search = useLocation().search;
  
  const fromScreen = new URLSearchParams(search).get("from") || null;

  const crumbs = [
    {
      path: "/digit-ui/employee",
      content: t("ES_COMMON_HOME"),
      show: true,
    },
    {
      path: "/digit-ui/employee/bills/cancel-bill",
      content: t("ABG_CANCEL_BILL"),
      show: location.pathname.includes("/cancel-bill") ? true : false,
    },
    {
      path: "/digit-ui/employee/bills/bill-details",
      content: fromScreen ? `${t(fromScreen)} / ${t("ABG_BILL_DETAILS_HEADER")}` : t("ABG_BILL_DETAILS_HEADER"),
      show: location.pathname.includes("/bill-details") ? true : false,
      isBack: fromScreen && true,
    },
    {
      path: "/digit-ui/employee/bills/group-bill",
      content: t("ABG_COMMON_HEADER"),
      show: location.pathname.includes("/group-bill") ? true : false,
    },
    {
      path: "/digit-ui/employee/bills/inbox",
      content: t("ABG_SEARCH_BILL_COMMON_HEADER"),
      show: location.pathname.includes("/inbox") ? true : false,
    },
    {
      path: "/digit-ui/employee/bills/download-bill-pdf",
      content: t("ABG_VIEW_DOWNLOADS_HEADER"),
      show: location.pathname.includes("/download-bill-pdf") ? true : false,
    }
    
  ];

  return <BreadCrumb crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};


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
            <BILLSBreadCrumbs location={location} />
          </p>
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => <SearchApp parentRoute={path} filterComponent="BILLS_INBOX_FILTER" initialStates={inboxInitialState} isInbox={true} />}
          />
          <PrivateRoute
            path={`${path}/group-bill`}
            component={() => <GroupBill parentRoute={path} filterComponent="BILLS_INBOX_FILTER" initialStates={inboxInitialState} isInbox={true} />}
          />
          <PrivateRoute
            path={`${path}/group-billold`}
            component={() => (
              <GroupBillInbox
                parentRoute={path}
                filterComponent="BILLS_GROUP_FILTER"
                initialStates={{}}
                isInbox={true}
                keys={generateServiceType?.["common-masters"]?.uiCommonPay}
              />
            )}
          />
          <PrivateRoute
            path={`${path}/download-bill-pdf`}
            component={() => (
              <DownloadBillInbox
                parentRoute={path}
                filterComponent="BILLS_GROUP_FILTER"
                initialStates={{}}
                isInbox={true}
                keys={generateServiceType?.["common-masters"]?.uiCommonPay}
              />
            )}
          />
          <PrivateRoute
            path={`${path}/cancel-bill`}
            component={() => <CancelBill parentRoute={path} filterComponent="BILLS_INBOX_FILTER" initialStates={inboxInitialState} isInbox={true} />}
          />
          <PrivateRoute
            path={`${path}/response-cancelBill`}
            component={() => <ResponseCancelBill parentRoute={path} />}
          />
          <PrivateRoute
            path={`${path}/bill-details`}
            component={() => <BillDetailsv1 parentRoute={path} />}
          />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
