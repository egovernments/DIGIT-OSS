import React, { Fragment, useMemo } from "react"
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const useInboxTableConfig = ({ parentRoute, onPageSizeChange, formState, totalCount, table, dispatch}) => {
    const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;
    const GetStatusCell = (value) => value === "Active" ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span> 
    const { t } = useTranslation()
    
    const tableColumnConfig = useMemo(() => {
        return [
        {
            Header: t("TL_COMMON_TABLE_COL_APP_NO"),
            accessor: "applicationNo",
            Cell: ({ row }) => {
            return (
                <div>
                <Link to={`${parentRoute}/inbox/bpa/${row.original["applicationId"]}`}>
                    <span className="link">{row.original["applicationId"]}</span>
                </Link>
                </div>
            );
            },
        },
        {
            Header: t("CS_APPLICATION_DETAILS_APPLICATION_DATE"),
            accessor: "applicationDate",
            Cell: ({row}) => row.original?.["date"] ? GetCell(format(new Date(row.original?.["date"]), 'dd/MM/yyyy')) : ""
            },
        {
            Header: t("ES_INBOX_LOCALITY"),
            accessor: (row) => t(row?.locality)
        },
        {
            Header: t("EVENTS_STATUS_LABEL"),
            accessor: row => t(`WF_${row?.businessService}_${row?.status}`),
        },
        {
            Header: t("WF_INBOX_HEADER_CURRENT_OWNER"),
            accessor: (row) => row?.owner,
        },
        {
            Header: t("WS_COMMON_TABLE_COL_APP_TYPE_LABEL"),
            accessor: (row) => row?.applicationType,
        },
        {
            Header: t("ES_INBOX_SLA_DAYS_REMAINING"),
            accessor: row => GetStatusCell(row?.sla),
        }
        ]
    })

    return {
        getCellProps: (cellInfo) => {
        return {
            style: {
            padding: "20px 18px",
            fontSize: "16px"
        }}},
        disableSort: false,
        autoSort:false,
        manualPagination:true,
        initSortI:"applicationDate",
        onPageSizeChange:onPageSizeChange,
        currentPage: formState.tableForm?.offset / formState.tableForm?.limit,
        onNextPage: () => dispatch({action: "mutateTableForm", data: {...formState.tableForm , offset: (parseInt(formState.tableForm?.offset) + parseInt(formState.tableForm?.limit)) }}),
        onPrevPage: () => dispatch({action: "mutateTableForm", data: {...formState.tableForm , offset: (parseInt(formState.tableForm?.offset) - parseInt(formState.tableForm?.limit)) }}),
        pageSizeLimit: formState.tableForm?.limit,
        // onSort: onSort,
        // sortParams: [{id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false}],
        totalRecords: totalCount,
        onSearch: formState?.searchForm?.message,
        // globalSearch: {searchForItemsInTable},
        // searchQueryForTable,
        data: table,
        columns: tableColumnConfig
    }
}

export default useInboxTableConfig