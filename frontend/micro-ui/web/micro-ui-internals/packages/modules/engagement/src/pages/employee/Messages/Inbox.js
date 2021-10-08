import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { format, isValid } from "date-fns";
import { Header } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "../../../components/Messages/DesktopInbox";
import MobileInbox from "../../../components/Messages/MobileInbox";

const Inbox = ({ tenants, parentRoute }) => {
  const { t } = useTranslation()
  Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [pageSize, setPageSize] = useState(10);
  const [pageOffset, setPageOffset] = useState(0);
  const [searchParams, setSearchParams] = useState({
    eventStatus: [],
    range: {
      startDate: null,
      endDate: new Date(""),
      title: ""
    }
  });
  let isMobile = window.Digit.Utils.browser.isMobile();
  const { data, isLoading } = Digit.Hooks.events.useInbox(tenantId, {
    // limit: pageSize,
    // offset: pageOffset,
  },
  { status: "ACTIVE,INACTIVE",eventTypes: "BROADCAST" }, 
  {
    select: (data) => data?.events
  });

  const onSearch = (params) => {
    setSearchParams({ ...searchParams, ...params });
  }

  const handleFilterChange = (data) => {
    setSearchParams({ ...searchParams, ...data })
  }

  const globalSearch = (rows, columnIds) => {
    // return rows;
    return rows?.filter(row =>
      (searchParams?.eventStatus?.length > 0 ? searchParams?.eventStatus?.includes(row.original?.status) : true) &&
      (searchParams?.eventName ? row.original?.name?.toUpperCase().startsWith(searchParams?.eventName.toUpperCase()) : true) &&
      (searchParams?.ulb?.code ? row.original.tenantId === searchParams?.ulb?.code : true) &&
      (searchParams?.eventCategory ? row.original.eventCategory === searchParams?.eventCategory?.code : true) &&
      (isValid(searchParams?.range?.startDate) ? row.original.eventDetails?.fromDate >= new Date(searchParams?.range?.startDate).getTime() : true) &&
      (isValid(searchParams?.range?.endDate) ? row.original.eventDetails?.toDate <= new Date(searchParams?.range?.endDate).getTime() : true))
  }

  const getSearchFields = () => {
    return [
      {
        label: t("EVENTS_ULB_LABEL"),
        name: "ulb",
        type: "ulb",
      },
      {
        label: t("EVENTS_MESSAGE_LABEL"),
        name: "eventName"
      }
    ]
  }

  const links = [
    {
      text: t("NEW_PUBLIC_MESSAGE_BUTTON_LABEL"),
      link: "/digit-ui/employee/engagement/messages/create",
    }
  ]

  if (isMobile) {
    return (
      <MobileInbox
        data={data}
        searchParams={searchParams}
        searchFields={getSearchFields()}
        t={t}
        onFilterChange={handleFilterChange}
        onSearch={onSearch}
        isLoading={isLoading}
        title = {"EVENTS_PUBLIC_MESSAGE_NOTICE_HEADER"}
        iconName={"calender"}
        links={links}
      />
    )
  } 

  return (
    <div>
      <Header>
        {t("EVENTS_PUBLIC_MESSAGE_NOTICE_HEADER")}
        {Number(data?.length) ? <p className="inbox-count">{Number(data?.length)}</p> : null}
      </Header>
      <DesktopInbox
        t={t}
        data={data}
        links={links}
        parentRoute={parentRoute}
        searchParams={searchParams}
        onSearch={onSearch}
        globalSearch={globalSearch}
        searchFields={getSearchFields()}
        onFilterChange={handleFilterChange}
        pageSizeLimit={pageSize}
        totalRecords={data?.length}
        title = {"EVENTS_PUBLIC_MESSAGE_NOTICE_HEADER"}
        iconName={"calender"}
        links={links}
      />
    </div>
  );
}

export default Inbox; 