import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Header } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "../../../../components/Events/DesktopInbox";
import MobileInbox from "../../../../components/Events/MobileInbox";
const Inbox = ({ tenants }) => {
  const { t } = useTranslation()
  Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [pageSize, setPageSize] = useState(10);
  const [pageOffset, setPageOffset] = useState(0);
  const [searchParams, setSearchParams] = Digit.Hooks.useSessionStorage("EVENTS_SEARCH", {
    eventStatus: [],
    range: {
      startDate: new Date(),
      endDate: new Date(),
      title: `${format(new Date(), "MMM d, yy")} - ${format(new Date(), "MMM d, yy")}`,
    }
  });
  let isMobile = window.Digit.Utils.browser.isMobile();
  const { data, isLoading } = Digit.Hooks.events.useInbox(tenantId, {
    limit: pageSize,
    offset: pageOffset,
  },
  { eventTypes: "EVENTSONGROUND" }, 
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
      (searchParams?.eventName ? row.original?.name?.startsWith(searchParams?.eventName) : true) &&
      (searchParams?.ulb?.code ? row.original.tenantId === searchParams?.ulb?.code : true) &&
      (searchParams?.eventCategory ? row.original.eventCategory === searchParams?.eventCategory?.code : true))
  }

  const getSearchFields = () => {
    return [
      {
        label: t("EVENTS_ULB_LABEL"),
        name: "ulb",
        type: "ulb",
      },
      {
        label: t("EVENTS_NAME_LABEL"),
        name: "eventName"
      }
    ]
  }

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
      />
    )
  } 

  return (
    <div>
      <Header>
        {t("EVENTS_EVENTS_HEADER")}
        {Number(data?.length) ? <p className="inbox-count">{Number(data?.length)}</p> : null}
      </Header>
      <DesktopInbox
        t={t}
        data={data}
        searchParams={searchParams}
        onSearch={onSearch}
        globalSearch={globalSearch}
        searchFields={getSearchFields()}
        onFilterChange={handleFilterChange}
        pageSizeLimit={pageSize}
        totalRecords={data?.length}
      />
    </div>
  );
}

export default Inbox; 