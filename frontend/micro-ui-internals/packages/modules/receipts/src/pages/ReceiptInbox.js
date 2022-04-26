import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReceiptsDesktopInbox from "../components/inbox/ReceiptsDesktopInbox";
import ReceiptsMobileInbox from "../components/inbox/ReceiptsMobileInbox";

const ReceiptInbox = ({ parentRoute, businessService = "receipts", initialStates = {}, filterComponent, isInbox }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const isupdate = Digit.SessionStorage.get("isupdate");
  const { t } = useTranslation();
  const [pageOffset, setPageOffset] = useState(initialStates.pageOffset || 0);
  const [pageSize, setPageSize] = useState(initialStates.pageSize || 10);
  const [sortParams, setSortParams] = useState(initialStates.sortParams || [{ id: "createdTime", desc: false }]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchParams, setSearchParams] = useState(() => {
    return initialStates.searchParams || {};
  });
  const { isLoading: countLoading, data: countData, ...rest1 } = Digit.Hooks.receipts.useReceiptsSearch({ ...searchParams, isCountRequest: true }, tenantId, [], isupdate);
  let isMobile = window.Digit.Utils.browser.isMobile();

  let paginationParams = isMobile
    ? { limit: 100, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
    : { limit: pageSize, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };

  const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.receipts.useReceiptsSearch(searchParams, tenantId, paginationParams, isupdate);
  let isLoading = false;

  useEffect(() => {
    return () => {
      rest?.revalidate();
    }
  }, [])
  useEffect(() => { setTotalRecords(countData?.Count) }, [countData])
  useEffect(() => {
    setPageOffset(0);
  }, [searchParams]);

  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + pageSize);
  };

  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - pageSize);
  };
  const fetchLastPage = () => {
    setPageOffset((prevState) => countData?.Count && (Math.ceil(countData?.Count / 10) * 10 - pageSize));
  };

  const fetchFirstPage = () => {
    setPageOffset((prevState) => 0);
  };
  const handleFilterChange = (filterParam, reset = false) => {
    if (!reset) {
      let keys_to_delete = filterParam.delete;
      let _new = { ...searchParams, ...filterParam };
      if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
      filterParam.delete;
      delete _new.delete;
      setSearchParams({ ..._new });
    } else {
      setSearchParams({ ...initialStates.searchParams });
    }

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
      // {
      //   label: t("CR_SERVICE_CATEGORY_LABEL"),
      //   name: "service",
      // },
      {
        label: t("CR_CONSUMER_NO_LABEL"),
        name: "consumerCodes",
      },
      {
        label: t("CR_RECEPIT_NO_LABEL"),
        name: "receiptNumbers",
      },
      {
        label: t("CR_MOBILE_NO_LABEL"),
        name: "mobileNumber",
        maxlength: 10,
        pattern: "[6-9][0-9]{9}",
        title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
        componentInFront: "+91",
      },
    ];
  };

  if (isLoading) {
    return <Loader />;
  }

  if (data?.length !== null) {
    if (isMobile) {
      return (
        <ReceiptsMobileInbox
          businessService={businessService}
          data={data}
          tableConfig={rest?.tableConfig}
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
          linkPrefix={'/digit-ui/employee/receipts/details/'}
          filterComponent={filterComponent}
        />
      );
    } else {
      return (
        <div>
          {isInbox && <Header>{t("CR_SEARCH_COMMON_HEADER")}</Header>}
          <ReceiptsDesktopInbox
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
            onLastPage={fetchLastPage}
            onFirstPage={fetchFirstPage}
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

export default ReceiptInbox;
