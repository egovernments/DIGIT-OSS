import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";

const EngagementCard = () => {
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("ES_TITLE_CITIZEN_ENGAGEMENT"),
    kpis: [
        {
          count: "-",
          label: t("TOTAL_DOCUMENTS"),
          link: `/digit-ui/employee/pt/inbox`,
        },
        {
          label: t("TOTAL_EVENTS"),
          link: `/digit-ui/employee/fsm/inbox`
      }  
    ],
    links: [
      {
        count: "-",
        label: t("ES_TITLE_DOCS"),
        link: `/digit-ui/employee/engagement/documents/inbox`,
      },
      {
        count: "-",
        label: t("ES_TITLE_EVENT_INBOX"),
        link: `/digit-ui/employee/engagement/event/inbox`,
      },
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default EngagementCard;
