import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";

const config = {
  select: (response) => {
    return {
      totalCount: response?.totalCount,
      vehicleLog: response?.vehicleTrip.map((trip) => {
        const owner = trip.tripOwner;
        const displayName = owner.name + (owner.userName ? `- ${owner.userName}` : "");
        const tripOwner = { ...owner, displayName };
        return { ...trip, tripOwner };
      }),
    };
  },
};

const FstpInbox = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [searchParams, setSearchParams] = useState({ applicationStatus: "WAITING_FOR_DISPOSAL" });
  const [sortParams, setSortParams] = useState([{ id: "createdTime", desc: true }]);
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { isLoading: isVehiclesLoading, data: vehicles } = Digit.Hooks.fsm.useVehiclesSearch({
    tenantId,
    filters: { registrationNumber: searchParams?.registrationNumber },
    config: { enabled: searchParams?.registrationNumber?.length > 0 },
  });

  const userInfo = Digit.UserService.getUser();
  let isMobile = window.Digit.Utils.browser.isMobile();
  let paginationParams = isMobile
    ? { limit: 100, offset: 0, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
    : { limit: pageSize, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };

  const { isLoading: applicationLoading, isError, data: applicationData, error } = Digit.Hooks.fsm.useSearch(
    tenantId,
    { applicationNos: searchParams?.refernceNos, uuid: userInfo.uuid },
    { staleTime: Infinity }
  );

  const { data: dsoData, isLoading: isDsoLoading, isSuccess: isDsoSuccess, error: dsoError } = Digit.Hooks.fsm.useDsoSearch(
    tenantId,
    {
      name: searchParams?.name,
      status: "ACTIVE",
    },
    { enabled: searchParams?.name?.length > 1 }
  );
  let filters = {
    businessService: "FSM_VEHICLE_TRIP",
    refernceNos: applicationData !== undefined && searchParams?.refernceNos?.length > 0 ? applicationData?.applicationNo || "null" : "",
    vehicleIds: vehicles !== undefined && searchParams?.registrationNumber?.length > 0 ? vehicles?.vehicle?.[0]?.id || "null" : "",
    // vehicleIds: applicationData !== undefined && searchParams?.applicationNos?.length > 0 ? applicationData?.vehicleId || "null" : vehicles !== undefined && searchParams?.registrationNumber?.length > 0 ? vehicles?.vehicle?.[0]?.id || "null" : "",
    tripOwnerIds: dsoData !== undefined && searchParams?.name?.length > 0 ? dsoData?.[0]?.ownerId || "null" : "",
    applicationStatus: searchParams?.applicationStatus,
    ...paginationParams,
  };

  if (applicationData == undefined) {
    filters = {
      responseInfo: {
        apiId: "Rainmaker",
        ver: null,
        ts: null,
        resMsgId: "uief87324",
        msgId: "1645827148736|en_IN",
        status: "successful",
      },
      vehicle: [],
      totalCount: 0,
    };
  }
  const { isLoading, data: { totalCount, vehicleLog } = {}, isSuccess } = Digit.Hooks.fsm.useVehicleSearch({
    tenantId,
    filters,
    config,
    options: { searchWithDSO: true },
  });

  const onSearch = (params = {}) => {
    setSearchParams({ applicationStatus: "WAITING_FOR_DISPOSAL", ...params });
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

  const handleFilterChange = () => {};

  const searchFields = [
    {
      label: t("ES_SEARCH_APPLICATION_APPLICATION_NO"),
      name: "refernceNos",
    },
    {
      label: t("ES_FSTP_OPERATOR_VEHICLE_NO"),
      name: "registrationNumber",
    },
    {
      label: t("ES_FSTP_DSO_NAME"),
      name: "name",
    },
  ];

  const handleSort = useCallback((args) => {
    if (args?.length === 0) return;
    setSortParams(args);
  }, []);

  // if (isSuccess) {
  if (isMobile) {
    return (
      <div>
        <Header>{t("ES_COMMON_INBOX")}</Header>
        <MobileInbox
          onFilterChange={handleFilterChange}
          vehicleLog={vehicleLog}
          isLoading={isLoading}
          userRole={"FSM_EMP_FSTPO"}
          linkPrefix={"/digit-ui/employee/fsm/fstp-operator-details/"}
          onSearch={onSearch}
          searchFields={searchFields}
          onSort={handleSort}
          sortParams={sortParams}
        />
      </div>
    );
  } else {
    return (
      <React.Fragment>
        <div style={{ marginLeft: "20px" }}>
          <Header>{t("ES_COMMON_INBOX")}</Header>
        </div>
        <DesktopInbox
          data={{ table: vehicleLog }}
          isLoading={isLoading}
          onSort={handleSort}
          disableSort={false}
          sortParams={sortParams}
          userRole={"FSM_EMP_FSTPO"}
          onFilterChange={handleFilterChange}
          searchFields={searchFields}
          onSearch={onSearch}
          onNextPage={fetchNextPage}
          onPrevPage={fetchPrevPage}
          currentPage={Math.floor(pageOffset / pageSize)}
          pageSizeLimit={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalRecords={totalCount || 0}
        />
      </React.Fragment>
    );
  }
  // }
};

export default FstpInbox;
