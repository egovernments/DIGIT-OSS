import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";

const EngagementCard = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: count , isLoading, } = Digit.Hooks.engagement.useDocSearch({ tenantIds:tenantId }, {
    select: (data) => {
      return data?.totalCount;
    } 
  });

  const { t } = useTranslation();
  let result = null;
  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("ES_TITLE_CITIZEN_ENGAGEMENT"),
    kpis: [
        {
          count: isLoading ? "-": count,
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
        count: isLoading ? "-": count,
        label: t("ES_TITLE_DOCS"),
        link: `/digit-ui/employee/engagement/documents/inbox`,
      },
      {
        count: "-",
        label: t("ES_TITLE_EVENT_INBOX"),
        link: `/digit-ui/employee/engagement/event/inbox`,
      },
      {
        count: "-",
        label: t("ACTION_TEST_PUBLIC_MESSAGE_BROADCAST"),
        link: `/digit-ui/employee/engagement/messages/inbox`,
      },
    ],
  };

  const userRoles = Digit.SessionStorage.get('User')?.info?.roles
  const isEmployee = userRoles.find((role)=> role.code === 'EMPLOYEE');

  if(isEmployee) result = <EmployeeModuleCard {...propsForModuleCard} />;

  return result;
};

export default EngagementCard;
