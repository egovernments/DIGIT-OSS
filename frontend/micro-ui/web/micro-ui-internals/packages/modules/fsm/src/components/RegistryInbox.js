import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { Card, Dropdown, Loader, Menu, SubmitBar, Toast } from "@egovernments/digit-ui-react-components";
import FSMLink from "./inbox/FSMLink";
import ApplicationTable from "./inbox/ApplicationTable";
import Filter from "./inbox/Filter";
import { ToggleSwitch } from "@egovernments/digit-ui-react-components";
import RegistrySearch from "./RegistrySearch";
import { useQueryClient } from "react-query";

const RegisryInbox = (props) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  const GetCell = (value) => <span className="cell-text">{value}</span>;
  const FSTP = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;
  const [tableData, setTableData] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [vendors, setVendors] = useState([]);
  const queryClient = useQueryClient();

  const {
    data: vendorData,
    isLoading: isVendorLoading,
    isSuccess: isVendorSuccess,
    error: vendorError,
    refetch: refetchVendor,
  } = Digit.Hooks.fsm.useDsoSearch(tenantId, { sortBy: "name", sortOrder: "ASC", status: "ACTIVE" }, { enabled: false });

  const {
    isLoading: isUpdateVendorLoading,
    isError: vendorUpdateError,
    data: updateVendorResponse,
    error: updateVendorError,
    mutate: mutateVendor,
  } = Digit.Hooks.fsm.useVendorUpdate(tenantId);

  const {
    isLoading: isUpdateVehicleLoading,
    isError: vehicleUpdateError,
    data: updateVehicleResponse,
    error: updateVehicleError,
    mutate: mutateVehicle,
  } = Digit.Hooks.fsm.useUpdateVehicle(tenantId);

  const {
    isLoading: isDriverLoading,
    isError: driverUpdateError,
    data: updateDriverResponse,
    error: updateDriverError,
    mutate: mutateDriver,
  } = Digit.Hooks.fsm.useDriverUpdate(tenantId);

  useEffect(() => {
    setTableData(props?.data?.table || []);
  }, [props]);

  useEffect(() => {
    if (props.selectedTab === "DRIVER" || props.selectedTab === "VEHICLE") refetchVendor();
  }, [props.selectedTab]);

  useEffect(() => {
    if (vendorData) {
      let vendors = vendorData.map((data) => data.dsoDetails);
      setVendors(vendors);
    }
  }, [vendorData]);

  const closeToast = () => {
    setShowToast(null);
  };

  const onVendorUpdate = (row) => {
    let formDetails = row.original.dsoDetails;
    const formData = {
      vendor: {
        ...formDetails,
        status: formDetails?.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
        owner: {
          ...formDetails.owner,
          gender: formDetails?.owner?.gender || "OTHER",
          dob: formDetails?.owner?.dob || new Date(`1/1/1970`).getTime(),
          emailId: formDetails?.owner?.emailId || "abc@egov.com",
          relationship: formDetails?.owner?.relationship || "OTHER",
        },
      },
    };

    mutateVendor(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "VENDOR" });
        queryClient.invalidateQueries("DSO_SEARCH");
        props.refetchData();
        setTimeout(closeToast, 3000);
      },
    });
  };

  const onVehicleUpdate = (row) => {
    let formDetails = row.original;
    delete formDetails.vendor;
    const formData = {
      vehicle: {
        ...formDetails,
        status: formDetails?.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
      },
    };

    mutateVehicle(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "VEHICLE" });
        queryClient.invalidateQueries("FSM_VEICLES_SEARCH");
        props.refetchVendor();
        props.refetchData();
        setTimeout(closeToast, 3000);
      },
    });
  };

  const onDriverUpdate = (row) => {
    let formDetails = row.original;
    const formData = {
      driver: {
        ...formDetails,
        status: formDetails?.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
        owner: {
          ...formDetails.owner,
          gender: formDetails?.owner?.gender || "OTHER",
          dob: formDetails?.owner?.dob || new Date(`1/1/1970`).getTime(),
          emailId: formDetails?.owner?.emailId || "abc@egov.com",
          relationship: formDetails?.owner?.relationship || "OTHER",
        },
      },
    };

    mutateDriver(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "DRIVER" });
        queryClient.invalidateQueries("FSM_DRIVER_SEARCH");
        props.refetchVendor();
        props.refetchData();
        setTimeout(closeToast, 3000);
      },
    });
  };

  const onVendorSelect = (row, selectedOption) => {
    let driverData = row.original;
    let formDetails = row.original.dsoDetails;

    let existingVendor = driverData?.vendor;
    let selectedVendor = selectedOption;
    delete driverData.vendor;
    driverData.vendorDriverStatus = "ACTIVE";
    if (existingVendor) {
      const drivers = existingVendor?.drivers;
      drivers.splice(
        drivers.findIndex((ele) => ele.id === driverData.id),
        1
      );
      const formData = {
        vendor: {
          ...formDetails,
          drivers: drivers,
        },
      };
    }
    const formData = {
      vendor: {
        ...selectedVendor,
        drivers: selectedVendor.drivers ? [...selectedVendor.drivers, driverData] : [driverData],
      },
    };

    mutateVendor(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "VENDOR" });
        queryClient.invalidateQueries("DSO_SEARCH");
        props.refetchData();
        setTimeout(closeToast, 3000);
      },
    });
  };

  const onCellClick = (row, column, length) => {
    setTableData((old) =>
      old.map((data, index) => {
        if (index == row.id && row.id !== data?.popup?.row && column.id !== data?.popup?.column && length) {
          return {
            ...data,
            popup: {
              row: row.id,
              column: column.id,
            },
          };
        } else {
          return {
            ...data,
            popup: {},
          };
        }
      })
    );
  };

  const onActionSelect = (action, type, data) => {
    if (type === "VEHICLE") {
      history.push("/digit-ui/employee/fsm/registry/vehicle-details/" + action);
    } else {
      let driver = data.find((ele) => ele.name === action);
      history.push("/digit-ui/employee/fsm/registry/driver-details/" + driver?.id);
    }
  };

  const onSelectAdd = () => {
    switch (props.selectedTab) {
      case "VENDOR":
        return history.push("/digit-ui/employee/fsm/registry/new-vendor");
      case "VEHICLE":
        return history.push("/digit-ui/employee/fsm/registry/new-vehicle");
      case "DRIVER":
        return history.push("/digit-ui/employee/fsm/registry/new-driver");
      default:
        break;
    }
  };

  const columns = React.useMemo(() => {
    switch (props.selectedTab) {
      case "VENDOR":
        return [
          {
            Header: t("ES_FSM_REGISTRY_INBOX_VENDOR_NAME"),
            disableSortBy: true,
            Cell: ({ row }) => {
              return (
                <div>
                  <span className="link">
                    <Link to={"/digit-ui/employee/fsm/registry/vendor-details/" + row.original["id"]}>
                      <div>
                        {row.original.name}
                        <br />
                      </div>
                    </Link>
                  </span>
                </div>
              );
            },
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_DATE_VENDOR_CREATION"),
            accessor: "createdTime",
            Cell: ({ row }) =>
              GetCell(row.original?.auditDetails?.createdTime ? Digit.DateUtils.ConvertEpochToDate(row.original?.auditDetails?.createdTime) : ""),
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_TOTAL_VEHICLES"),
            Cell: ({ row, column }) => {
              return (
                <div className="action-bar-wrap-registry" style={{ position: "relative" }}>
                  <div
                    className={row.original?.allVehicles?.length ? "link" : "cell-text"}
                    style={{ cursor: "pointer" }}
                    onClick={() => onCellClick(row, column, row.original?.allVehicles?.length)}
                  >
                    {row.original?.allVehicles?.length || 0}
                    <br />
                  </div>
                  {row.id === row.original?.popup?.row && column.id === row.original?.popup?.column && (
                    <Menu
                      localeKeyPrefix={""}
                      options={row.original?.allVehicles?.map((data) => data.registrationNumber)}
                      onSelect={(action) => onActionSelect(action, "VEHICLE")}
                    />
                  )}
                </div>
              );
            },
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_ACTIVE_VEHICLES"),
            disableSortBy: true,
            Cell: ({ row, column }) => {
              return (
                <div className="action-bar-wrap-registry" style={{ position: "relative" }}>
                  <div
                    className={row.original?.vehicles?.length ? "link" : "cell-text"}
                    style={{ cursor: "pointer" }}
                    onClick={() => onCellClick(row, column, row.original?.vehicles?.length)}
                  >
                    {row.original?.vehicles?.length || 0}
                    <br />
                  </div>
                  {row.id === row.original?.popup?.row && column.id === row.original?.popup?.column && (
                    <Menu
                      localeKeyPrefix={""}
                      options={row.original?.vehicles?.map((data) => data.registrationNumber)}
                      onSelect={(action) => onActionSelect(action, "VEHICLE")}
                    />
                  )}
                </div>
              );
            },
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_TOTAL_DRIVERS"),
            disableSortBy: true,
            Cell: ({ row, column }) => {
              return (
                <div className="action-bar-wrap-registry" style={{ position: "relative" }}>
                  <div
                    className={row.original?.drivers?.length ? "link" : "cell-text"}
                    style={{ cursor: "pointer" }}
                    onClick={() => onCellClick(row, column, row.original?.drivers?.length)}
                  >
                    {row.original?.drivers?.length || 0}
                    <br />
                  </div>
                  {row.id === row.original?.popup?.row && column.id === row.original?.popup?.column && (
                    <Menu
                      localeKeyPrefix={""}
                      options={row.original?.drivers?.map((data) => data.name)}
                      onSelect={(action) => onActionSelect(action, "DRIVER", row.original?.drivers)}
                    />
                  )}
                </div>
              );
            },
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_ACTIVE_DRIVERS"),
            disableSortBy: true,
            Cell: ({ row, column }) => {
              return (
                <div className="action-bar-wrap-registry" style={{ position: "relative" }}>
                  <div
                    className={row.original?.activeDrivers?.length ? "link" : "cell-text"}
                    style={{ cursor: "pointer" }}
                    onClick={() => onCellClick(row, column, row.original?.activeDrivers?.length)}
                  >
                    {row.original?.activeDrivers?.length || 0}
                    <br />
                  </div>
                  {row.id === row.original?.popup?.row && column.id === row.original?.popup?.column && (
                    <Menu
                      localeKeyPrefix={""}
                      options={row.original?.activeDrivers?.map((data) => data.name)}
                      onSelect={(action) => onActionSelect(action, "DRIVER", row.original?.activeDrivers)}
                    />
                  )}
                </div>
              );
            },
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_ENABLED"),
            disableSortBy: true,
            Cell: ({ row }) => {
              return (
                <ToggleSwitch
                  style={{ display: "flex", justifyContent: "left" }}
                  value={row.original?.dsoDetails?.status === "DISABLED" ? false : true}
                  onChange={() => onVendorUpdate(row)}
                  name={`switch-${row.id}`}
                />
              );
            },
          },
        ];
      case "VEHICLE":
        return [
          {
            Header: t("ES_FSM_REGISTRY_INBOX_VEHICLE_NAME"),
            disableSortBy: true,
            Cell: ({ row }) => {
              return (
                <div>
                  <span className="link">
                    <Link to={"/digit-ui/employee/fsm/registry/vehicle-details/" + row.original["registrationNumber"]}>
                      <div>
                        {row.original.registrationNumber}
                        <br />
                      </div>
                    </Link>
                  </span>
                </div>
              );
            },
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_DATE_VEHICLE_CREATION"),
            accessor: "createdTime",
            Cell: ({ row }) =>
              GetCell(row.original?.auditDetails?.createdTime ? Digit.DateUtils.ConvertEpochToDate(row.original?.auditDetails?.createdTime) : ""),
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_VENDOR_NAME"),
            disableSortBy: true,
            Cell: ({ row }) => GetCell(row.original?.vendor?.name || "NA"),
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_ENABLED"),
            disableSortBy: true,
            Cell: ({ row }) => {
              return (
                <ToggleSwitch
                  style={{ display: "flex", justifyContent: "left" }}
                  value={row.original?.status === "DISABLED" ? false : true}
                  onChange={() => onVehicleUpdate(row)}
                  name={`switch-${row.id}`}
                />
              );
            },
          },
        ];
      case "DRIVER":
        return [
          {
            Header: t("ES_FSM_REGISTRY_INBOX_DRIVER_NAME"),
            disableSortBy: true,
            accessor: "tripDetails",
            Cell: ({ row }) => {
              return (
                <div>
                  <span className="link">
                    <Link to={"/digit-ui/employee/fsm/registry/driver-details/" + row.original["id"]}>
                      <div>
                        {row.original.name}
                        <br />
                      </div>
                    </Link>
                  </span>
                </div>
              );
            },
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_DATE_DRIVER_CREATION"),
            accessor: "createdTime",
            Cell: ({ row }) =>
              GetCell(row.original?.auditDetails?.createdTime ? Digit.DateUtils.ConvertEpochToDate(row.original?.auditDetails?.createdTime) : ""),
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_VENDOR_NAME"),
            Cell: ({ row }) => {
              return (
                <Dropdown
                  className="fsm-registry-dropdown"
                  selected={row.original.vendor}
                  option={vendors}
                  select={(value) => onVendorSelect(row, value)}
                  optionKey="name"
                  t={t}
                />
              );
            },
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_ENABLED"),
            disableSortBy: true,
            Cell: ({ row }) => {
              return (
                <ToggleSwitch
                  style={{ display: "flex", justifyContent: "left" }}
                  value={row.original?.status === "DISABLED" ? false : true}
                  onChange={() => onDriverUpdate(row)}
                  name={`switch-${row.id}`}
                />
              );
            },
          },
        ];
      default:
        return [];
    }
  }, [props.selectedTab, vendors]);

  let result;
  if (props.isLoading) {
    result = <Loader />;
  } else if (tableData.length === 0) {
    let emptyCardText = "";
    let emptyButtonText = "";
    if (props.selectedTab === "VENDOR") {
      emptyCardText = "ES_FSM_REGISTRY_EMPTY_CARD_VENDOR";
      emptyButtonText = "ES_FSM_REGISTRY_EMPTY_BUTTON_VENDOR";
    } else if (props.selectedTab === "VEHICLE") {
      emptyCardText = "ES_FSM_REGISTRY_EMPTY_CARD_VEHICLE";
      emptyButtonText = "ES_FSM_REGISTRY_EMPTY_BUTTON_VEHICLE";
    } else {
      emptyCardText = "ES_FSM_REGISTRY_EMPTY_CARD_DRIVER";
      emptyButtonText = "ES_FSM_REGISTRY_EMPTY_BUTTON_DRIVER";
    }
    result = (
      <Card style={{ display: "flex", justifyContent: "center", minHeight: "250px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ marginTop: "50px", marginBottom: "25px" }}>{t(emptyCardText)}</div>
          <SubmitBar className="" label={t(emptyButtonText)} onSubmit={onSelectAdd} />
        </div>
      </Card>
    );
  } else if (tableData.length > 0) {
    result = (
      <ApplicationTable
        className="table registryTable"
        t={t}
        data={tableData}
        columns={columns}
        getCellProps={(cellInfo) => {
          return {
            style: {
              minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
              padding: cellInfo.column.Header === t("ES_FSM_REGISTRY_INBOX_VENDOR_NAME") ? "10px 18px" : "20px 18px",
              fontSize: "16px",
            },
          };
        }}
        onPageSizeChange={props.onPageSizeChange}
        currentPage={props.currentPage}
        onNextPage={props.onNextPage}
        onPrevPage={props.onPrevPage}
        pageSizeLimit={props.pageSizeLimit}
        onSort={props.onSort}
        disableSort={props.disableSort}
        sortParams={props.sortParams}
        totalRecords={props.totalRecords}
      />
    );
  }

  return (
    <div className="inbox-container">
      {props.userRole !== "FSM_EMP_FSTPO" && props.userRole !== "FSM_ADMIN" && !props.isSearch && (
        <div className="filters-container">
          <FSMLink parentRoute={props.parentRoute} />
          <div style={{ marginTop: "24px" }}>
            <Filter
              searchParams={props.searchParams}
              paginationParms={props.paginationParms}
              applications={props.data}
              onFilterChange={props.onFilterChange}
              type="desktop"
            />
          </div>
        </div>
      )}
      <div style={{ flex: 1, marginLeft: props.userRole === "FSM_ADMIN" ? "" : "24px" }}>
        <RegistrySearch
          onSearch={props.onSearch}
          type="desktop"
          searchFields={props.searchFields}
          isInboxPage={!props?.isSearch}
          searchParams={props.searchParams}
          onTabChange={props.onTabChange}
          selectedTab={props.selectedTab}
        />
        <div className="result" style={{ marginLeft: FSTP || props.userRole === "FSM_ADMIN" ? "" : !props?.isSearch ? "24px" : "", flex: 1 }}>
          {result}
        </div>
      </div>
      {showToast && (
        <Toast
          error={showToast.key === "error" ? true : false}
          label={t(showToast.key === "success" ? `ES_FSM_REGISTRY_${showToast.action}_DISABLE_SUCCESS` : showToast.action)}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default RegisryInbox;
