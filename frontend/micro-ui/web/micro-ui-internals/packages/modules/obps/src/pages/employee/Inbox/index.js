import React, {Fragment, useCallback, useMemo, useReducer } from "react"
import { InboxComposer, CaseIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import FilterFormFieldsComponent from "./FilterFormFieldsComponent";
import SearchFormFieldsComponents from "./SearchFormFieldsComponent";
import useInboxTableConfig from "./useInboxTableConfig";
import useInboxMobileCardsData from "./useInboxMobileCardsData";

const Inbox = ({parentRoute}) => {
    
    const { t } = useTranslation()

    const tenantId = Digit.ULBService.getCurrentTenantId();

    const searchFormDefaultValues = {}

    const filterFormDefaultValues = {
      moduleName: "bpa-services",
      applicationStatus: "",
      locality: [],
      assignee: "ASSIGNED_TO_ALL",
      applicationType: []
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
      setSearchFormValue("mobileNumber", null);
      setSearchFormValue("applicationNo", null);
      dispatch({action: "mutateSearchForm", data: searchFormDefaultValues});
    }

    const onFilterFormReset = (setFilterFormValue) =>{
      setFilterFormValue("moduleName", "bpa-services");
      setFilterFormValue("applicationStatus", "");
      setFilterFormValue("locality", []);
      setFilterFormValue("assignee", "ASSIGNED_TO_ALL");
      setFilterFormValue("applicationType", []);
      dispatch({action: "mutateFilterForm", data: filterFormDefaultValues});
    }

    const formInitValue = useMemo(() => {
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
    const onSortingByData = (e) => {
      if(e.length > 0){
        const [{id, desc}] = e
        const sortOrder = desc ? "DESC" : "ASC"
        const sortBy = id
        if(!(formState.tableForm.sortBy === sortBy && formState.tableForm.sortOrder === sortOrder)){
          dispatch({action: "mutateTableForm", data:{ ...formState.tableForm, sortBy: id, sortOrder: desc ? "DESC" : "ASC" }})
        }
      }
    }

    const { data: applicationTypesOfBPA, isLoading: loadingApplicationTypesOfBPA } = Digit.Hooks.obps.SearchMdmsTypes.useApplicationTypes(tenantId);

    const { data: localitiesForEmployeesCurrentTenant, isLoading: loadingLocalitiesForEmployeesCurrentTenant } = Digit.Hooks.useBoundaryLocalities(tenantId, "revenue", {}, t);

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

    const SearchFormFields = useCallback(({registerRef, searchFormState}) => <SearchFormFieldsComponents {...{registerRef, searchFormState}} />,[])

    const FilterFormFields = useCallback(
      ({registerRef, controlFilterForm, setFilterFormValue, getFilterFormValue}) => <FilterFormFieldsComponent {...{statuses, isInboxLoading, registerRef, controlFilterForm, setFilterFormValue, filterFormState: formState?.filterForm, getFilterFormValue, applicationTypesOfBPA, loadingApplicationTypesOfBPA, localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant}} />
    ,[statuses, isInboxLoading, applicationTypesOfBPA, loadingApplicationTypesOfBPA, localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant])

    const onSearchFormSubmit = (data) => {
      data.hasOwnProperty("") ? delete data?.[""] : null
      dispatch({action: "mutateSearchForm", data})
      console.log("find search form data here", data)  
    }
    
    const onFilterFormSubmit = (data) => {
      data.hasOwnProperty("") ? delete data?.[""] : null
      dispatch({action: "mutateFilterForm", data})
      console.log("find search form data here", data)
    }

    const propsForSearchForm = { SearchFormFields, onSearchFormSubmit, searchFormDefaultValues: formState?.searchForm, resetSearchFormDefaultValues: searchFormDefaultValues, onSearchFormReset }

    const propsForFilterForm = { FilterFormFields, onFilterFormSubmit, filterFormDefaultValues: formState?.filterForm, resetFilterFormDefaultValues: filterFormDefaultValues, onFilterFormReset }

    const propsForInboxTable = useInboxTableConfig({...{ parentRoute, onPageSizeChange, formState, totalCount, table, dispatch, onSortingByData}})

    const propsForInboxMobileCards = useInboxMobileCardsData({parentRoute, table})

    return <InboxComposer {...{ isInboxLoading, PropsForInboxLinks, ...propsForSearchForm, ...propsForFilterForm, propsForInboxTable, propsForInboxMobileCards, formState}}></InboxComposer>
}

export default Inbox