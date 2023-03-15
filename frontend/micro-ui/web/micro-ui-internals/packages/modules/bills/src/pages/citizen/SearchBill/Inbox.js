import { Header } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CitizenMobileInbox from "../../../components/citizen/CitizenMobileInbox";
import CitizenInbox from "../../../components/citizen/inbox";

const Inbox = ({ parentRoute, initialStates, businessService, filterComponent, isInbox }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [enableSarch, setEnableSearch] = useState(() => (isInbox ? {} : { enabled: false }));

  const { t } = useTranslation();
  const [pageOffset, setPageOffset] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [pageSize, setPageSize] = useState(10);
  const [sortParams, setSortParams] = useState(initialStates?.sortParams || [{ id: "applicationDate", desc: false }]);
  const [setSearchFieldsBackToOriginalState, setSetSearchFieldsBackToOriginalState] = useState(false);
  const [searchParams, setSearchParams] = useState(() => {
    return initialStates?.searchParams || {};
  });

  let isMobile = window.Digit.Utils.browser.isMobile();
  let paginationParams = isMobile
    ? { limit: 10, offset: 0, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
    : {
        limit: pageSize,
        mobileNumber: Digit.SessionStorage.get("User")?.info?.mobileNumber,
        offset: pageOffset,
        sortBy: sortParams?.[0]?.id,
        sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC",
      };

  const { isFetching, isLoading: hookLoading, searchResponseKey, data, searchFields, ...rest } = Digit.Hooks.useBillSearch({
    tenantId,
    filters: { ...searchParams, businessService, ...paginationParams, sortParams },
    config: {
      enabled: false,
    },
  });

  useEffect(() => {
    setTotalRecords(data?.Bills?.length);
  }, [data]);

  useEffect(() => {
    setPageOffset(0);
  }, [searchParams]);

  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + pageSize);
  };

  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - pageSize);
  };

  const fetchFirstPage = () => {
    setPageOffset((prevState) => 0);
  };

  const fetchLastPage = () => {
    setPageOffset(totalRecords && Math.ceil(totalRecords / 10) * 10 - pageSize);
  };

  const handleFilterChange = (filterParam) => {
    let keys_to_delete = filterParam?.delete;
    let _new = {};
    if (isMobile) {
      _new = { ...filterParam };
    } else {
      _new = { ...searchParams, ...filterParam };
    }

    if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    delete _new?.delete;
    delete filterParam?.delete;
    setSetSearchFieldsBackToOriginalState(true);
    setSearchParams({ ..._new });
    setEnableSearch({ enabled: true });
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
        label: t("ABG_BILL_NUMBER_LABEL"),
        name: "billNo",
      },
      {
        label: t("ABG_CONSUMER_ID_LABEL"),
        name: "consumerCode",
      },
      {
        label: t("ABG_MOBILE_NO_LABEL"),
        name: "mobileNumber",
        maxlength: 10,

        pattern: Digit.Utils.getPattern("MobileNo"),
        title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
        componentInFront: "+91",
      },
    ];
  };

  //DONOT DELETE NEEDS IMPOVEMENT
  // const tenantId = Digit.ULBService.getCurrentTenantId();
  // const { t } = useTranslation();

  // const isMobile = window.Digit.Utils.browser.isMobile();

  // // let paginationParams = isMobile
  // //   ? { limit: 100, offset: 0, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
  // //   : { limit: pageSize, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };

  // const [ filters, setFilters, clearFilter ] = Digit.Hooks.useSessionStorage(`${businessService}.${tenantId}`, {
  //   offset: 0,
  //   limit: 10,
  //   applicationType: "NEW"
  // })

  // const { inbox: inboxData, wf: wfData, isLoading: dataLoading } = Digit.Hooks.tl.useInbox({
  //   tenantId,
  //   filters,
  //   config:{}
  // })

  if (isMobile) {
    return (
      <CitizenMobileInbox
        data={data}
        isLoading={hookLoading}
        searchFields={getSearchFields()}
        onFilterChange={handleFilterChange}
        onSearch={handleFilterChange}
        onSort={handleSort}
        parentRoute={parentRoute}
        searchParams={searchParams}
        sortParams={sortParams}
        totalRecords={totalRecords}
      />
    );
  } else {
    return (
      <div>
        {isInbox && <Header>{t("ABG_SEARCH_BILL_COMMON_HEADER")}</Header>}
        <CitizenInbox
          data={data}
          tableConfig={rest?.tableConfig}
          isLoading={hookLoading}
          defaultSearchParams={initialStates.searchParams}
          isSearch={!isInbox}
          onFilterChange={handleFilterChange}
          searchFields={getSearchFields()}
          setSearchFieldsBackToOriginalState={setSearchFieldsBackToOriginalState}
          setSetSearchFieldsBackToOriginalState={setSetSearchFieldsBackToOriginalState}
          onSearch={handleFilterChange}
          onSort={handleSort}
          onNextPage={fetchNextPage}
          onPrevPage={fetchPrevPage}
          onFirstPage={fetchFirstPage}
          onLastPage={fetchLastPage}
          currentPage={Math.floor(pageOffset / pageSize)}
          pageSizeLimit={10}
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
};

export default Inbox;
