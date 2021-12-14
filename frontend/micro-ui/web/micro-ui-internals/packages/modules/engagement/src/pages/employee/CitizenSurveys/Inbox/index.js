import React, { Fragment, useCallback, useMemo, useReducer } from "react"
import { InboxComposer, DocumentIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import FilterFormFieldsComponent from "./FilterFieldsComponent";
import SearchFormFieldsComponents from "./SearchFieldsComponents";
import useInboxTableConfig from "./useInboxTableConfig";
import useInboxMobileCardsData from "./useInboxMobileDataCard";

const Inbox = ({ parentRoute }) => {

  const { t } = useTranslation()

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const searchFormDefaultValues = {
    tenantIds: tenantId,
    postedBy: "",
    title: ""
  }

  const filterFormDefaultValues = {
    status: ""
  }
  const tableOrderFormDefaultValues = {
    sortBy: "",
    limit: 10,
    offset: 0,
    sortOrder: "DESC"
  }

  const statuses = [
    { code: "ALL", name: `${t("ES_COMMON_ALL")}` },
    { code: "ACTIVE", name: `${t("ES_COMMON_ACTIVE")}` },
    { code: "INACTIVE", name: `${t("ES_COMMON_INACTIVE")}` }
  ]

  function formReducer(state, payload) {
    switch (payload.action) {
      case "mutateSearchForm":
        Digit.SessionStorage.set("CITIZENSURVEY.INBOX", { ...state, searchForm: payload.data })
        return { ...state, searchForm: payload.data };
      case "mutateFilterForm":
        Digit.SessionStorage.set("CITIZENSURVEY.INBOX", { ...state, filterForm: payload.data })
        return { ...state, filterForm: payload.data };
      case "mutateTableForm":
        Digit.SessionStorage.set("CITIZENSURVEY.INBOX", { ...state, tableForm: payload.data })
        return { ...state, tableForm: payload.data };
      default:
        console.warn("dispatched action has nothing to reduce")
    }
  }
  const InboxObjectInSessionStorage = Digit.SessionStorage.get("CITIZENSURVEY.INBOX")

  const onSearchFormReset = (setSearchFormValue) => {
    setSearchFormValue("postedBy", "")
    setSearchFormValue("title", "")
    setSearchFormValue("tenantIds", tenantId)
  }

  const onFilterFormReset = (setFilterFormValue) => {
    setFilterFormValue("status", "")

  }

  const formInitValue = useMemo(() => {
    return InboxObjectInSessionStorage || {
      filterForm: filterFormDefaultValues,
      searchForm: searchFormDefaultValues,
      tableForm: tableOrderFormDefaultValues
    }
  }
    , [Object.values(InboxObjectInSessionStorage?.filterForm || {}), Object.values(InboxObjectInSessionStorage?.searchForm || {}), Object.values(InboxObjectInSessionStorage?.tableForm || {})])

  const [formState, dispatch] = useReducer(formReducer, formInitValue)
  const onPageSizeChange = (e) => {
    dispatch({ action: "mutateTableForm", data: { ...formState.tableForm, limit: e.target.value } })
  }

  const { data: { Surveys, TotalCount } = {}, isLoading: isInboxLoading, } = Digit.Hooks.survey.useSurveyInbox(formState)

  const PropsForInboxLinks = {
    logoIcon: <DocumentIcon />,
    headerText: "CS_COMMON_SURVEYS",
    links: [{
      text: t("CS_COMMON_NEW_SURVEY"),
      link: "/digit-ui/employee/engagement/surveys/inbox/create",
    }]
  }

  const SearchFormFields = useCallback(({ registerRef, searchFormState, controlSearchForm }) => <SearchFormFieldsComponents {...{ registerRef, searchFormState, controlSearchForm }} />, [])

  const FilterFormFields = useCallback(
    ({ registerRef, controlFilterForm, setFilterFormValue, getFilterFormValue }) => <FilterFormFieldsComponent
      {...{
        statuses,
        registerRef,
        controlFilterForm,
        setFilterFormValue,
        filterFormState: formState?.filterForm,
        getFilterFormValue,
      }} />
    , [statuses])

  const onSearchFormSubmit = (data) => {
    data.hasOwnProperty("") ? delete data?.[""] : null
    dispatch({ action: "mutateSearchForm", data })
    //console.log("find search form data here", data)
  }

  const onFilterFormSubmit = (data) => {
    data.hasOwnProperty("") ? delete data?.[""] : null
    dispatch({ action: "mutateFilterForm", data })
    //console.log("find filter form data here", data)
  }

  const propsForSearchForm = { SearchFormFields, onSearchFormSubmit, searchFormDefaultValues: formState?.searchForm, resetSearchFormDefaultValues: searchFormDefaultValues, onSearchFormReset }

  const propsForFilterForm = { FilterFormFields, onFilterFormSubmit, filterFormDefaultValues: formState?.filterForm, resetFilterFormDefaultValues: filterFormDefaultValues, onFilterFormReset }

  const propsForInboxTable = useInboxTableConfig({ ...{ parentRoute, onPageSizeChange, formState, totalCount: TotalCount, table: Surveys, noResultsMessage: "CS_SURVEYS_NOT_FOUND", dispatch } })

  const propsForInboxMobileCards = useInboxMobileCardsData({parentRoute, table:Surveys})
  
  return <InboxComposer {...{ isInboxLoading, PropsForInboxLinks, ...propsForSearchForm, ...propsForFilterForm, propsForInboxMobileCards, propsForInboxTable, formState }}></InboxComposer>
}

export default Inbox