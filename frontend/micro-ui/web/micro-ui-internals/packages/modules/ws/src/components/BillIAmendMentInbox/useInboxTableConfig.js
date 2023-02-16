import React, { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const useInboxTableConfig = ({ parentRoute, onPageSizeChange, formState, totalCount, table, dispatch, onSortingByData, inboxStyles={}, tableStyle={} }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;

  const GetStatusCell = (value) => {
    if (value === "Approved") {
      return <span style={{ color: "#00703C" }}>{value}</span>;
    }
    if (value === "Rejected") {
      return <span style={{ color: "#0B0C0C" }}>{value}</span>;
    }
    if (value === "Inworkflow") {
      return <span style={{ color: "#E50000" }}>{value}</span>;
    }
  };
  const tableColumnConfig = useMemo(() => {
    return [
      {
        Header: t("WS_COMMON_TABLE_COL_SERVICE_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(t(`ACTION_TEST_${row?.original?.service?.includes("WS") ? "WATER" : "SEWERAGE"}`));
        },
      },
      {
        Header: t("WS_MYCONNECTIONS_APPLICATION_NO"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Link to={`/digit-ui/employee/ws/generate-note-bill-amendment?applicationNumber=${row.original["applicationNo"]}`}>
                <span className="link">{row.original["applicationNo"]}</span>
              </Link>
              {GetCell(t(`BILLAMENDMENT_${row?.original?.amendmentReason}_HEADING`))}
            </div>
          );
        },
      },
      ,
      {
        Header: t("CORE_COMMON_NAME"),
        disableSortBy: true,
        accessor: "owner",
      },
      {
        Header: t("WS_COMMON_TABLE_COL_ADDRESS"),
        disableSortBy: true,
        accessor: (row) => GetCell(t(Digit.Utils.locale.getRevenueLocalityCode(row.address, tenantId))),
      },
      {
        Header: t("WS_COMMON_TABLE_COL_APPLICATION_STATUS"),
        disableSortBy: true,
        accessor: (row) => GetStatusCell(t(row?.status)),
      },
      {
        Header: t("WS_COMMON_TABLE_COL_TASK_OWNER"),
        disableSortBy: true,
        accessor: "taskOwner",
      },
    ];
  });

  return {
    getCellProps: (cellInfo) => {
      return {
        style: {
          padding: "20px 18px",
          fontSize: "16px",
        },
      };
    },
    disableSort: false,
    autoSort: false,
    manualPagination: true,
    initSortId: "applicationDate",
    onPageSizeChange: onPageSizeChange,
    currentPage: formState.tableForm?.offset / formState.tableForm?.limit,
    onNextPage: () =>
      dispatch({
        action: "mutateTableForm",
        data: { ...formState.tableForm, offset: parseInt(formState.tableForm?.offset) + parseInt(formState.tableForm?.limit) },
      }),
    onPrevPage: () =>
      dispatch({
        action: "mutateTableForm",
        data: { ...formState.tableForm, offset: parseInt(formState.tableForm?.offset) - parseInt(formState.tableForm?.limit) },
      }),
    pageSizeLimit: formState.tableForm?.limit,
    onSort: onSortingByData,
    // sortParams: [{id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false}],
    totalRecords: totalCount,
    onSearch: formState?.searchForm?.message,
    onLastPage: () =>
      dispatch({
        action: "mutateTableForm",
        data: { ...formState.tableForm, offset: Math.ceil(totalCount / 10) * 10 - parseInt(formState.tableForm?.limit) },
      }),
    onFirstPage: () => dispatch({ action: "mutateTableForm", data: { ...formState.tableForm, offset: 0 } }),
    // globalSearch: {searchForItemsInTable},
    // searchQueryForTable,
    data: table,
    columns: tableColumnConfig,
    inboxStyles:{...inboxStyles},
    tableStyle:{...tableStyle},
  };
};

export default useInboxTableConfig;
