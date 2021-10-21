import React, {Fragment, useCallback, useMemo, useReducer } from "react"
import { InboxComposer, CaseIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import FilterFormFieldsComponent from "./FilterFormFieldsComponent";
import SearchFormFieldsComponents from "./SearchFormFieldsComponent";

const Inbox = ({parentRoute}) => {
    
    const { t } = useTranslation()

    const tenantId = Digit.ULBService.getCurrentTenantId();

    const searchFormDefaultValues = {}

    const filterFormDefaultValues = {
      moduleName: "bpa-services",
      businessService: {code: "BPA", name:t("BPA")},
      applicationStatus: "",
      locality: [],
      assignee: "ASSIGNED_TO_ALL"
    }
    const tableOrderFormDefaultValues = {
      sortBy: "",
      limit: 10,
      offset: 0,
      sortOrder: "DESC"
    }

    function formReducer(state, payload) {
      switch(payload.action){
        case "mutateSearchForm":
          Digit.SessionStorage.set("OBPS.INBOX", {...state, searchForm: payload.data})
          return {...state, searchForm: payload.data};
        case "mutateFilterForm":
          Digit.SessionStorage.set("OBPS.INBOX", {...state, filterForm: payload.data})
          return {...state, filterForm: payload.data};
        case "mutateTableForm":
          Digit.SessionStorage.set("OBPS.INBOX", {...state, tableForm: payload.data})
          return {...state, tableForm: payload.data};
        default:
          console.warn("dispatched action has nothing to reduce")
      }
    }
    const InboxObjectInSessionStorage = Digit.SessionStorage.get("OBPS.INBOX")
    const formInitValue = useMemo(() => {
      // debugger
      return InboxObjectInSessionStorage || {
        filterForm: filterFormDefaultValues,
        searchForm: searchFormDefaultValues,
        tableForm: tableOrderFormDefaultValues
      }
    }
  , [Object.values(InboxObjectInSessionStorage?.filterForm || {}), Object.values(InboxObjectInSessionStorage?.searchForm || {}), Object.values(InboxObjectInSessionStorage?.tableForm || {})] )

    const [ formState, dispatch ] = useReducer(formReducer, formInitValue )
    const onPageSizeChange = (e) => {
      dispatch({action: "mutateTableForm", data: {...formState.tableForm , limit: e.target.value}})
    }
    const { isLoading: isInboxLoading, data: {table , statuses, totalCount} = {} } = Digit.Hooks.obps.useBPAInbox({
        // tenantId, moduleName, businessService, filters, config 
        tenantId,
        filters: { ...formState }
    });

    const PropsForInboxLinks = {
        logoIcon: <CaseIcon />,
        headerText: "CS_COMMON_OBPS",
        links: [{
            text: t("BPA_SEARCH_PAGE_TITLE"),
            link: "/digit-ui/employee/obps/search/application",
            businessService: "BPA",
            roles: ["BPAREG_EMPLOYEE", "BPAREG_APPROVER", "BPAREG_DOC_VERIFIER", "BPAREG_DOC_VERIFIER"],
          }]
    }

    const SearchFormFields = useCallback(({registerRef}) => <SearchFormFieldsComponents {...{registerRef}} />,[])

    const FilterFormFields = useCallback(
      ({registerRef, controlFilterForm}) => <FilterFormFieldsComponent {...{statuses, isInboxLoading, registerRef, controlFilterForm}} />
    ,[statuses, isInboxLoading])

    const onSearchFormSubmit = (data) => {
      dispatch({action: "mutateSearchForm", data})
      console.log("find search form data here", data)  
    }
    
    const onFilterFormSubmit = (data) => {
      debugger
      dispatch({action: "mutateFilterForm", data})
      console.log("find search form data here", data)
    }

    const propsForSearchForm = { SearchFormFields, onSearchFormSubmit, searchFormDefaultValues: formInitValue?.searchForm, resetSearchFormDefaultValues: searchFormDefaultValues }

    const propsForFilterForm = { FilterFormFields, onFilterFormSubmit, filterFormDefaultValues: formInitValue?.filterForm, resetFilterFormDefaultValues: filterFormDefaultValues }

    const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;
    const GetStatusCell = (value) => value === "Active" ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span> 
    
    const tableColumnConfig = useMemo(() => {
          return [
            {
              Header: t("TL_COMMON_TABLE_COL_APP_NO"),
              accessor: "applicationNo",
              Cell: ({ row }) => {
                return (
                  <div>
                    <Link to={`${parentRoute}/bpa/${row.original["applicationId"]}`}>
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

        const propsForInboxTable = useMemo(()=>{
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
        },[table, tableColumnConfig]) 

    return <InboxComposer {...{ isInboxLoading, PropsForInboxLinks, ...propsForSearchForm, ...propsForFilterForm, propsForInboxTable}}></InboxComposer>
}

export default Inbox