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
    businessService: ["NewWS1", "ModifyWSConnection", "DisconnectWSConnection"],
    moduleName: "ws-services",
    locality: [],
    applicationStatus: [],
    applicationType: [],
  };

  const tableOrderFormDefaultValues = {
    sortBy: "auditDetails.lastModifiedTime",
    // limit: 10,
    // offset: 0,
    sortOrder: "DESC",
  };

  const searchFormDefaultValues = {};

  const formInitValue = {
    filterForm: filterFormDefaultValues,
    searchForm: searchFormDefaultValues,
    tableForm: tableOrderFormDefaultValues,
  };

  const { isLoading: isWSInboxLoading, data: wsData } = Digit.Hooks.ws.useInbox({
    tenantId,
    filters: { ...formInitValue },
  });

  useEffect(() => {
    if (!isWSInboxLoading) {
      const waterCount = wsData?.totalCount ? wsData?.totalCount : 0;
      setTotalCount(waterCount);
    }
  }, [wsData]);

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
        count: isWSInboxLoading ? "-" : totalCount,
        label: t("TOTAL_WS"),
        link: `/digit-ui/employee/ws/water/inbox`,
      },
      {
        count: isWSInboxLoading ? "-" : wsData?.slaCount,
        label: t("TOTAL_NEARING_SLA"),
        link: `/digit-ui/employee/ws/water/inbox`,
      }
    ],
    links: [
      {
        count: isWSInboxLoading ? "-" : wsData?.totalCount,
        label: t("WS_INBOX_HEADER"),
        link: `/digit-ui/employee/ws/water/inbox`,
        roles: ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"],
      },
      ...links,
      {
        label: t("WS_WATER_CONNECTION_SEARCH_LABEL"),
        link: `/digit-ui/employee/ws/water/search-connection`,
        roles: ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"],
      },
      {
        label: t("WS_WATER_APPLICATION_SEARCH"),
        link: `/digit-ui/employee/ws/water/search-application`,
        roles: ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"],
      },
    ],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default WSCard;
