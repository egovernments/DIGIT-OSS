import React, { Fragment, useCallback, useMemo, useReducer } from "react";
import { InboxComposer, ComplaintIcon, Header, CollectionIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import SearchFormFieldsComponents from "./SearchFormFieldsComponent";
import FilterFormFieldsComponent from "./FilterFormFieldsComponent";
import useInboxTableConfig from "./useInboxTableConfig";
import useInboxMobileCardsData from "./useInboxMobileCardsData";

const Inbox = ({ parentRoute }) => {
  const { t } = useTranslation();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const checkPathName = window.location.href.includes("/ws/water/bill-amendment/inbox");

  const searchFormDefaultValues = {
    mobileNumber: "",
    applicationNumber: "",
    consumerCode: "",
  };

  const filterFormDefaultValues = {
    applicationStatus: [],
    businessService: checkPathName ? ["WS.AMENDMENT"] : ["SW.AMENDMENT"],
    moduleName: checkPathName ? "bsWs-service" : "bsSw-service",
    locality: [],
    assignee: "ASSIGNED_TO_ALL",
  };
  const tableOrderFormDefaultValues = {
    sortBy: "createdTime",
    limit: window.Digit.Utils.browser.isMobile() ? 50 : 10,
    offset: 0,
    sortOrder: "ASC",
  };

  sessionStorage.removeItem("Digit.BILL.AMENDMENT.INBOX");

  function formReducer(state, payload) {
    switch (payload.action) {
      case "mutateSearchForm":
        Digit.SessionStorage.set("BILL.AMENDMENT.INBOX", { ...state, searchForm: payload.data });
        return { ...state, searchForm: payload.data };
      case "mutateFilterForm":
        Digit.SessionStorage.set("BILL.AMENDMENT.INBOX", { ...state, filterForm: payload.data });
        return { ...state, filterForm: payload.data };
      case "mutateTableForm":
        Digit.SessionStorage.set("BILL.AMENDMENT.INBOX", { ...state, tableForm: payload.data });
        return { ...state, tableForm: payload.data };
      default:
        break;
    }
  }
  const InboxObjectInSessionStorage = Digit.SessionStorage.get("BILL.AMENDMENT.INBOX");

  const onSearchFormReset = (setSearchFormValue) => {
    setSearchFormValue("mobileNumber", null);
    setSearchFormValue("applicationNo", null);
    setSearchFormValue("consumerCode", null);
    dispatch({ action: "mutateSearchForm", data: searchFormDefaultValues });
  };

  const onFilterFormReset = (setFilterFormValue) => {
    setFilterFormValue("moduleName", checkPathName ? "bsWs-service" : "bsSw-service");
    setFilterFormValue("locality", []);
    setFilterFormValue("assignee", "ASSIGNED_TO_ALL");
    setFilterFormValue("applicationStatus", []);
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
  const { isLoading: isInboxLoading, data: { table, statuses, totalCount } = {} } = Digit.Hooks.useBillAmendmentInbox({
    tenantId,
    filters: { ...formState },
    config : { cacheTime : 0}
  });

  const { data: statusData, isLoading } = Digit.Hooks.useApplicationStatusGeneral({ businessServices: ["WS.AMENDMENT","SW.AMENDMENT"], tenantId }, { enabled: statuses?.length>0});
  
  statuses?.map(status => {
    statusData?.otherRoleStates?.map(state=>{
      if(state?.uuid===status?.statusid){
        status["applicationstatus"] = t(state?.state)
      }
    })
    statusData?.userRoleStates?.map(state => {
      if (state?.uuid === status?.statusid) {
        status["applicationstatus"] = t(state?.state)
      }
    })
  } )


  const PropsForInboxLinks = {
    logoIcon: <CollectionIcon />,
    headerText: "ACTION_TEST_BILLAMENDMENT",
    links: [
      //UM-5603 As requested by PO
      // {
      //   text: t("ACTION_TEST_REPORTS"),
      //   link: "/digit-ui/employee/ws/reports",
      // },
      // {
      //   text: t("ACTION_TEST_DASHBOARD"),
      //   link: "/digit-ui/employee/ws/dashboards",
      // },
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
        }}
      />
    ),
    [statuses, isInboxLoading, localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant,statusData]
  );

  const onSearchFormSubmit = (data) => {
    data.hasOwnProperty("") && delete data?.[""];
    dispatch({ action: "mutateTableForm", data: { ...tableOrderFormDefaultValues } });
    dispatch({ action: "mutateSearchForm", data });
  };

  const onFilterFormSubmit = (data) => {
    data.hasOwnProperty("") && delete data?.[""];
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

  const propsForInboxTable = useInboxTableConfig({ ...{ parentRoute, onPageSizeChange, formState, totalCount, table, dispatch, onSortingByData, inboxStyles:{overflowX:"scroll", overflowY:"hidden"}, tableStyle:{width:"70%"} } });

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

export default Inbox;
