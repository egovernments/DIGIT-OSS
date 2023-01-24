import React, { Fragment, useCallback, useMemo, useReducer } from "react"
import { InboxComposer, DocumentIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import FilterFormFieldsComponent from "./FilterFieldsComponent";
import SearchFormFieldsComponents from "./SearchFieldsComponents";
import useInboxTableConfig from "./useInboxTableConfig";
import useInboxMobileCardsData from "./useInboxMobileDataCard";
// import { useHistory } from "react-router-dom";
const Inbox = ({ parentRoute }) => {

  const { t } = useTranslation()
  // const history = useHistory()
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const ulbs = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
  const userInfo = Digit.UserService.getUser().info;
  const userUlbs = ulbs
    .filter((ulb) => userInfo?.roles?.some((role) => role?.tenantId === ulb?.code))
    
  const statuses = [
    { code: "ALL", name: `${t("ES_COMMON_ALL")}` },
    { code: "ACTIVE", name: `${t("ES_COMMON_ACTIVE")}` },
    { code: "INACTIVE", name: `${t("ES_COMMON_INACTIVE")}` }
  ]

  const searchFormDefaultValues = {
    // tenantIds: tenantId,
    tenantIds:userUlbs[0],
    postedBy: "",
    title: ""
  }

  const filterFormDefaultValues = {
    status: statuses[0]
  }
  const tableOrderFormDefaultValues = {
    sortBy: "",
    limit: 10,
    offset: 0,
    sortOrder: "DESC"
  }

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
        break;
    }
  }
  const InboxObjectInSessionStorage = Digit.SessionStorage.get("CITIZENSURVEY.INBOX")
  
  const onSearchFormReset = (setSearchFormValue) => {
    setSearchFormValue("postedBy", "")
    setSearchFormValue("title", "")
    setSearchFormValue("tenantIds", tenantId)
    dispatch({ action: "mutateSearchForm", data: searchFormDefaultValues })
  }

  const onFilterFormReset = (setFilterFormValue) => {
    setFilterFormValue("status", statuses[0])
    dispatch({ action: "mutateFilterForm", data: filterFormDefaultValues })
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
      link: `/${window?.contextPath}/employee/engagement/surveys/inbox/create`,
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
    //setting the offset to 0(In case searched from page other than 1)
    dispatch({ action: "mutateTableForm", data: { ...formState.tableForm, offset:0 } })

    data.hasOwnProperty("") ? delete data?.[""] : null
    dispatch({ action: "mutateSearchForm", data })
  }

  const onFilterFormSubmit = (data) => {
    data.hasOwnProperty("") ? delete data?.[""] : null
    dispatch({ action: "mutateFilterForm", data })
  }

  const propsForSearchForm = { SearchFormFields, onSearchFormSubmit, searchFormDefaultValues: formState?.searchForm, resetSearchFormDefaultValues: searchFormDefaultValues, onSearchFormReset }

  const propsForFilterForm = { FilterFormFields, onFilterFormSubmit, filterFormDefaultValues: formState?.filterForm, resetFilterFormDefaultValues: filterFormDefaultValues, onFilterFormReset }

  const propsForInboxTable = useInboxTableConfig({ ...{ parentRoute, onPageSizeChange, formState, totalCount: TotalCount, table: Surveys, noResultsMessage: "CS_SURVEYS_NOT_FOUND", dispatch, inboxStyles:{overflowX:"scroll", overflowY:"hidden"} } })

  const propsForInboxMobileCards = useInboxMobileCardsData({parentRoute, table:Surveys})
  
  return <InboxComposer {...{ isInboxLoading, PropsForInboxLinks, ...propsForSearchForm, ...propsForFilterForm, propsForInboxMobileCards, propsForInboxTable, formState }}></InboxComposer>

}

export default Inbox