import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Header } from "@egovernments/digit-ui-react-components";

import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";

const Inbox = ({ parentRoute, isSearch = false, isInbox = false }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles;

  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  const isFSTPOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [shouldSearch, setShouldSearch] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortParams, setSortParams] = useState([{ id: "createdTime", desc: true }]);

  const searchParamsKey = isInbox ? "fsm/inbox/searchParams" : "fsm/search/searchParams";
  const searchParamsValue = isInbox
    ? {
        applicationStatus: [],
        locality: [],
        uuid:
          DSO || isFSTPOperator
            ? { code: "ASSIGNED_TO_ME", name: t("ES_INBOX_ASSIGNED_TO_ME") }
            : { code: "ASSIGNED_TO_ALL", name: t("ES_INBOX_ASSIGNED_TO_ALL") },
      }
    : {};
  const [searchParams, setSearchParams] = Digit.Hooks.useSessionStorage(searchParamsKey, searchParamsValue);

  useEffect(() => {
    onSearch(searchParams);
  }, []);

  let isMobile = window.Digit.Utils.browser.isMobile();
  let paginationParms = isMobile
    ? { limit: 100, offset: 0, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
    : { limit: pageSize, offset: pageOffset, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };

  // TODO: Here fromDate and toDate is only for mobile and it is not working for search application for mobile screen
  const { data: applications, isLoading, isIdle, refetch, revalidate } = Digit.Hooks.fsm.useInbox(
    tenantId,
    {
      ...searchParams,
      ...paginationParms,
      fromDate: searchParams?.fromDate ? new Date(searchParams?.fromDate).getTime() : undefined,
      toDate: searchParams?.toDate ? new Date(searchParams?.toDate).getTime() : undefined,
    },
    {
      enabled: isInbox,
    },
    DSO ? true : false
  );

  const inboxTotalCount = DSO
    ? applications?.statuses.filter((e) => e.applicationstatus === "DSO_INPROGRESS")[0]?.count +
      applications?.statuses.filter((e) => e.applicationstatus === "PENDING_DSO_APPROVAL")[0]?.count
    : applications?.totalCount;
  const {
    isLoading: isSearchLoading,
    isIdle: isSearchIdle,
    isError: isSearchError,
    data: { data, totalCount } = {},
    error,
  } = Digit.Hooks.fsm.useSearchAll(
    tenantId,
    {
      limit: pageSize,
      offset: pageOffset,
      ...searchParams,
      applicationStatus: searchParams?.applicationStatus?.code,
      fromDate: searchParams?.fromDate ? new Date(searchParams?.fromDate).getTime() : undefined,
      toDate: searchParams?.toDate ? new Date(searchParams?.toDate).getTime() : undefined,
    },
    null,
    { enabled: shouldSearch && isSearch }
  );

  useEffect(() => {
    setPageOffset(0);
  }, [searchParams]);

  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + pageSize);
  };

  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - pageSize);
  };

  const handleFilterChange = (filterParam) => {
    let keys_to_delete = filterParam.delete;
    let _new = { ...searchParams };
    if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    setSearchParams({ ..._new, ...filterParam });
  };

  const handleSort = useCallback((args) => {
    if (args?.length === 0) return;
    setSortParams(args);
    // const [sortBy] = args;
    // setSortParams({ key: sortBy.id, sortOrder: sortBy.desc ? "DESC" : "ASC" });
  }, []);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const onSearch = (params = {}) => {
    if (isSearch) {
      if (Object.keys(params)?.length === 0) {
        setShouldSearch(false);
        queryClient.resetQueries("FSM_CITIZEN_SEARCH");
      } else {
        setShouldSearch(true);
      }
      setSearchParams({ ...params });
    } else {
      setSearchParams(({ applicationStatus, locality, uuid }) => ({ applicationStatus, locality, uuid, ...params }));
    }
  };

  const removeParam = (params = {}) => {
    const _search = { ...searchParams };
    Object.keys(params).forEach((key) => delete _search[key]);
    setSearchParams(_search);
  };

  const getSearchFields = (userRoles) => {
    if (isSearch) {
      return [
        {
          label: t("ES_SEARCH_APPLICATION_APPLICATION_NO"),
          name: "applicationNos",
        },
        {
          label: t("ES_SEARCH_APPLICATION_MOBILE_NO"),
          name: "mobileNumber",
          maxlength: 10,
          pattern: "[6-9][0-9]{9}",
          title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
        },
        {
          label: t("ES_INBOX_STATUS"),
          name: "applicationStatus",
          type: "status",
        },
        {
          label: t("ES_SEARCH_FROM_DATE"),
          name: "fromDate",
          type: "date",
        },
        {
          label: t("ES_SEARCH_TO_DATE"),
          name: "toDate",
          type: "date",
        },
      ];
    }
    if (userRoles.find((role) => role.code === "FSM_EMP_FSTPO")) {
      return [
        {
          label: t("ES_SEARCH_APPLICATION_APPLICATION_NO"),
          name: "applicationNos",
        },
        {
          label: t("ES_FSTP_OPERATOR_VEHICLE_NO"),
          name: "vehicleNo",
        },
        {
          label: t("ES_FSTP_DSO_NAME"),
          name: "name",
        },
      ];
    } else {
      return [
        {
          label: t("ES_SEARCH_APPLICATION_APPLICATION_NO"),
          name: "applicationNos",
        },
        {
          label: t("ES_SEARCH_APPLICATION_MOBILE_NO"),
          name: "mobileNumber",
          maxlength: 10,
        },
      ];
    }
  };

  useEffect(() => {
    const status = ["CITIZEN_FEEDBACK_PENDING"];
    applications?.table?.map((data) => {
      if (status.includes(data.status)) data.sla = "-";
    });
  }, [applications]);

  if (applications?.table?.length !== null) {
    if (isMobile) {
      return (
        <div>
          {!isSearch && <Header>{t("ES_COMMON_INBOX")}</Header>}
          <MobileInbox
            data={isInbox ? applications : data}
            isLoading={isInbox ? isLoading || isIdle : isSearchLoading}
            isSearch={isSearch}
            searchFields={getSearchFields(userRoles)}
            onFilterChange={handleFilterChange}
            onSearch={onSearch}
            onSort={handleSort}
            parentRoute={parentRoute}
            searchParams={searchParams}
            sortParams={sortParams}
            removeParam={removeParam}
            linkPrefix={`${parentRoute}/${DSO ? "dso-application-details" : "application-details"}/`}
          />
        </div>
      );
    } else {
      return (
        <div>
          {!isSearch && (
            <Header>
              {t("ES_COMMON_INBOX")}
              {Number(inboxTotalCount) ? <p className="inbox-count">{Number(inboxTotalCount)}</p> : null}
            </Header>
          )}
          <DesktopInbox
            data={isInbox ? applications : data}
            isLoading={isInbox ? isLoading || isIdle : isSearchLoading}
            isSearch={isSearch}
            shouldSearch={shouldSearch}
            onFilterChange={handleFilterChange}
            searchFields={getSearchFields(userRoles)}
            onSearch={onSearch}
            onSort={handleSort}
            onNextPage={fetchNextPage}
            onPrevPage={fetchPrevPage}
            currentPage={Math.floor(pageOffset / pageSize)}
            pageSizeLimit={pageSize}
            disableSort={false}
            searchParams={searchParams}
            onPageSizeChange={handlePageSizeChange}
            parentRoute={parentRoute}
            paginationParms={paginationParms}
            sortParams={sortParams}
            totalRecords={isInbox ? Number(inboxTotalCount) : totalCount}
          />
        </div>
      );
    }
  }
};

export default Inbox;
