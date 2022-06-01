import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, Loader, Menu, Toast } from "@egovernments/digit-ui-react-components";
import FSMLink from "./inbox/FSMLink";
import ApplicationTable from "./inbox/ApplicationTable";
import Filter from "./inbox/Filter";
import { ToggleSwitch } from "@egovernments/digit-ui-react-components";
import RegistrySearch from "./RegistrySearch";
import { useQueryClient } from "react-query";

const RegisryInbox = (props) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  const GetCell = (value) => <span className="cell-text">{value}</span>;
  const FSTP = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;
  const [tableData, setTableData] = useState([])
  const [showToast, setShowToast] = useState(null);
  const queryClient = useQueryClient();

  const {
    isLoading: isUpdateLoading,
    isError: vendorCreateError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.fsm.useVendorUpdate(tenantId);

  useEffect(() => {
    setTableData(props?.data?.table || [])
  }, [props])

  const closeToast = () => {
    setShowToast(null);
  };

  const onValueChange = (row) => {
    let dsoDetails = row.original.dsoDetails
    const formData = {
      vendor: {
        ...dsoDetails,
        status: dsoDetails?.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
        owner: {
          ...dsoDetails.owner,
          gender: dsoDetails?.owner?.gender || 'OTHER',
          dob: dsoDetails?.owner?.dob || new Date(`1/1/1970`).getTime(),
          emailId: dsoDetails?.owner?.emailId || 'abc@egov.com',
          relationship: dsoDetails?.owner?.relationship || 'OTHER'
        },
      }
    };

    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: 'VENDOR' });
        queryClient.invalidateQueries("DSO_SEARCH");
        props.refetchData();
        setTimeout(closeToast, 3000);
      },
    });
  }

  const onCellClick = (row, column, length) => {
    setTableData(old =>
      old.map((data, index) => {
        if (index == row.id && (row.id !== data?.popup?.row && column.id !== data?.popup?.column && length)) {
          return {
            ...data,
            popup: {
              row: row.id,
              column: column.id
            },
          }
        } else {
          return {
            ...data,
            popup: {},
          }
        }
      })
    )
  }

  const onActionSelect = (action) => {
  }

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
            disableSortBy: true,
            Cell: ({ row }) => GetCell(row.original?.auditDetails?.createdTime ? Digit.DateUtils.ConvertEpochToDate(row.original?.auditDetails?.createdTime) : ''),
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_TOTAL_VEHICLES"),
            Cell: ({ row, column }) => {
              return (
                <div className="action-bar-wrap-registry" style={{ position: 'relative' }}>
                  <div className="cell-text" style={{ cursor: 'pointer' }} onClick={() => onCellClick(row, column, row.original?.allVehicles?.length)}>
                    {row.original?.allVehicles?.length || 0}
                    <br />
                  </div>
                  {row.id === row.original?.popup?.row && column.id === row.original?.popup?.column && <Menu
                    localeKeyPrefix={""}
                    options={row.original?.allVehicles?.map((data) => data.registrationNumber)}
                    onSelect={onActionSelect}
                  />}
                </div>
              )
            },
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_ACTIVE_VEHICLES"),
            disableSortBy: true,
            Cell: ({ row, column }) => {
              return (
                <div className="action-bar-wrap-registry" style={{ position: 'relative' }}>
                  <div className="cell-text" style={{ cursor: 'pointer' }} onClick={() => onCellClick(row, column, row.original?.vehicles?.length)}>
                    {row.original?.vehicles?.length || 0}
                    <br />
                  </div>
                  {row.id === row.original?.popup?.row && column.id === row.original?.popup?.column && <Menu
                    localeKeyPrefix={""}
                    options={row.original?.vehicles?.map((data) => data.registrationNumber)}
                    onSelect={onActionSelect}
                  />}
                </div>
              )
            },
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_TOTAL_DRIVERS"),
            disableSortBy: true,
            Cell: ({ row }) => GetCell(row.original?.drivers?.length || 0),
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_ACTIVE_DRIVERS"),
            disableSortBy: true,
            Cell: ({ row }) => GetCell(row.original?.activeDrivers?.length || 0),
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_ENABLED"),
            disableSortBy: true,
            Cell: ({ row }) => {
              return (
                <ToggleSwitch style={{ display: 'flex', justifyContent: 'center' }} value={row.original?.dsoDetails?.status === 'DISABLED' ? false : true} onChange={() => onValueChange(row)} name={`switch-${row.id}`} />
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
            Header: t("ES_FSM_REGISTRY_INBOX_DATE_VENDOR_CREATION"),
            disableSortBy: true,
            Cell: ({ row }) => GetCell(row.original?.auditDetails?.createdTime ? Digit.DateUtils.ConvertEpochToDate(row.original?.auditDetails?.createdTime) : ''),
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_VENDOR_NAME"),
            disableSortBy: true,
            Cell: ({ row }) => GetCell(row.original?.owner?.name),
          },
          {
            Header: t("ES_FSM_REGISTRY_INBOX_ENABLED"),
            disableSortBy: true,
            Cell: ({ row }) => {
              return (
                <ToggleSwitch style={{ display: 'flex', justifyContent: 'center' }} value={row.original?.dsoDetails?.status === 'DISABLED' ? false : true} onChange={() => onValueChange(row)} name={`switch-${row.id}`} />
              );
            },
          },
        ];
      default:
        return [];
    }
  }, [props.selectedTab]);

  let result;
  if (props.isLoading) {
    result = <Loader />;
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
              padding: "20px 18px",
              fontSize: "16px",
              // borderTop: "1px solid grey",
              // textAlign: "left",
              // verticalAlign: "middle",
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
            <Filter searchParams={props.searchParams} paginationParms={props.paginationParms} applications={props.data} onFilterChange={props.onFilterChange} type="desktop" />
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
