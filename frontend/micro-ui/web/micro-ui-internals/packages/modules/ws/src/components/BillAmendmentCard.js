import { EmployeeModuleCard, WSICon } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const BillAmendmentCard = () => {
  if (!Digit.Utils.wsAccess()) {
    return null;
  }
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [totalCount, setTotalCount] = useState(0);
  sessionStorage.removeItem("Digit.PT_CREATE_EMP_WS_NEW_FORM");
  sessionStorage.removeItem("IsDetailsExists");

  const tableOrderFormDefaultValues = {
    sortBy: "",
    limit: 10,
    offset: 0,
    sortOrder: "DESC",
  };

  const searchFormDefaultValues = {};

  const filterFormDefaultBillAmendmentValues = {
    applicationStatus: [],
    businessService: ["WS.AMENDMENT"],
    moduleName: "bsWs-service",
    locality: [],
    assignee: "ASSIGNED_TO_ALL",
  };
  const formInitBilAmendmentValue = {
    filterForm: filterFormDefaultBillAmendmentValues,
    searchForm: searchFormDefaultValues,
    tableForm: tableOrderFormDefaultValues,
  };

  const formInitBilAmendmentValueSW = {
    filterForm: {...filterFormDefaultBillAmendmentValues,businessService:["SW.AMENDMENT"], moduleName: "bsSw-service"},
    searchForm: searchFormDefaultValues,
    tableForm: tableOrderFormDefaultValues,
  };


  const { isLoading: isBillAMDInboxLoading, data : billData } = Digit.Hooks.useBillAmendmentInbox({
    tenantId,
    filters: { ...formInitBilAmendmentValue },
  });
  const { isLoading: isSWBillAMDInboxLoading, data : swbillData } = Digit.Hooks.useBillAmendmentInbox({
    tenantId,
    filters: { ...formInitBilAmendmentValueSW },
  });


  useEffect(() => {
    if (!isBillAMDInboxLoading || !isSWBillAMDInboxLoading) {
      const billCount = billData?.totalCount && swbillData?.totalCount ? billData?.totalCount + swbillData?.totalCount : (billData?.totalCount?billData?.totalCount:(swbillData?.totalCount?swbillData?.totalCount:0));
      setTotalCount(billCount);
    }
  }, [billData,swbillData]);


  const propsForModuleCard = useMemo(() => ({
    Icon: <WSICon />,
    moduleName: t("WS_BILL_AMENDMENT_BUTTON"),
    kpis: [
      {
        count: isBillAMDInboxLoading ? "-" : totalCount,
        label: t("TOTAL_WS"),
        link: `/digit-ui/employee/ws/water/bill-amendment/inbox`,
      },
      {
        count: isBillAMDInboxLoading ? "-" : billData?.slaCount,
        label: t("TOTAL_NEARING_SLA"),
        link: `/digit-ui/employee/ws/water/bill-amendment/inbox`,
      }
    ],
    links: [
      {
        count: isBillAMDInboxLoading ? "-" : billData?.totalCount,
        label: t("WS_WATER_INBOX"),
        link: `/digit-ui/employee/ws/water/bill-amendment/inbox`,
        roles: ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"],
      },
      {
        count: isBillAMDInboxLoading ? "-" : swbillData?.totalCount,
        label: t("SW_WATER_INBOX"),
        link: `/digit-ui/employee/ws/sewerage/bill-amendment/inbox`,
        roles: ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"],
      }
    ],
  }), [isBillAMDInboxLoading, billData, totalCount]);

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default BillAmendmentCard;
