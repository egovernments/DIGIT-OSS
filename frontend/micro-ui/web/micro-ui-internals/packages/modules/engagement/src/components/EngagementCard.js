import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";

const EngagementCard = () => {
  const userRoles = Digit.SessionStorage.get('User')?.info?.roles
  const isEmployee = userRoles.find((role) => role.code === 'EMPLOYEE');
  if (!isEmployee) return null;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: documentsCount, isLoading: isLoadingDocs, } = Digit.Hooks.engagement.useDocSearch({ tenantIds: tenantId }, {
    select: (data) => {
      return data?.totalCount;
    }
  });
  const { data: MessagesCount, isLoading: isLoadingMessages } = Digit.Hooks.events.useInbox(tenantId, {},
    { status: "ACTIVE,INACTIVE", eventTypes: "BROADCAST" },
    {
      select: (data) => data?.totalCount
    });

  const { data: totalEvents, isLoading: isLoadingEvents } = Digit.Hooks.events.useInbox(tenantId, {},
    { eventTypes: "EVENTSONGROUND" },
    {
      select: (data) => data?.totalCount
    });

  const { data: surveysCount, isLoading: isLoadingSurveys } = Digit.Hooks.survey.useSearch({ tenantIds:tenantId }, { select: (data) => data?.TotalCount })

  const totalDocsCount = useMemo(() => (isLoadingDocs ? "-" : documentsCount), [isLoadingDocs, documentsCount])
  const totalEventsCount = useMemo(() => (isLoadingEvents ? "-" : totalEvents), [isLoadingEvents, totalEvents])
  const totalMessagesCount = useMemo(() => (isLoadingMessages ? "-" : MessagesCount), [isLoadingMessages, MessagesCount])
  const totalSurveysCount = useMemo(() => (isLoadingSurveys ? "-" : surveysCount), [isLoadingSurveys, surveysCount])

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
        count: totalMessagesCount,
        label: t("TOTAL_MESSAGES"),
        link: `/digit-ui/employee/engagement/messages/inbox`
      },
      {
        count: totalSurveysCount,
        label: t("TOTAL_SURVEYS"),
        link: `/digit-ui/employee/engagement/surveys/inbox`
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
      {
        count: totalSurveysCount,
        label: t("CS_COMMON_SURVEYS"),
        link: `/digit-ui/employee/engagement/surveys/inbox`
      }
    ],
  };



  if (isEmployee) result = <EmployeeModuleCard {...propsForModuleCard} />;

  return result;
};

export default EngagementCard;
