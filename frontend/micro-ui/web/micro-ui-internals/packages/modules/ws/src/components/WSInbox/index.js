import React, { Fragment, useCallback, useMemo, useReducer, useEffect } from "react";
import { InboxComposer, ComplaintIcon, Header, DropIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import SearchFormFieldsComponents from "./SearchFormFieldsComponent";
import FilterFormFieldsComponent from "./FilterFormFieldsComponent";
import useInboxTableConfig from "./useInboxTableConfig";
import useInboxMobileCardsData from "./useInboxMobileCardsData";
import { checkForEmployee } from "../../utils";

const WSInbox = ({ parentRoute }) => {
  const { t } = useTranslation();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const getUrlPathName = window.location.pathname;
  const checkPathName = getUrlPathName.includes("water/inbox");

  const searchFormDefaultValues = {
    mobileNumber: "",
    applicationNumber: "",
    consumerNo: "",
  };
  const filterFormDefaultValues = {
    businessService: checkPathName ? ["NewWS1", "ModifyWSConnection", "DisconnectWSConnection"] : ["NewSW1", "ModifySWConnection", "DisconnectSWConnection"],
    moduleName: checkPathName ? "ws-services" : "sw-services",
    locality: [],
    assignee: "ASSIGNED_TO_ALL",
    applicationStatus: [],
    applicationType: [],
  };
  const tableOrderFormDefaultValues = {
    sortBy: "createdTime",
    limit: window.Digit.Utils.browser.isMobile() ? 50 : 10,
    offset: 0,
    sortOrder: "ASC",
  };
  sessionStorage.removeItem("Digit.BILL.INBOX");
  sessionStorage.removeItem("Digit.SW.INBOX");

  function formReducer(state, payload) {
    if (checkPathName) {
      switch (payload.action) {
        case "mutateSearchForm":
          Digit.SessionStorage.set("BILL.INBOX", { ...state, searchForm: payload.data });
          return { ...state, searchForm: payload.data };
        case "mutateFilterForm":
          Digit.SessionStorage.set("BILL.INBOX", { ...state, filterForm: payload.data });
          return { ...state, filterForm: payload.data };
        case "mutateTableForm":
          Digit.SessionStorage.set("BILL.INBOX", { ...state, tableForm: payload.data });
          return { ...state, tableForm: payload.data };
        default:
          break;
      }
    } else {
      switch (payload.action) {
        case "mutateSearchForm":
          Digit.SessionStorage.set("BILL.SW.INBOX", { ...state, searchForm: payload.data });
          return { ...state, searchForm: payload.data };
        case "mutateFilterForm":
          Digit.SessionStorage.set("BILL.SW.INBOX", { ...state, filterForm: payload.data });
          return { ...state, filterForm: payload.data };
        case "mutateTableForm":
          Digit.SessionStorage.set("BILL.SW.INBOX", { ...state, tableForm: payload.data });
          return { ...state, tableForm: payload.data };
        default:
          break;
      }
    }
  }

  const InboxObjectInSessionStorage = Digit.SessionStorage.get("BILL.INBOX");

  const onSearchFormReset = (setSearchFormValue) => {
    setSearchFormValue("mobileNumber", null);
    setSearchFormValue("applicationNumber", null);
    setSearchFormValue("consumerNo", null);
    dispatch({ action: "mutateSearchForm", data: searchFormDefaultValues });
  };

  const onFilterFormReset = (setFilterFormValue) => {
    setFilterFormValue("moduleName", checkPathName ? "ws-services" : "sw-services");
    setFilterFormValue("applicationStatus", []);
    setFilterFormValue("applicationType", []);

    setFilterFormValue("locality", []);
    setFilterFormValue("assignee", "ASSIGNED_TO_ALL");
    dispatch({ action: "mutateFilterForm", data: filterFormDefaultValues });
  };

  const onSortFormReset = (setSortFormValue) => {
    setSortFormValue("sortOrder", "DESC");
    dispatch({ action: "mutateTableForm", data: tableOrderFormDefaultValues });
  };

  const formInitValue = useMemo(() => {
    return (
      InboxObjectInSessionStorage || {
        filterForm: filterFormDefaultValues,
        searchForm: searchFormDefaultValues,
        tableForm: tableOrderFormDefaultValues,
      }
    );
  }, [
    Object.values(InboxObjectInSessionStorage?.filterForm || {}),
    Object.values(InboxObjectInSessionStorage?.searchForm || {}),
    Object.values(InboxObjectInSessionStorage?.tableForm || {}),
  ]);

  const [formState, dispatch] = useReducer(formReducer, formInitValue);

  const onPageSizeChange = (e) => {
    dispatch({ action: "mutateTableForm", data: { ...formState.tableForm, limit: e.target.value } });
  };
  const onSortingByData = (e) => {
    if (e.length > 0) {
      const [{ id, desc }] = e;
      const sortOrder = desc ? "DESC" : "ASC";
      const sortBy = id;
      if (!(formState.tableForm.sortBy === sortBy && formState.tableForm.sortOrder === sortOrder)) {
        dispatch({ action: "mutateTableForm", data: { ...formState.tableForm, sortBy: id, sortOrder: desc ? "DESC" : "ASC" } });
      }
    }
  };

  const onMobileSortOrderData = (data) => {
    const { sortOrder } = data;
    dispatch({ action: "mutateTableForm", data: { ...formState.tableForm, sortOrder } });
  };

  const { data: localitiesForEmployeesCurrentTenant, isLoading: loadingLocalitiesForEmployeesCurrentTenant } = Digit.Hooks.useBoundaryLocalities(
    tenantId,
    "revenue",
    {},
    t
  );

  const { isLoading: isInboxLoading, data: { table, statuses, totalCount } = {} } = Digit.Hooks.ws.useInbox({
    tenantId,
    filters: { ...formState },
  });
  let links = [
    {
      text: t("WS_APPLY_NEW_CONNECTION_HOME_CARD_LABEL"),
      link: `/digit-ui/employee/ws/create-application`,
      roles: ["WS_CEMP", "SW_CEMP"],
    },
  ];

  links = links.filter((link) => (link.roles ? checkForEmployee(link.roles) : true));
  const PropsForInboxLinks = {
    logoIcon: <DropIcon />,
    headerText: checkPathName ? "MODULE_WATER" : "MODULE_SW",
    links: [
      ...links,
      {
        text: t("WS_SEWERAGE_CONNECTION_SEARCH_LABEL"),
        link: checkPathName
          ? `/digit-ui/employee/ws/water/search-connection?from=WS_SEWERAGE_INBOX`
          : `/digit-ui/employee/ws/sewerage/search-connection?from=WS_SEWERAGE_INBOX`,
        roles: checkPathName
          ? ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"]
          : ["SW_CEMP", "SW_APPROVER", "SW_FIELD_INSPECTOR", "SW_DOC_VERIFIER", "SW_CLERK"],
      },
      {
        text: t("WS_SEWERAGE_APPLICATION_SEARCH"),
        link: checkPathName
          ? `/digit-ui/employee/ws/water/search-application?from=WS_SEWERAGE_INBOX`
          : `/digit-ui/employee/ws/sewerage/search-application?from=WS_SEWERAGE_INBOX`,
        roles: checkPathName
          ? ["WS_CEMP", "WS_APPROVER", "WS_FIELD_INSPECTOR", "WS_DOC_VERIFIER", "WS_CLERK"]
          : ["SW_CEMP", "SW_APPROVER", "SW_FIELD_INSPECTOR", "SW_DOC_VERIFIER", "SW_CLERK"],
      },
    ],
  };

  const SearchFormFields = useCallback(
    ({ registerRef, searchFormState }) => <SearchFormFieldsComponents {...{ registerRef, searchFormState }} className="search" />,
    []
  );

  const FilterFormFields = useCallback(
    ({ registerRef, controlFilterForm, setFilterFormValue, getFilterFormValue }) => (
      <FilterFormFieldsComponent
        {...{
          statuses,
          isInboxLoading,
          registerRef,
          controlFilterForm,
          setFilterFormValue,
          filterFormState: formState?.filterForm,
          getFilterFormValue,
          localitiesForEmployeesCurrentTenant,
          loadingLocalitiesForEmployeesCurrentTenant,
          checkPathName,
        }}
      />
    ),
    [statuses, isInboxLoading, localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant]
  );

  const onSearchFormSubmit = (data) => {
    data.hasOwnProperty("") && delete data?.[""];
    dispatch({ action: "mutateTableForm", data: { ...tableOrderFormDefaultValues } });
    dispatch({ action: "mutateSearchForm", data });
  };

  const onFilterFormSubmit = (data) => {
    data.hasOwnProperty("") && delete data?.[""] ;
    dispatch({ action: "mutateTableForm", data: { ...tableOrderFormDefaultValues } });
    dispatch({ action: "mutateFilterForm", data });
  };

  const propsForSearchForm = {
    SearchFormFields,
    onSearchFormSubmit,
    searchFormDefaultValues: formState?.searchForm,
    resetSearchFormDefaultValues: searchFormDefaultValues,
    onSearchFormReset,
    className: "search-form-wns-inbox",
  };

  const propsForFilterForm = {
    FilterFormFields,
    onFilterFormSubmit,
    filterFormDefaultValues: formState?.filterForm,
    resetFilterFormDefaultValues: filterFormDefaultValues,
    onFilterFormReset,
  };

  const propsForInboxTable = useInboxTableConfig({ ...{ parentRoute, onPageSizeChange, formState, totalCount, table, dispatch, onSortingByData,tenantId, inboxStyles:{overflowX:"scroll", overflowY:"hidden"}, tableStyle:{width:"70%"} } });


  const propsForInboxMobileCards = useInboxMobileCardsData({ parentRoute, table });

  const propsForMobileSortForm = { onMobileSortOrderData, sortFormDefaultValues: formState?.tableForm, onSortFormReset };

  return (
    <>
      <Header>
        {t("ES_COMMON_INBOX")}
        {totalCount ? <p className="inbox-count">{totalCount}</p> : null}
      </Header>
      <InboxComposer
        {...{
          isInboxLoading,
          PropsForInboxLinks,
          ...propsForSearchForm,
          ...propsForFilterForm,
          ...propsForMobileSortForm,
          propsForInboxTable,
          propsForInboxMobileCards,
          formState,
        }}
      ></InboxComposer>
    </>
  );
};

export default WSInbox;
