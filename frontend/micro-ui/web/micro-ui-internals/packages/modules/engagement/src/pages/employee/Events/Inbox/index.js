import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "../../../../components/Events/DesktopInbox";

const Inbox = ({ tenants }) => {
  const { t } = useTranslation()
  Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [pageSize, setPageSize] = useState(10);
  const [pageOffset, setPageOffset] = useState(0);
  const [searchParams, setSearchParams] = Digit.Hooks.useSessionStorage("EVENTS_SEARCH", {
    eventStatus: []
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
    console.log(columnIds, rows, 'global search')
    // return rows;
    return rows?.filter(row =>
      (searchParams?.eventStatus?.length > 0 ? searchParams?.eventStatus?.includes(row.original?.status) : true) &&
      (searchParams?.message ? row.original?.name?.startsWith(searchParams?.message) : true) &&
      (searchParams?.ulb?.code ? row.original.tenantId === searchParams?.ulb?.code : true))
  }

  const getSearchFields = () => {
    return [
      {
        label: t("EVENTS_ULB_LABEL"),
        name: "ulb",
        type: "ulb",
      },
      {
        label: t("EVENTS_DATERANGE_LABEL"),
        name: "dateRange"
      },
      {
        label: t("EVENTS_MESSAGE_LABEL"),
        name: "message"
      },
    ]
  }

  if (isMobile) {
    return null;
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