import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DesktopInbox from "../components/inbox/DesktopInbox";
import MobileInbox from "../components/inbox/MobileInbox";

const Inbox = ({ parentRoute, businessService = "HRMS", initialStates = {}, filterComponent, isInbox }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading: isLoading, Errors, data: res } = Digit.Hooks.hrms.useHRMSCount(tenantId);

  const { t } = useTranslation();
  const [pageOffset, setPageOffset] = useState(initialStates.pageOffset || 0);
  const [pageSize, setPageSize] = useState(initialStates.pageSize || 10);
  const [sortParams, setSortParams] = useState(initialStates.sortParams || [{ id: "createdTime", desc: false }]);
  const [totalRecords, setTotalReacords] = useState(undefined);
  const [searchParams, setSearchParams] = useState(() => {
    return initialStates.searchParams || {};
  });

  let isMobile = window.Digit.Utils.browser.isMobile();
  let paginationParams = isMobile
    ? { limit: 100, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
    : { limit: pageSize, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };
  const isupdate = Digit.SessionStorage.get("isupdate");
  const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useHRMSSearch(
    searchParams,
    tenantId,
    paginationParams,
    isupdate
  );

  useEffect(() => {
    // setTotalReacords(res?.EmployeCount?.totalEmployee);
  }, [res]);

  useEffect(() => {}, [hookLoading, rest]);

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
    let _new = { ...searchParams, ...filterParam };
    if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    filterParam.delete;
    delete _new.delete;
    setSearchParams({ ..._new });
  };

  const handleSort = useCallback((args) => {
    if (args.length === 0) return;
    setSortParams(args);
  }, []);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const getSearchFields = () => {
    return [
      {
        label: t("HR_NAME_LABEL"),
        name: "names",
      },
      {
        label: t("HR_MOB_NO_LABEL"),
        name: "phone",
        maxlength: 10,
        pattern: "[6-9][0-9]{9}",
        title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
        componentInFront: "+91",
      },
      {
        label: t("HR_EMPLOYEE_ID_LABEL"),
        name: "codes",
      },
    ];
  };

  if (isLoading) {
    return <Loader />;
  }

  if (data?.length !== null) {
    if (isMobile) {
      return (
        <MobileInbox
          businessService={businessService}
          data={data}
          isLoading={hookLoading}
          defaultSearchParams={initialStates.searchParams}
          isSearch={!isInbox}
          onFilterChange={handleFilterChange}
          searchFields={getSearchFields()}
          onSearch={handleFilterChange}
          onSort={handleSort}
          onNextPage={fetchNextPage}
          tableConfig={rest?.tableConfig}
          onPrevPage={fetchPrevPage}
          currentPage={Math.floor(pageOffset / pageSize)}
          pageSizeLimit={pageSize}
          disableSort={false}
          onPageSizeChange={handlePageSizeChange}
          parentRoute={parentRoute}
          searchParams={searchParams}
          sortParams={sortParams}
          totalRecords={totalRecords}
          linkPrefix={'/digit-ui/employee/hrms/details/'}
          filterComponent={filterComponent}
        />
        // <div></div>
      );
    } else {
      return (
        <div>
          {isInbox && <Header>{t("HR_HOME_SEARCH_RESULTS_HEADING")}</Header>}
          <DesktopInbox
            businessService={businessService}
            data={data}
            isLoading={hookLoading}
            defaultSearchParams={initialStates.searchParams}
            isSearch={!isInbox}
            onFilterChange={handleFilterChange}
            searchFields={getSearchFields()}
            onSearch={handleFilterChange}
            onSort={handleSort}
            onNextPage={fetchNextPage}
            onPrevPage={fetchPrevPage}
            currentPage={Math.floor(pageOffset / pageSize)}
            pageSizeLimit={pageSize}
            disableSort={false}
            onPageSizeChange={handlePageSizeChange}
            parentRoute={parentRoute}
            searchParams={searchParams}
            sortParams={sortParams}
            totalRecords={totalRecords}
            filterComponent={filterComponent}
          />
        </div>
      );
    }
  }
};

export default Inbox;
