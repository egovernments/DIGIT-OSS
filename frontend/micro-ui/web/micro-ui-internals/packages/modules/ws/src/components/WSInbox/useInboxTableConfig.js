import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const useInboxTableConfig = ({ parentRoute, onPageSizeChange, formState, totalCount, table, dispatch, onSortingByData, tenantId, inboxStyles={}, tableStyle={} }) => {
  const { t } = useTranslation();

  const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;
  const GetStatusCell = (value) =>
    value === "Active" || value > 0 ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span>;

  const tableColumnConfig = useMemo(() => {
    return [
      {
        Header: t("WS_ACK_COMMON_APP_NO_LABEL"),
        accessor: "applicationNo",
        disableSortBy: true,
        Cell: ({ row }) => {
          let service = "WATER";
          if (row.original["applicationNo"].includes("SW")) service = "SEWERAGE";
          let application = "application";
          if (row?.original?.["applicationType"]?.toUpperCase()?.includes("DISCONNECT")) {
            application = "disconnection"
          } else if (row?.original?.["applicationType"]?.toUpperCase()?.includes("MODIFY")) {
            application = "modify"
          }
          return (
            <div>
              <Link
                to={`/digit-ui/employee/ws/${application}-details?applicationNumber=${row.original["applicationNo"]}&tenantId=${tenantId}&service=${service}&from=WS_SEWERAGE_INBOX`}
              >
                {" "}
                <span className="link">{row.original["applicationNo"]}</span>
              </Link>
            </div>
          );
        },
      },
      {
        Header: t("WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL"),
        accessor: "connectionNo",
        disableSortBy: true,
      },
      {
        Header: t("WS_COMMON_TABLE_COL_OWN_NAME_LABEL"),
        accessor: "owner",
        disableSortBy: true,
      },
      {
        Header: t("WS_COMMON_TABLE_COL_APP_TYPE_LABEL"),
        accessor: (row) => GetCell(t(`CS_COMMON_INBOX_${row?.applicationType?.toUpperCase()}`)),
        disableSortBy: true,
      },
      {
        Header: t("WS_COMMON_TABLE_COL_APPLICATION_STATUS"),
        accessor: (row) => GetCell(t(`CS_${row?.status}`)),
        disableSortBy: true,
      },
      {
        Header: t("ES_INBOX_SLA_DAYS_REMAINING"),
        accessor: (row) => GetStatusCell(row?.sla),
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
