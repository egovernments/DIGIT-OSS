import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import RegisryInbox from "../../../components/RegistryInbox";

const FSMRegistry = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [searchParams, setSearchParams] = useState({});
  const [sortParams, setSortParams] = useState([{ "id": "createdTime", "desc": true }]);
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [tab, setTab] = useState('VENDOR');

  const userInfo = Digit.UserService.getUser();

  let paginationParms = { limit: pageSize, offset: pageOffset, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };
  const { data: dsoData, isLoading: isLoading, isSuccess: isDsoSuccess, error: dsoError, refetch } = tab === "VEHICLE" ? Digit.Hooks.fsm.useVehiclesSearch({
    tenantId,
    filters: { registrationNumber: 'TS 09 PA 2584' },
    // config: { enabled: searchParams?.registrationNumber?.length > 0 },
  }) : Digit.Hooks.fsm.useDsoSearch(
    tenantId,
    {
      ...paginationParms,
      name: searchParams?.name,
      status: 'ACTIVE,DISABLED'
    },
    {
      enabled: false
    }
  )

  useEffect(() => {
    refetch();
  }, [])

  useEffect(() => {
    refetch();
  }, [searchParams, sortParams, pageOffset, pageSize])

  const onSearch = (params = {}) => {
    setSearchParams({ ...params });
  };

  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + pageSize);
  };

  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleFilterChange = () => { };

  const searchFields = tab === 'VEHICLE' ? [
    {
      label: t("ES_FSM_REGISTRY_SEARCH_VEHICLE_NUMBER"),
      name: "name",
    }
  ] :
    [
      {
        label: t("ES_FSM_REGISTRY_SEARCH_VENDOR_NAME"),
        name: "name",
      }
    ];

  const handleSort = useCallback((args) => {
    if (args?.length === 0) return;
    setSortParams(args);
  }, []);

  const onTabChange = (tab) => {
    setTab(tab)
  }

  const refetchData = () => {
    refetch();
  }

  return (
    <div>
      <Header>{t("ES_FSM_REGISTRY")}</Header>
      <RegisryInbox
        data={{ table: tab === 'VEHICLE' ? dsoData?.vehicle : dsoData }}
        isLoading={isLoading}
        onSort={handleSort}
        disableSort={false}
        sortParams={sortParams}
        userRole={"FSM_ADMIN"}
        onFilterChange={handleFilterChange}
        searchFields={searchFields}
        onSearch={onSearch}
        onNextPage={fetchNextPage}
        onPrevPage={fetchPrevPage}
        currentPage={Math.floor(pageOffset / pageSize)}
        pageSizeLimit={pageSize}
        onPageSizeChange={handlePageSizeChange}
        totalRecords={20 || 0}
        onTabChange={onTabChange}
        selectedTab={tab}
        refetchData={refetchData}
      />
    </div>
  );
};

export default FSMRegistry;
