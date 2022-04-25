import { EmployeeModuleCard, WSICon } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { checkForEmployee } from "../utils";

const WSCard = () => {
  if (!Digit.Utils.wsAccess()) {
    return null;
  }
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  sessionStorage.removeItem("Digit.PT_CREATE_EMP_WS_NEW_FORM");
  sessionStorage.removeItem("IsDetailsExists");

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
    moduleName: t("ACTION_TEST_WATER_AND_SEWERAGE"),
    kpis: [
      {
        count: "-",
        label: t("TOTAL_CONNECTIONS"),
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
        label: t("WS_WATER_INBOX"),
        link: `/digit-ui/employee/ws/water/inbox`,
      },
      {
        label: t("WS_SEWERAGE_INBOX"),
        link: `/digit-ui/employee/ws/sewerage/inbox`,
      },
      {
        label: t("ES_COMMON_APPLICATION_SEARCH"),
        link: `/digit-ui/employee/ws/search-application`,
      },
      {
        label: t("ES_COMMON_CONNECTION_SEARCH_LABEL"),
        link: `/digit-ui/employee/ws/search`,
      },
    ],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default WSCard;
