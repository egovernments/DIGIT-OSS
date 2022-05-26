import React, { useState, useCallback } from "react";
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
    name: '',
    range: {
      startDate: null,
      endDate: new Date(""),
      title: ""
    },
    ulb: tenants?.find(tenant => tenant?.code === tenantId)
  });
  let isMobile = window.Digit.Utils.browser.isMobile();
  const { data, isLoading } = Digit.Hooks.events.useInbox(searchParams?.ulb?.code, {},
    {
      status: "ACTIVE,INACTIVE", eventTypes: "BROADCAST", limit: pageSize,
      offset: pageOffset,
    },
    {
      select: (data) => ({ events: data?.events, totalCount: data?.totalCount })
    });

  const onSearch = (params) => {
    let updatedParams = { ...params };
    if (!params?.ulb) {
      updatedParams = { ...params, ulb: { code: tenantId } }
    }
    setSearchParams((prevParams) => ({ ...prevParams, ...updatedParams }));
  }

  const handleFilterChange = (data) => {
    setSearchParams((prevParams) => ({ ...prevParams, ...data }))
  }

  const globalSearch = (rows, columnIds) => {
    // return rows;
    return rows?.filter(row =>
      (searchParams?.eventStatus?.length > 0 ? searchParams?.eventStatus?.includes(row.original?.status) : true) &&
      (searchParams?.name ? row.original?.name?.toUpperCase().startsWith(searchParams?.name.toUpperCase()) : true) &&
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
      /* {
        name: "range",
        type: "range"
      }, */
      {
        label: t("EVENTS_MESSAGE_LABEL"),
        name: "name"
      }
    ]
  }

  const links = [
    {
      text: t("NEW_PUBLIC_MESSAGE_BUTTON_LABEL"),
      link: "/digit-ui/employee/engagement/messages/inbox/create",
    }
  ]

  const fetchNextPage = useCallback(() => {
    setPageOffset((prevPageOffSet) => ((parseInt(prevPageOffSet) + parseInt(pageSize))));
  }, [pageSize])

  const fetchPrevPage = useCallback(() => {
    setPageOffset((prevPageOffSet) => ((parseInt(prevPageOffSet) - parseInt(pageSize))));
  }, [pageSize])

  const handlePageSizeChange = (e) => {
    setPageSize((prevPageSize) => (e.target.value));
  };

  if (isMobile) {
    return (
      <MobileInbox
        data={data?.events}
        searchParams={searchParams}
        searchFields={getSearchFields()}
        t={t}
        onFilterChange={handleFilterChange}
        onSearch={onSearch}
        isLoading={isLoading}
        title={"EVENTS_PUBLIC_MESSAGE_NOTICE_HEADER"}
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
        data={data?.events}
        links={links}
        parentRoute={parentRoute}
        searchParams={searchParams}
        onSearch={onSearch}
        globalSearch={globalSearch}
        searchFields={getSearchFields()}
        onFilterChange={handleFilterChange}
        pageSizeLimit={pageSize}
        totalRecords={data?.totalCount}
        currentPage={parseInt(pageOffset / pageSize)}
        onNextPage={fetchNextPage}
        onPrevPage={fetchPrevPage}
        onPageSizeChange={handlePageSizeChange}
        title={"EVENTS_PUBLIC_MESSAGE_NOTICE_HEADER"}
        links={links}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Inbox;