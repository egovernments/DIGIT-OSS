import React, { Fragment, useMemo } from "react"
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { InfoBannerIcon } from "@egovernments/digit-ui-react-components";
const useInboxTableConfig = ({ parentRoute, onPageSizeChange, formState, totalCount, table, dispatch, inboxStyles={} }) => {
    const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;
    const GetStatusCell = (value) => value?.toLowerCase() === "active" ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span>
    const { t } = useTranslation()

    const tableColumnConfig = useMemo(() => {
        return [
            {
                Header: t("CS_SURVEY_TITLE"),
                accessor: "uuid",
                Cell: ({ row }) => {
                    return (
                        <div>
                            <Link to={`${parentRoute}/surveys/inbox/details/${row.original["uuid"]}`}>
                                <span className="link">{row.original["title"]}</span>
                            </Link>
                        </div>
                    );
                },
            },
            {
                Header: t("EVENTS_START_DATE_LABEL"),
                accessor: "startDate",
                Cell: ({ row }) => row.original?.startDate ? GetCell(format(new Date(row.original?.startDate), 'dd/MM/yyyy')) : ""
            },
            {
                Header: t("EVENTS_END_DATE_LABEL"),
                accessor: "endDate",
                Cell: ({ row }) => row.original?.endDate ? GetCell(format(new Date(row.original?.endDate), 'dd/MM/yyyy')) : ""
            },
            {
                Header: t("CS_RESPONSE_COUNT"),
                accessor: "answersCount",
                Cell: ({ row }) => row.original?.answersCount ? GetCell(Number(row.original?.answersCount)) : "-"
            },
            {
                Header: <div>{t("EVENTS_STATUS_LABEL")}<div className="tooltip">
                    <InfoBannerIcon fill="#0b0c0c" style />
                    <span className="tooltiptext" style={{
                        whiteSpace: "pre-wrap",
                        fontSize: "small",
                        wordWrap:"break-word",
                        //overflow:"auto"
                    }}>
                        {`${t(`SURVEY_STATUS_TOOLTIP`)}`}
                    </span>
                </div></div>,
                accessor: "status",
                Cell: ({row}) => GetStatusCell(row.original?.status),
            },
            {
                Header: t("EVENTS_POSTEDBY_LABEL"),
                accessor: (row) =>  row.postedBy,
            },
            {
                Header: t("CS_SURVEY_RESULTS"),
                //accessor: "uuid",
                accessor: "results",
                Cell: ({ row }) => {
                    return (
                        <div style={{"display":"flex","justifyContent":"center"}}>
                            <Link to={`${parentRoute}/surveys/inbox/results/${row.original["uuid"]}`}>
                                <span  className="link"> 
                                    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.5 18H0V6H5.5V18ZM12.75 0H7.25V18H12.75V0ZM20 8H14.5V18H20V8Z" fill="#F47738"/>
                                    </svg> 
                                </span>
                            </Link>
                        </div>
                    );
                },
            }
        ]
    })

    return {
        getCellProps: (cellInfo) => {
            return {
                style: {
                    padding: "20px 18px",
                    fontSize: "16px"
                }
            }
        },
        disableSort: false,
        autoSort: true,
        manualPagination: true,
        initSortI: "endDate",
        onPageSizeChange: onPageSizeChange,
        currentPage: parseInt(formState.tableForm?.offset / formState.tableForm?.limit),
        onNextPage: () => dispatch({ action: "mutateTableForm", data: { ...formState.tableForm, offset: (parseInt(formState.tableForm?.offset) + parseInt(formState.tableForm?.limit)) } }),
        onPrevPage: () => dispatch({ action: "mutateTableForm", data: { ...formState.tableForm, offset: (parseInt(formState.tableForm?.offset) - parseInt(formState.tableForm?.limit)) } }),
        pageSizeLimit: formState.tableForm?.limit,
        // onSort: onSort,
        // sortParams: [{id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false}],
        totalRecords: parseInt(totalCount),
        onSearch: formState?.searchForm?.message,
        // globalSearch: {searchForItemsInTable},
        // searchQueryForTable,
        data: table,
        columns: tableColumnConfig,
        noResultsMessage:"CS_NO_SURVEYS_FOUND",
        inboxStyles:{...inboxStyles}
    }
}

export default useInboxTableConfig