import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";

const EngagementCard = () => {
  const userRoles = Digit.SessionStorage.get('User')?.info?.roles
  const isEmployee = userRoles.find((role)=> role.code === 'EMPLOYEE');
  if(!isEmployee) return null;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: documentsCount , isLoading: isLoadingDocs, } = Digit.Hooks.engagement.useDocSearch({ tenantIds:tenantId }, {
    select: (data) => {
      return data?.totalCount;
    } 
  });
  const { data:MessagesCount, isLoading:isLoadingMessages } = Digit.Hooks.events.useInbox(tenantId, {},
  { status: "ACTIVE,INACTIVE",eventTypes: "BROADCAST" }, 
  {
    select: (data) => data?.events?.length
  });

  const { data:totalEvents, isLoadingEvents } = Digit.Hooks.events.useInbox(tenantId, { },
  { eventTypes: "EVENTSONGROUND" }, 
  {
    select: (data) => data?.events?.length
  });

  const totalDocsCount = useMemo(()=>(isLoadingDocs ? "-":documentsCount),[isLoadingDocs, documentsCount])
  const totalEventsCount = useMemo(()=>(isLoadingEvents ? "-" : totalEvents),[isLoadingEvents, totalEvents])
  const totalMessagesCount = useMemo(()=>(isLoadingMessages ? "-" : MessagesCount), [isLoadingMessages, MessagesCount])

  const { t } = useTranslation();
  let result = null;
  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("ES_TITLE_CITIZEN_ENGAGEMENT"),
    kpis: [
        {
          count: totalDocsCount,
          label: t("TOTAL_DOCUMENTS"),
          link: `/digit-ui/employee/engagement/documents/inbox`,
        },
        { 
          count: totalEventsCount,
          label: t("TOTAL_EVENTS"),
          link: `/digit-ui/employee/engagement/event/inbox`
      },
      { 
        count : totalMessagesCount,
        label: t("TOTAL_MESSAGES"),
        link: `/digit-ui/employee/engagement/messages/inbox`
    }    
    ],
    links: [
      {
        count: totalDocsCount,
        label: t("ES_TITLE_DOCS"),
        link: `/digit-ui/employee/engagement/documents/inbox`,
      },
      {
        count: totalEventsCount,
        label: t("ES_TITLE_EVENT_INBOX"),
        link: `/digit-ui/employee/engagement/event/inbox`,
      },
      {
        count: totalMessagesCount,
        label: t("ACTION_TEST_PUBLIC_MESSAGE_BROADCAST"),
        link: `/digit-ui/employee/engagement/messages/inbox`,
      },
    ],
  };



  if(isEmployee) result = <EmployeeModuleCard {...propsForModuleCard} />;

  return result;
};

export default EngagementCard;
