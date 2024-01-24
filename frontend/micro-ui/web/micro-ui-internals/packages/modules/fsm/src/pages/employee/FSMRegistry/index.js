import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header, InfoIcon } from "@egovernments/digit-ui-react-components";
import { useParams, useHistory, useLocation } from "react-router-dom";

import RegisryInbox from "../../../components/RegistryInbox";

const FSMRegistry = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [searchParams, setSearchParams] = useState({});
  const [sortParams, setSortParams] = useState([{ id: "createdTime", desc: true }]);
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [tab, setTab] = useState("VENDOR");
  const [vehicleIds, setVehicleIds] = useState("");
  const [driverIds, setDriverIds] = useState("");
  const [tableData, setTableData] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedTabs = queryParams.get("selectedTabs");
  const [loaded, setLoaded] = useState(false);

  const userInfo = Digit.UserService.getUser();

  let paginationParms = { limit: pageSize, offset: pageOffset, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };
  const { data: dsoData, isLoading: isLoading, isSuccess: isDsoSuccess, error: dsoError, refetch } =
    selectedTabs === "VEHICLE"
      ? Digit.Hooks.fsm.useVehiclesSearch({
          tenantId,
          filters: {
            ...paginationParms,
            registrationNumber: searchParams?.registrationNumber,
            status: "ACTIVE,DISABLED",
          },
          config: { enabled: false },
        })
      : selectedTabs === "DRIVER"
      ? Digit.Hooks.fsm.useDriverSearch({
          tenantId,
          filters: {
            ...paginationParms,
            name: searchParams?.name,
            status: "ACTIVE,DISABLED",
          },
          config: { enabled: false },
        })
      : Digit.Hooks.fsm.useVendorSearch({
          tenantId,
          filters: {
            ...paginationParms,
            name: searchParams?.name,
            status: "ACTIVE,DISABLED",
          },
          config: { enabled: false },
        });

  const {
    data: vendorData,
    isLoading: isVendorLoading,
    isSuccess: isVendorSuccess,
    error: vendorError,
    refetch: refetchVendor,
  } = Digit.Hooks.fsm.useDsoSearch(
    tenantId,
    {
      vehicleIds: vehicleIds,
      driverIds: driverIds,
      // status: "ACTIVE",
    },
    { enabled: false }
  );
  const inboxTotalCount = dsoData?.totalCount || 50;

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    setPageOffset(0);
    refetch();
  }, [searchParams]);

  useEffect(() => {
    refetch();
  }, [searchParams, sortParams, pageOffset, pageSize]);

  useEffect(() => {
    if (dsoData?.vehicle && selectedTabs === "VEHICLE") {
      let vehicleIds = "";
      dsoData.vehicle.map((data) => {
        vehicleIds += `${data.id},`;
      });
      setVehicleIds(vehicleIds);
      setTableData(dsoData?.vehicle);
    }
    if (dsoData?.driver && selectedTabs === "DRIVER") {
      let driverIds = "";
      dsoData.driver.map((data) => {
        driverIds += `${data.id},`;
      });
      setDriverIds(driverIds);
      setTableData(dsoData?.driver);
    }
    if (dsoData?.vendor && selectedTabs === "VENDOR") {
      const tableData = dsoData.vendor.map((dso) => ({
        mobileNumber: dso.owner?.mobileNumber,
        name: dso.name,
        id: dso.id,
        auditDetails: dso.auditDetails,
        drivers: dso.drivers,
        activeDrivers: dso.drivers?.filter((driver) => driver.status === "ACTIVE"),
        allVehicles: dso.vehicles,
        dsoDetails: dso,
        vehicles: dso.vehicles
          ?.filter((vehicle) => vehicle.status === "ACTIVE")
          ?.map((vehicle) => ({
            id: vehicle.id,
            registrationNumber: vehicle?.registrationNumber,
            type: vehicle.type,
            i18nKey: `FSM_VEHICLE_TYPE_${vehicle.type}`,
            capacity: vehicle.tankCapacity,
            suctionType: vehicle.suctionType,
            model: vehicle.model,
          })),
      }));
      setTableData(tableData);
    }
  }, [dsoData]);

  useEffect(() => {
    if (vehicleIds !== "" || driverIds !== "") refetchVendor();
  }, [vehicleIds, driverIds]);

  useEffect(() => {
    if (vendorData) {
      if (selectedTabs === "VEHICLE") {
        const vehicles = dsoData?.vehicle.map((data) => {
          let vendor = vendorData.find((ele) => ele.dsoDetails?.vehicles?.find((vehicle) => vehicle.id === data.id));
          if (vendor) {
            data.vendor = vendor.dsoDetails;
          }
          return data;
        });
        setTableData(vehicles);
        setVehicleIds("");
      }
      if (selectedTabs === "DRIVER") {
        const drivers = dsoData?.driver.map((data) => {
          let vendor = vendorData.find((ele) => ele.dsoDetails?.drivers?.find((driver) => driver.id === data.id));
          if (vendor) {
            data.vendor = vendor.dsoDetails;
          }
          return data;
        });
        setTableData(drivers);
        setDriverIds("");
      }
    }
  }, [vendorData, dsoData]);

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

  const handleFilterChange = () => {};

  let searchFields =
    selectedTabs === "VEHICLE"
      ? [
          {
            label: t("ES_FSM_REGISTRY_SEARCH_VEHICLE_NUMBER"),
            name: "registrationNumber",
            labelChildren: (
              <div className="tooltip" style={{ paddingLeft: "10px", marginBottom: "-3px" }}>
                <InfoIcon />
                <span className="tooltiptext" style={{ width: "150px", left: "230%", fontSize: "14px" }}>
                  {t("ES_FSM_VEHICLE_FORMAT_TIP")}
                </span>
              </div>
            ),
          },
        ]
      : selectedTabs === "DRIVER"
      ? [
          {
            label: t("ES_FSM_REGISTRY_SEARCH_DRIVER_NAME"),
            name: "name",
          },
        ]
      : [
          {
            label: t("ES_FSM_REGISTRY_SEARCH_VENDOR_NAME"),
            name: "name",
          },
        ];
  const handleSort = useCallback((args) => {
    if (args?.length === 0) return;
    setSortParams(args);
  }, []);

  const onTabChange = (tab) => {
    setTab(tab);
    if (selectedTabs !== tab) {
      history.push(`/digit-ui/employee/fsm/registry?selectedTabs=${tab}`);
    }
  };

  const refetchData = () => {
    refetch();
  };

  const refetchVendorData = () => {
    refetchVendor();
  };

  useEffect(() => {
    refetch();
    refetchVendor();
  }, []);

  return (
    <div>
      <Header>{t("ES_FSM_REGISTRY")}</Header>
      <RegisryInbox
        data={{ table: tableData }}
        isLoading={isLoading || isVendorLoading}
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
        totalRecords={inboxTotalCount || 0}
        onTabChange={onTabChange}
        selectedTab={selectedTabs}
        refetchData={refetchData}
        refetchVendor={refetchVendorData}
      />
    </div>
  );
};

export default FSMRegistry;
