import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CardHeader, Header, Loader } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";
import { Link, useHistory, useLocation } from "react-router-dom";

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

const FstpServiceRequest = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation();
  const vehicleNumber = location.pathname.split("/").at(-1);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [searchParams, setSearchParams] = useState({ applicationStatus: "WAITING_FOR_DISPOSAL" });
  const [searchParamsApplication, setSearchParamsApplication] = useState(null);
  const [filterParam, setFilterParam] = useState();
  const [sortParams, setSortParams] = useState([{ id: "applicationNo", desc: true }]);
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [isVehicleSearchCompleted, setIsVehicleSearchCompleted] = useState(false);
  const [tripDetail, setTripDetail] = useState(null);
  const userInfo = Digit.UserService.getUser();
  let isMobile = window.Digit.Utils.browser.isMobile();

  const { isLoading: isVehiclesLoading, data: vehicles } = Digit.Hooks.fsm.useVehiclesSearch({
    tenantId,
    filters: { registrationNumber: vehicleNumber },
    config: { enabled: vehicleNumber?.length > 0 },
  });

  let filters = {
    businessService: "FSM_VEHICLE_TRIP",
    vehicleIds: vehicles !== undefined && vehicles?.vehicle[0]?.id.length > 0 ? vehicles?.vehicle[0]?.id || "null" : "null",
    applicationStatus: searchParams?.applicationStatus,
    sortOrder: sortParams[0]?.desc === false ? "ASC" : "DESC",
  };

  const { isLoading, data: { totalCount, vehicleLog } = {}, isSuccess } = Digit.Hooks.fsm.useVehicleSearch({
    tenantId,
    filters,
    config,
    options: { searchWithDSO: true },
  });

  const { isLoading: isSearchLoading, isIdle, data: { data: { table: tripDetails } = {} } = {} } = Digit.Hooks.fsm.useSearchAll(
    tenantId,
    searchParamsApplication,
    null,
    {
      enabled: !!isVehicleSearchCompleted,
    }
  );

  useEffect(() => {
    // if (isSuccess || isIdle || isSearchLoading || isLoading || isVehiclesLoading) {
    const applicationNos = vehicleLog?.map((i) => i?.tripDetails[0]?.referenceNo).join(",");
    setSearchParamsApplication({
      applicationNos: applicationNos ? applicationNos : "null",
      sortOrder: sortParams[0]?.desc === false ? "ASC" : "DESC",
    });
    setIsVehicleSearchCompleted(true);
    // }
  }, [isSuccess, isSearchLoading, isVehiclesLoading, vehicleLog, isIdle, isLoading, sortParams, vehicles]);

  useEffect(() => {
    if (tripDetails) {
      setTripDetail(tripDetails);
    }
  }, [tripDetails, isSearchLoading, isIdle]);

  let applicationNoList = [];
  vehicleLog?.map((i) => {
    applicationNoList.push(i?.tripDetails[0]?.referenceNo);
  });

  const onSearch = (params = {}) => {
    const a = params?.applicationNos?.length > 0 ? params?.applicationNos : null;
    let tempTripDetails = tripDetails;
    let filterTripDetails = a ? tempTripDetails.filter((i) => i.applicationNo === a) : tempTripDetails.filter((i) => i.applicationNo);
    setTripDetail(filterTripDetails);
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

  const handleFilterChange = (filterParam) => {
    // filtering application based on locality from UI side
    let tempTripDetails = tripDetails;
    let filterTripDetails = tempTripDetails.filter((i) =>
      i?.address?.locality?.name.includes(filterParam?.locality?.[0]?.name ? filterParam?.locality?.[0].name : "")
    );
    setTripDetail(filterTripDetails);
    setFilterParam(filterParam);
  };

  const searchFields = [
    {
      label: t("ES_SEARCH_APPLICATION_APPLICATION_NO"),
      name: "applicationNos",
    },
  ];

  const handleSort = useCallback((args) => {
    if (args?.length === 0) return;
    setSortParams(args);
  }, []);

  // if (isSuccess && totalCount === 0 && !isLoading) {
  //     history.push('/digit-ui/employee/fsm/fstp/new-vehicle-entry/')
  // }

  if (isLoading && !isSuccess && isSearchLoading && isVehiclesLoading && !isIdle && !isVehicleSearchCompleted) {
    return <Loader />;
  }

  if (vehicleLog?.length === 0 && tripDetails?.length === 0 && isSuccess && !isSearchLoading && tripDetail?.length === 0 && !isVehiclesLoading) {
    history.push(`/digit-ui/employee/fsm/fstp/new-vehicle-entry/${vehicleNumber}`);
  }

  let citizenInfo = [];
  tripDetail?.map((vehicle) => {
    citizenInfo.push(vehicleLog?.find((i) => i?.tripDetails[0]?.referenceNo === vehicle?.applicationNo));
  });

  if (isMobile) {
    return (
      <div>
        <Header>{t("ES_FSM_FSTP_SERVICE_REQUEST")}</Header>
        <MobileInbox
          onFilterChange={handleFilterChange}
          vehicleLog={vehicleLog}
          fstprequest={tripDetail}
          isFSMRequest={true}
          isLoading={isLoading}
          userRole={"FSM_EMP_FSTPO"}
          linkPrefix={"/digit-ui/employee/fsm/fstp-operator-details/"}
          onSearch={onSearch}
          searchFields={searchFields}
          onSort={handleSort}
          sortParams={sortParams}
        />
        <span className="link" style={{ margin: "8px" }}>
          <Link
            to={{
              pathname: "/digit-ui/employee/fsm/fstp/new-vehicle-entry/",
            }}
          >
            {t("ES_FSM_FSTP_NEW_ENTRY")}
          </Link>
        </span>
      </div>
    );
  } else {
    return (
      <div>
        <Header>{t("ES_FSM_FSTP_SERVICE_REQUEST")}</Header>
        <DesktopInbox
          data={{ table: citizenInfo }}
          fstprequest={tripDetails}
          isLoading={isLoading}
          onSort={handleSort}
          isFSMRequest={true}
          disableSort={false}
          sortParams={sortParams}
          userRole={"FSM_EMP_FSTPO_REQUEST"}
          onFilterChange={handleFilterChange}
          searchFields={searchFields}
          onSearch={onSearch}
          onNextPage={fetchNextPage}
          onPrevPage={fetchPrevPage}
          currentPage={Math.floor(pageOffset / pageSize)}
          pageSizeLimit={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalRecords={totalCount || 0}
          isPaginationRequired={false}
          searchParams={filterParam}
        />
        <span className="link" style={{ margin: "294px", padding: "2px" }}>
          <Link
            to={{
              pathname: "/digit-ui/employee/fsm/fstp/new-vehicle-entry/",
            }}
          >
            {t("ES_FSM_FSTP_NEW_ENTRY")}
          </Link>
        </span>
      </div>
    );
  }
  // }
};

export default FstpServiceRequest;
