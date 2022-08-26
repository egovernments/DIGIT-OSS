import React, { useState, useCallback ,  useEffect  } from "react";
import { useTranslation } from "react-i18next";
import { format, isValid } from "date-fns";
import { Header } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "./DesktopInbox";
import axios from 'axios';
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
    },
    ulb: tenants?.find(tenant => tenant?.code === tenantId)
  });
  let isMobile = window.Digit.Utils.browser.isMobile();
  const [data, setData] = useState([]);

  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    (async () => {
      const result = await axios("https://62f0e3e5e2bca93cd23f2ada.mockapi.io/birth");
      setData(result.data);
      console.log("gooo" ,result.data);
    })();
  }, []);

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

  const links = [
    {
      text: t("ES_TITLE_NEW_EVENTS"),
      link: "/digit-ui/employee/engagement/event/inbox/new-event",
    }
  ]

  // const { data, isLoading } = Digit.BRService.get(data , tenantId, {},
  //   {
  //     eventTypes: "EVENTSONGROUND", limit: pageSize,
  //     offset: pageOffset,
  //   },
  //   {
  //     select: (data) => ({ br: data?.br, totalCount: data?.totalCount })
  //   });

    
  const onSearch = (params) => {
    let updatedParams = { ...params };
    if (!params?.ulb) {
      updatedParams = { ...params, ulb: { code: tenantId } }
    }
    setSearchParams({ ...searchParams, ...updatedParams });
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

  const fetchNextPage = useCallback(() => {
    setPageOffset((prevPageOffSet) => ((parseInt(prevPageOffSet) + parseInt(pageSize))));
  }, [pageSize])

  const fetchPrevPage = useCallback(() => {
    setPageOffset((prevPageOffSet) => ((parseInt(prevPageOffSet) - parseInt(pageSize))));
  }, [pageSize])

  const handlePageSizeChange = (e) => {
    setPageSize((prevPageSize) => (e.target.value));
  };



  

  return (
    <div>
      <Header>
        {t("Birth-registration")}
      
      </Header>
      <p>{}</p>
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
        totalRecords={data?.totalCount}
        title={"Birth-registration"}
        iconName={"calender"}
        currentPage={parseInt(pageOffset / pageSize)}
        onNextPage={fetchNextPage}
        onPrevPage={fetchPrevPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

export default Inbox;