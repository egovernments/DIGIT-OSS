import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";

import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";

const Inbox = ({
  parentRoute,
  businessService = "PT",
  initialStates = {},
  filterComponent,
  isInbox,
  rawWfHandler,
  rawSearchHandler,
  combineResponse,
  wfConfig,
  searchConfig,
  middlewaresWf,
  middlewareSearch,
}) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  let isMcollectAppChanged = Digit.SessionStorage.get("isMcollectAppChanged");
  const { t } = useTranslation();
  const [pageOffset, setPageOffset] = useState(initialStates.pageOffset || 0);
  const [pageSize, setPageSize] = useState(initialStates.pageSize || 10);
  const [sortParams, setSortParams] = useState(initialStates.sortParams || [{ id: "createdTime", desc: false }]);
  const { isLoading, isError: isCountError, error: counterror, data: countData } = Digit.Hooks.mcollect.useMCollectCount(tenantId);

  const [searchParams, setSearchParams] = useState(() => {
    return initialStates.searchParams || {};
  });

  const [businessIdToOwnerMappings, setBusinessIdToOwnerMappings] = useState({});
  const [isLoader, setIsLoader] = useState(true);

  let isMobile = window.Digit.Utils.browser.isMobile();
  let paginationParams = isMobile
    ? { limit: 100, offset: 0, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
    : { limit: pageSize, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };
  // const { isLoading: hookLoading, searchResponseKey, data, ...rest } = Digit.Hooks.useInboxMCollect({
  //   tenantId,
  //   businessService,
  //   isInbox,
  //   filters: { ...searchParams, ...paginationParams, sortParams },
  //   rawWfHandler,
  //   rawSearchHandler,
  //   combineResponse,
  //   wfConfig,
  //   searchConfig,
  //   middlewaresWf,
  //   middlewareSearch,
  // });

  const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.mcollect.useMCollectSearch({
    tenantId,
    filters: { ...searchParams, ...paginationParams },
    isMcollectAppChanged,
  });

  useEffect(() => {
    if (!hookLoading && !data?.challans?.length > 0) setIsLoader(false);
    else if (hookLoading || data?.challans?.length) setIsLoader(true);
  }, [hookLoading, data]);

  let formedData = [];
  let res;
  let businessIdToOwnerMapping = {};

  useEffect(() => {
    async function fetchMyAPI() {
      let businessIds = [];
      let businessServiceMap = {};
      let challanNumbers = [];
      let challanNums = [];

      data?.challans?.forEach((item) => {
        challanNums = businessServiceMap[item.businessService] || [];
        challanNumbers = challanNums;
        challanNums.push(item.challanNo);
        businessServiceMap[item.businessService] = challanNums;
      });
      let processInstanceArray = [];

      for (var key in businessServiceMap) {
        let consumerCodes = businessServiceMap[key].toString();
        res = await Digit.PaymentService.fetchBill(tenantId, { consumerCode: consumerCodes, businessService: key });
        processInstanceArray = processInstanceArray.concat(res.Bill);
        businessIdToOwnerMapping = {};
        processInstanceArray
          .filter((record) => record.businessService)
          .forEach((item) => {
            businessIdToOwnerMapping[item.consumerCode] = {
              businessService: item.businessService,
              totalAmount: item.totalAmount || 0,
              dueDate: item?.billDetails[0]?.expiryDate,
            };
          });
      }
      setIsLoader(false);
      setBusinessIdToOwnerMappings(businessIdToOwnerMapping);
    }
    if (data?.challans && data?.challans?.length > 0) {
      setIsLoader(true);
      fetchMyAPI();
    }
  }, [data]);

  data?.challans?.map((data) => {
    formedData.push({
      challanNo: data?.challanNo,
      name: data?.citizen?.name,
      applicationStatus: data?.applicationStatus,
      businessService: data?.businessService,
      totalAmount: businessIdToOwnerMappings[data.challanNo]?.totalAmount || 0,
      dueDate: businessIdToOwnerMappings[data.challanNo]?.dueDate || "NA",
      tenantId: data?.tenantId,
      receiptNumber:data?.receiptNumber
    });
  });

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
    setPageOffset(data?.totalCount && Math.ceil(data?.totalCount / 10) * 10 - pageSize);
  };

  const fetchFirstPage = () => {
    setPageOffset((prevState) => 0);
  };

  const handleFilterChange = (filterParam) => {
    let keys_to_delete = filterParam.delete;
    let _new = {};
    if (isMobile) {
      _new = { ...filterParam };
      // setSearchParams({
      //   businessService: [],
      //   status: []
      // })
    } else {
      _new = { ...searchParams, ...filterParam };
    }
    // let _new = { ...searchParams, ...filterParam };
    // if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    // delete filterParam.delete;
    if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    delete _new.delete;
    delete filterParam.delete;
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
        label: t("UC_CHALLAN_NUMBER"),
        name: "challanNo",
      },
      {
        label: t("UC_MOBILE_NUMBER_LABEL"),
        name: "mobileNumber",
        maxlength: 10,
        pattern: "[6-9][0-9]{9}",
        title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
        componentInFront: "+91",
      },
      {
        label: t("UC_RECIEPT_NUMBER_LABEL"),
        name: "receiptNumber",
      },
    ];
  };

  if (rest?.data?.length !== null) {
    if (isMobile) {
      return (
        <MobileInbox
          data={formedData}
          defaultSearchParams={initialStates.searchParams}
          isLoading={hookLoading}
          isSearch={!isInbox}
          searchFields={getSearchFields()}
          onFilterChange={handleFilterChange}
          onSearch={handleFilterChange}
          onSort={handleSort}
          parentRoute={parentRoute}
          searchParams={searchParams}
          sortParams={sortParams}
          //linkPrefix={`${parentRoute}/application-details/`}
          tableConfig={rest?.tableConfig}
          filterComponent={filterComponent}
        />
        // <div></div>
      );
    } else {
      return (
        <div>
          {isInbox && <Header>{t("UC_SEARCH_MCOLLECT_HEADER")}</Header>}
          <DesktopInbox
            businessService={businessService}
            data={formedData}
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
            onLastPage={fetchLastPage}
            onFirstPage={fetchFirstPage}
            currentPage={Math.floor(pageOffset / pageSize)}
            pageSizeLimit={pageSize}
            disableSort={false}
            onPageSizeChange={handlePageSizeChange}
            parentRoute={parentRoute}
            searchParams={searchParams}
            sortParams={sortParams}
            totalRecords={data?.totalCount}
            filterComponent={filterComponent}
            isLoader={isLoader}
          />
        </div>
      );
    }
  }
};

export default Inbox;
