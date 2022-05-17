import { EmployeeModuleCard, WSICon } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { checkForEmployee } from "../utils";

const WSCard = () => {
  if (!Digit.Utils.wsAccess()) {
    return null;
  }
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [totalCount, setTotalCount] = useState(0);
  sessionStorage.removeItem("Digit.PT_CREATE_EMP_WS_NEW_FORM");
  sessionStorage.removeItem("IsDetailsExists");

  const filterFormDefaultValues = {
    businessService: ["NewWS1", "ModifyWSConnection"],
    moduleName: "ws-services",
    locality: [],
    assignee: "ASSIGNED_TO_ALL",
    applicationStatus: [],
    applicationType: [],
  };

  const filterFormDefaultValues1 = {
    businessService: ["NewSW1", "ModifySWConnection"],
    moduleName: "sw-services",
    locality: [],
    assignee: "ASSIGNED_TO_ALL",
    applicationStatus: [],
    applicationType: [],
  };

  const tableOrderFormDefaultValues = {
    sortBy: "",
    limit: 10,
    offset: 0,
    sortOrder: "DESC",
  };

  const searchFormDefaultValues = {};

  const formInitValue = {
    filterForm: filterFormDefaultValues,
    searchForm: searchFormDefaultValues,
    tableForm: tableOrderFormDefaultValues,
  };

  const formInitValue1 = {
    filterForm: filterFormDefaultValues1,
    searchForm: searchFormDefaultValues,
    tableForm: tableOrderFormDefaultValues,
  };

  const { isLoading: isWSInboxLoading, data: wsData } = Digit.Hooks.ws.useInbox({
    tenantId,
    filters: { ...formInitValue },
  });

  const { isLoading: isSWInboxLoading, data: swData } = Digit.Hooks.ws.useInbox({
    tenantId,
    filters: { ...formInitValue1 },
  });

  useEffect(() => {
    if (!isWSInboxLoading || !isSWInboxLoading) {
      const waterCount = wsData?.totalCount ? wsData?.totalCount : 0;
      const sewerageCount = swData?.totalCount ? swData?.totalCount : 0;
      setTotalCount(waterCount + sewerageCount);
    }
  }, [wsData, swData]);

  let links = [
    {
      label: t("WS_APPLY_NEW_CONNECTION_HOME_CARD_LABEL"),
      link: `/digit-ui/employee/ws/create-application`,
      roles: ["WS_CEMP", "SW_CEMP"],
    },
  ];

  links = links.filter((link) => (link.roles ? checkForEmployee(link.roles) : true));

  const propsForModuleCard = {
    Icon: <WSICon />,
    moduleName: t("ACTION_TEST_WATER"),
    kpis: [
      {
        count: isWSInboxLoading || isSWInboxLoading ? "-" : totalCount,
        label: t("TOTAL_FSM"),
      },
      // {
      //     label: t(""),
      //     link: `/digit-ui/employee/receipts/inbox`
      // }
    ],
    links: [
      // {    commented until api is integrated
      //   label: t("ES_COMMON_INBOX"),
      //   link: `/digit-ui/employee/ws/bill-amend/inbox`,
      // },
      ...links,
      {
        count: isWSInboxLoading ? "-" : wsData?.totalCount,
        label: t("WS_WATER_INBOX"),
        link: `/digit-ui/employee/ws/water/inbox`,
        roles: ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"],
      },
      {
        label: t("WS_WATER_APPLICATION_SEARCH"),
        link: `/digit-ui/employee/ws/water/search-application`,
        roles: ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"],
      },
      {
        label: t("WS_WATER_CONNECTION_SEARCH_LABEL"),
        link: `/digit-ui/employee/ws/water/search`,
        roles: ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"],
      },
    ],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default WSCard;
