import { EmployeeModuleCard, WSICon } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { checkForEmployee } from "../utils";

const SWCard = () => {
  if (!Digit.Utils.swAccess()) {
    return null;
  }
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [totalCount, setTotalCount] = useState(0);

  sessionStorage.removeItem("Digit.PT_CREATE_EMP_WS_NEW_FORM");
  sessionStorage.removeItem("IsDetailsExists");

  const filterFormDefaultValues1 = {
    businessService: ["NewSW1", "ModifySWConnection", "DisconnectSWConnection"],
    moduleName: "sw-services",
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
    filterForm: filterFormDefaultValues1,
    searchForm: searchFormDefaultValues,
    tableForm: tableOrderFormDefaultValues,
  };
  
  const { isLoading: isSWInboxLoading, data: swData } = Digit.Hooks.ws.useInbox({
    tenantId,
    filters: { ...formInitValue },
  });
  useEffect(() => {
    if (!isSWInboxLoading) {
      const sewerageCount = swData?.totalCount ? swData?.totalCount : 0;
      setTotalCount(sewerageCount);
    }
  }, [swData]);

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
    moduleName: t("ACTION_TEST_SEWERAGE"),
    kpis: [
      {
        count: isSWInboxLoading ? "-" : totalCount,
        label: t("TOTAL_SW"),
        link: `/digit-ui/employee/ws/sewerage/inbox`,
      },
      {
        count: isSWInboxLoading ? "-" : swData?.slaCount,
        label: t("TOTAL_NEARING_SLA"),
        link: `/digit-ui/employee/ws/sewerage/inbox`,
      },
    ],
    links: [
      {
        count: isSWInboxLoading ? "-" : swData?.totalCount,
        label: t("WS_SEWERAGE_INBOX"),
        link: `/digit-ui/employee/ws/sewerage/inbox`,
        roles: ["SW_CEMP", "SW_APPROVER", "SW_FIELD_INSPECTOR", "SW_DOC_VERIFIER", "SW_CLERK"],
      },
      ...links,
      {
        label: t("WS_SEWERAGE_CONNECTION_SEARCH_LABEL"),
        link: `/digit-ui/employee/ws/sewerage/search-connection`,
        roles: ["SW_CEMP", "SW_APPROVER", "SW_FIELD_INSPECTOR", "SW_DOC_VERIFIER", "SW_CLERK"],
      },
      {
        label: t("WS_SEWERAGE_APPLICATION_SEARCH"),
        link: `/digit-ui/employee/ws/sewerage/search-application`,
        roles: ["SW_CEMP", "SW_APPROVER", "SW_FIELD_INSPECTOR", "SW_DOC_VERIFIER", "SW_CLERK"],
      },
    ],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SWCard;
