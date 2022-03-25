import { EmployeeModuleCard, PTIcon } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const WSCard = () => {
  if (!Digit.Utils.wsAccess()) {
    return null;
  }
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  sessionStorage.removeItem("Digit.PT_CREATE_EMP_WS_NEW_FORM");

  const propsForModuleCard = {
    Icon: <PTIcon />,
    moduleName: t("ACTION_TEST_WATER_AND_SEWERAGE"),
    kpis: [
      {
        count: '-',
        label: t("TOTAL_CONNECTIONS")
      },
      // {
      //     label: t(""),
      //     link: `/digit-ui/employee/receipts/inbox`
      // }  
    ],
    links: [
     
      {
        label: t("WS_SEARCH_APP"),
        link: `/digit-ui/employee/ws/search-application`
      },
      {
        label: t("WS_NEW_APP"),
        link: `/digit-ui/employee/ws/create-application`
      },

    ]
  }
  return <EmployeeModuleCard {...propsForModuleCard} />
};

export default WSCard;

