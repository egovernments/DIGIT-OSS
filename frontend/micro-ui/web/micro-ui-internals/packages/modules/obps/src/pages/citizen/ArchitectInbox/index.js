import { Header } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DesktopInbox from "./DesktopInbox";
import MobileInbox from "./MobileInbox";

const headerStyle = {
  fontSize: "30px",
  fontWeight: "700",
  marginTop: "-10px",
  marginLeft: "15px"
}

const Inbox = ({ tenants, parentRoute }) => {
  const { t } = useTranslation()
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateCode = Digit.ULBService.getStateId();
  const [searchParams, setSearchParams] = useState({
    applicationStatus: [],
  });
  let isMobile = window.Digit.Utils.browser.isMobile();
  const userInfo = Digit.UserService.getUser();
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(window.Digit.Utils.browser.isMobile()?50:10);
  const [sortParams, setSortParams] = useState([{ id: "createdTime", sortOrder: "DESC" }]);
  const paginationParams = isMobile ? { limit: 10, offset: 0, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.sortOrder } :
    { limit: pageSize, offset: pageOffset, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.sortOrder }
  const inboxSearchParams = { limit: 10, offset: 0, mobileNumber: userInfo?.info?.mobileNumber }

  const { isLoading: bpaLoading, data: bpaInboxData } = Digit.Hooks.obps.useArchitectInbox({
    tenantId: stateCode,
    moduleName: "bpa-services",
    businessService: ["BPA_LOW", "BPA", "BPA_OC"],
    filters: {
      searchForm: {
        ...searchParams
      },
      tableForm: {
        sortBy: sortParams?.[0]?.id,
        limit: pageSize,
        offset: pageOffset,
        sortOrder: sortParams?.[0]?.sortOrder
      },
      filterForm: {
        moduleName: "bpa-services",
        businessService: [
          { code: "BPA_LOW", name: t("BPA_LOW") },
          { code: "BPA", name: t("BPA") },
          { code: "BPA_OC", name: t("BPA_OC") }
        ],
        applicationStatus: searchParams?.applicationStatus,
        locality: [],
        assignee: "ASSIGNED_TO_ALL"
      }
    },
    config: {},
    withEDCRData:false
  });

  /*   const searchFormDefaultValues = {
      // mobileNumber: "",
      applicationNo: searchParams?.applicationNo,
    }
  
    const filterFormDefaultValues = {
      moduleName: "bpa-services",
      // businessService: {code: "BPA", name:t("BPA")},
      applicationStatus: "",
      locality: [],
      assignee: "ASSIGNED_TO_ALL"
    }
    const tableOrderFormDefaultValues = {
      sortBy: sortParams?.[0]?.id,
      limit: 10,
      offset: 0,
      sortOrder: sortParams?.[0]?.sortOrder
    } */

  /*   const { isLoading: isInboxLoading, data: { table, statuses, totalCount } = {} } = Digit.Hooks.obps.useBPAInbox({
      // tenantId, moduleName, businessService, filters, config
      tenantId,
      filters: {
        filterForm: filterFormDefaultValues,
        searchForm: searchFormDefaultValues,
        tableForm: tableOrderFormDefaultValues
      },
      config: {
        select: (data) =>({
          statuses: data.statusMap,
          table: data?.items.map( application => ({
              applicationId: application.businessObject.applicationNumber,
              date: application.businessObject.applicationDate,
              businessService: application?.ProcessInstance?.businessService,
              applicationType:application?.businessObject?.additionalDetails?.applicationType,
              serviceType:application?.businessObject?.additionalDetails?.serviceType,
              locality: `${application.businessObject?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${application.businessObject?.landInfo?.address?.locality?.code?.toUpperCase()}`,
              status: application.businessObject.status,
              owner: application.ProcessInstance?.assigner?.name,
              sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000))
          })),
          totalCount: data.totalCount
        })
      },
  
    }); */

  /*   const { data: edcrData, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails(stateCode, {
      limit: pageSize,
      offset: pageOffset,
      sortBy: sortParams?.[0]?.id,
      sortOrder: sortParams?.[0]?.sortOrder
    }, {
      enabled: true,
      retry:false,
      staleTime: Infinity
    },
    "OBPS_SCRUTINYDETAILS_ALL"
    ) */

    const fetchLastPage = () => {
      setPageOffset(bpaInboxData?.totalCount && (Math.ceil(bpaInboxData?.totalCount / 10) * 10 - pageSize));
  };

  const fetchFirstPage = () => {
      setPageOffset(0);
  };

  const handleSort = (args) => {
    setSortParams(args);
  };

  const getSearchFields = () => {
    return [
      {
        label: t("BPA_COMMON_APP_NO"),
        name: "applicationNo",
        type: "ulb",
      },
    ]
  }

  const links = [
    {
      text: t("NEW_PUBLIC_MESSAGE_BUTTON_LABEL"),
      link: "/digit-ui/employee/engagement/messages/create",
    }
  ]

  const onSearch = (params) => {
    setSearchParams({ ...searchParams, ...params });
  }

  const handleFilterChange = (data) => {
    setSearchParams({ ...searchParams, ...data })
  }

  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + pageSize);
  };

  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  if (isMobile) {
    return (
      <React.Fragment>
        <h2 style={headerStyle} >{`${t("OBPS_ARCH_INBOX")} ( ${bpaInboxData?.totalCount || 0} )`}</h2>
        <MobileInbox
          bparegData={[]}
          edcrData={[]}
          data={bpaInboxData}
          statusMap={bpaInboxData?.statuses}
          searchParams={searchParams}
          searchFields={getSearchFields()}
          t={t}
          onFilterChange={handleFilterChange}
          onSearch={onSearch}
          sortParams={sortParams}
          onSort={handleSort}
          isLoading={bpaLoading}
          title={"EVENTS_PUBLIC_MESSAGE_NOTICE_HEADER"}
          iconName={"calender"}
          links={links}
        />
      </React.Fragment>
    )
  }

  return (
    <div>
    <Header>
      {t("ES_COMMON_INBOX")}
      {Number(bpaInboxData?.totalCount) ? <p className="inbox-count">{Number(bpaInboxData?.totalCount)}</p> : null}
    </Header>
    <DesktopInbox
      // bparegData={table}
      bparegData={[]}
      edcrData={[]}
      data={bpaInboxData}
      isLoading={bpaLoading}
      statusMap={bpaInboxData?.statuses}
      onFilterChange={handleFilterChange}
      searchFields={getSearchFields()}
      onSearch={onSearch}
      onSort={handleSort}
      onNextPage={fetchNextPage}
      onPrevPage={fetchPrevPage}
      onLastPage={fetchLastPage}
      onFirstPage={fetchFirstPage}
      currentPage={Math.floor(pageOffset / pageSize)}
      pageSizeLimit={pageSize}
      disableSort={false}
      searchParams={searchParams}
      onPageSizeChange={handlePageSizeChange}
      parentRoute={parentRoute}
      paginationParms={paginationParams}
      sortParams={sortParams}
      totalRecords={bpaInboxData?.totalCount}
    // totalRecords={isInbox ? Number(applications?.totalCount) : totalCount}
    />
    </div>
  );
}

export default Inbox; 
