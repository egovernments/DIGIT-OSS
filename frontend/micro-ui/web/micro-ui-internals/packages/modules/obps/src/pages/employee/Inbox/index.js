import React, {Fragment, useCallback, useEffect, useMemo, useReducer } from "react"
import { InboxComposer, CaseIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import FilterFormFieldsComponent from "./FilterFormFieldsComponent";
import SearchFormFieldsComponents from "./SearchFormFieldsComponent";
import useInboxTableConfig from "./useInboxTableConfig";

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
    
    const onSearchFormReset = (setSearchFormValue) =>{
      setSearchFormValue("mobileNumber", null)
      setSearchFormValue("applicationNo", null)
    }

    const onFilterFormReset = (setFilterFormValue) =>{
      setFilterFormValue("moduleName", "bpa-services")
      setFilterFormValue("businessService", {code: "BPA", name:t("BPA")})
      setFilterFormValue("applicationStatus", "")
      setFilterFormValue("locality", [])
      setFilterFormValue("assignee", "ASSIGNED_TO_ALL")
    }

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
      ({registerRef, controlFilterForm, setFilterFormValue}) => <FilterFormFieldsComponent {...{statuses, isInboxLoading, registerRef, controlFilterForm, setFilterFormValue, filterFormState: formState?.filterForm}} />
    ,[statuses, isInboxLoading])

    const onSearchFormSubmit = (data) => {
      dispatch({action: "mutateSearchForm", data})
      console.log("find search form data here", data)  
    }
    
    const onFilterFormSubmit = (data,setFilterFormValue) => {
      dispatch({action: "mutateFilterForm", data})
      console.log("find search form data here", data)
    }

    const propsForSearchForm = { SearchFormFields, onSearchFormSubmit, searchFormDefaultValues: formState?.searchForm, resetSearchFormDefaultValues: searchFormDefaultValues, onSearchFormReset }

    const propsForFilterForm = { FilterFormFields, onFilterFormSubmit, filterFormDefaultValues: formState?.filterForm, resetFilterFormDefaultValues: filterFormDefaultValues, onFilterFormReset }

    const propsForInboxTable = useInboxTableConfig({...{ parentRoute, onPageSizeChange, formState, totalCount, table}})

    return <InboxComposer {...{ isInboxLoading, PropsForInboxLinks, ...propsForSearchForm, ...propsForFilterForm, propsForInboxTable}}></InboxComposer>
}

export default Inbox