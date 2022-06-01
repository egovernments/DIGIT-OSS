import React, {Fragment, useCallback, useMemo, useReducer} from "react"
import { InboxComposer, ComplaintIcon, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import SearchFormFieldsComponents from "./SearchFormFieldsComponent";
import FilterFormFieldsComponent from "./FilterFormFieldsComponent";
import useInboxTableConfig from "./useInboxTableConfig";
import useInboxMobileCardsData from "./useInboxMobileCardsData";
import { businessServiceList } from "../../../utils";

const Inbox = ({parentRoute}) => {
    
    const { t } = useTranslation()

    const tenantId = Digit.ULBService.getCurrentTenantId();

    const searchFormDefaultValues = {
      // mobileNumber: "",
      // applicationNumber
    }

    const filterFormDefaultValues = {
      moduleName: "noc-services",
      applicationStatus: [],
      businessService: null,
      locality: [],
      assignee: "ASSIGNED_TO_ALL",
      businessServiceArray: businessServiceList(true) || []
    }
    const tableOrderFormDefaultValues = {
      sortBy: "",
      limit: window.Digit.Utils.browser.isMobile()?50:10,
      offset: 0,
      sortOrder: "DESC"
    }

    function formReducer(state, payload) {
      switch(payload.action){
        case "mutateSearchForm":
          Digit.SessionStorage.set("NOC.INBOX", {...state, searchForm: payload.data})
          return {...state, searchForm: payload.data};
        case "mutateFilterForm":
          Digit.SessionStorage.set("NOC.INBOX", {...state, filterForm: payload.data})
          return {...state, filterForm: payload.data};
        case "mutateTableForm":
          Digit.SessionStorage.set("NOC.INBOX", {...state, tableForm: payload.data})
          return {...state, tableForm: payload.data};
        default:
          break;      
        }
    }
    const InboxObjectInSessionStorage = Digit.SessionStorage.get("NOC.INBOX")
    
    const onSearchFormReset = (setSearchFormValue) =>{
      setSearchFormValue("sourceRefId", null);
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

    const onSortFormReset = (setSortFormValue) => {
      setSortFormValue("sortOrder", "DESC")
      dispatch({action: "mutateTableForm", data: tableOrderFormDefaultValues})
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
    
    const onMobileSortOrderData = (data) => {
      const {sortOrder} = data
      dispatch({action: "mutateTableForm", data:{ ...formState.tableForm, sortOrder }})
    }

    const { data: localitiesForEmployeesCurrentTenant, isLoading: loadingLocalitiesForEmployeesCurrentTenant } = Digit.Hooks.useBoundaryLocalities(tenantId, "revenue", {}, t);

    const { isLoading: isInboxLoading, data: {table , statuses, totalCount} = {} } = Digit.Hooks.noc.useInbox({
        tenantId,
        filters: { ...formState }
    });
    const PropsForInboxLinks = {
        logoIcon: <ComplaintIcon />,
        headerText: "ACTION_TEST_NOC",
        links: [{
          text: t("ES_COMMON_APPLICATION_SEARCH"),
          link: "/digit-ui/employee/noc/search",
        }]
    }

    const SearchFormFields = useCallback(({registerRef, searchFormState, searchFieldComponents}) => <SearchFormFieldsComponents {...{registerRef, searchFormState, searchFieldComponents}} />,[])

    const FilterFormFields = useCallback(
      ({registerRef, controlFilterForm, setFilterFormValue, getFilterFormValue}) => <FilterFormFieldsComponent {...{statuses, isInboxLoading, registerRef, controlFilterForm, setFilterFormValue, filterFormState: formState?.filterForm, getFilterFormValue, localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant}} />
    ,[statuses, isInboxLoading, localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant])


    const onSearchFormSubmit = (data) => {
      data.hasOwnProperty("") && delete data?.[""] ;
      dispatch({ action: "mutateTableForm", data: { ...tableOrderFormDefaultValues } });
      dispatch({action: "mutateSearchForm", data})
    }
    
    const onFilterFormSubmit = (data) => {
      data.hasOwnProperty("") && delete data?.[""] ;
      dispatch({ action: "mutateTableForm", data: { ...tableOrderFormDefaultValues } });
      dispatch({action: "mutateFilterForm", data})
    }

    const propsForSearchForm = { SearchFormFields, onSearchFormSubmit, searchFormDefaultValues: formState?.searchForm, resetSearchFormDefaultValues: searchFormDefaultValues, onSearchFormReset }

    const propsForFilterForm = { FilterFormFields, onFilterFormSubmit, filterFormDefaultValues: formState?.filterForm, resetFilterFormDefaultValues: filterFormDefaultValues, onFilterFormReset }

    const propsForInboxTable = useInboxTableConfig({...{ parentRoute, onPageSizeChange, formState, totalCount, table, dispatch, onSortingByData}})

    const propsForInboxMobileCards = useInboxMobileCardsData({parentRoute, table})

    const propsForMobileSortForm = { onMobileSortOrderData, sortFormDefaultValues: formState?.tableForm, onSortFormReset }

    return <>
      <Header>
        {t("ES_COMMON_INBOX")}
        {totalCount ? <p className="inbox-count">{totalCount}</p> : null}
      </Header>
      <InboxComposer {...{ isInboxLoading, PropsForInboxLinks, ...propsForSearchForm, ...propsForFilterForm, ...propsForMobileSortForm, propsForInboxTable, propsForInboxMobileCards, formState}}></InboxComposer>
    </>
}

export default Inbox