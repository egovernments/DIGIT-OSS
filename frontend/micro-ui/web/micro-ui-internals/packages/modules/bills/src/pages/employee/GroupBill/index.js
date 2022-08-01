import { Header, DownloadIcon, MultiLink,Toast } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DesktopInbox from "../../../components/inbox/BillsDesktopInbox";
import MobileInbox from "../../../components/inbox/BillsMobileInbox";

const GroupBillInbox = ({ parentRoute, initialStates = {}, businessService, filterComponent, isInbox, keys }) => {
  const [showToast,setShowToast] = useState(null)
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [enableSarch, setEnableSearch] = useState(() => (isInbox ? {} : { enabled: false }));

  const { t } = useTranslation();
  const [pageOffset, setPageOffset] = useState(initialStates?.pageOffset || 0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(initialStates?.pageSize || 10);
  const [sortParams, setSortParams] = useState(initialStates?.sortParams || [{ id: "applicationDate", desc: false }]);
  const [setSearchFieldsBackToOriginalState, setSetSearchFieldsBackToOriginalState] = useState(false);
  const [searchParams, setSearchParams] = useState(() => {
    return initialStates?.searchParams || {};
  });

  let isMobile = window.Digit.Utils.browser.isMobile();
  let paginationParams = isMobile
    ? { limit: 100, offset: 0, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
    : { limit: pageSize, offset: pageOffset, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };

  const { isFetching, isLoading: hookLoading, searchResponseKey, data, searchFields, ...rest } = Digit.Hooks.useBillSearch({
    tenantId,
    filters: { ...searchParams, businessService, ...paginationParams, sortParams, billActive: "ACTIVE" },
    config: {},
  });

  useEffect(() => {
    setPageOffset(0);
  }, [searchParams]);

  useEffect(() => {
    setTotalRecords(data?.Bills?.length);
  }, [data]);

  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + pageSize);
  };

  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - pageSize);
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
        label: t("ABG_CONSUMER_ID_LABEL"),
        name: "consumerCode",
      },
    ];
  };

  const downloadAll = (data) => {
    data.map((fs) => {
      window.open(fs.url);
    });
  };

  //pt -> property-bill,ADVT.Hoardings->mcollect-bill,SW/WS->ws-bill(different api call)(egov-pdf/download/WNS/wnsgroupbill)
  //For water and sewerage need to implement with diff api at later stage due to requirement of other functionalities as well
  const downloadBills = async () => {
    const keyv1 = keys.filter((key) => key.code === searchParams.businesService);
    const bills = await Digit.PaymentService.generatePdf(tenantId, { Bill: data.Bills }, keyv1[0].billKey);
    const res = await Digit.UploadServices.Filefetch(bills?.filestoreIds, tenantId);
    window.open(res.data[bills.filestoreIds[0]]);
    //logic for downloading all bills anyway(if api is giving multiple filestoreids)
    const fsObj = res.data.fileStoreIds;
    // downloadAll(fsObj)
  };

  const handleMergeAndDownload = (e) => {
    downloadBills();
  };

  const GetLogo = () => (
    <button onClick={handleMergeAndDownload} style={{ margin: "0 0 0 0", verticalAlign: "middle" }} disabled={!data || data?.Bills?.length === 0}>
      <div className="header">
        <span className="logo">
          <DownloadIcon />
        </span>
        <Header>{t("BILLS_MERGE_AND_DOWNLOAD")}</Header>
      </div>
    </button>
  );

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
  
  const startWSBillDownloadJob = async (isConsolidated) => {
    const result = await Digit.WSService.wnsGroupBill({ key: "ws-bill", tenantId, locality: searchParams?.locality?.[0]?.code, isConsolidated, bussinessService: searchParams?.businesService });
    setShowToast({
      label: `${t("GRP_JOB_INITIATED_STATUS")} ${result?.jobId}`
    })
  };
  const [showOptions, setShowOptions] = useState(false)
  
  const dowloadOptions = searchParams?.businesService === "WS" ? [
    {
      order: 1,
      label: t("ABG_WATER_BILLS"),
      onClick: () => startWSBillDownloadJob(false),
    },
    {
      order: 2,
      label: t("ABG_WATER_SEWERAGE_BILLS"),
      onClick: () => startWSBillDownloadJob(true),
    }

  ] : searchParams?.businesService === "SW" ? [
    {
      order: 1,
      label: t("ABG_SEWERAGE_BILLS"),
      onClick: () => startWSBillDownloadJob(false),
    },
    {
      order: 2,
      label: t("ABG_WATER_SEWERAGE_BILLS"),
      onClick: () => startWSBillDownloadJob(true),
    }
  ] : [
    {
      order: 1,
      label: t("BILLS_MERGE_AND_DOWNLOAD"),
      onclick: handleMergeAndDownload
    }
  ];


  if (isMobile) {
    return (
      <MobileInbox
        data={data}
        isLoading={hookLoading}
        searchFields={getSearchFields()}
        onFilterChange={handleFilterChange}
        onSearch={handleFilterChange}
        onSort={handleSort}
        parentRoute={parentRoute}
        searchParams={searchParams}
        sortParams={sortParams}
      />
    );
  } else {
    return (
      <div className="groupBill-custom">
        <div className="custom-group-merge-container employee-application-details">
          {isInbox && <Header>{"Group Bills"}</Header>}
          {/* {GetLogo()} */}
          {data && data?.Bills?.length >= 0 && (
            <MultiLink
              className="multilinkWrapper employee-mulitlink-main-div"
              onHeadClick={() => setShowOptions(!showOptions)}
              displayOptions={showOptions}
              options={dowloadOptions}
              downloadBtnClassName={"employee-download-btn-className"}
              optionsClassName={"employee-options-btn-className"}
              label={t("BILLS_MERGE_AND_DOWNLOAD")}
            />
          )}
        </div>

        <DesktopInbox
          businessService={businessService}
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
        {showToast && <Toast label={showToast?.label} onClose={()=> setShowToast(null)} />}
      </div>
    );
  }
};

export default GroupBillInbox;
