import { CaseIcon, Header, InboxComposer } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useCallback, useMemo, useReducer } from "react";
import { useTranslation } from "react-i18next";
import FilterFormFieldsComponent from "./FilterFormFieldsComponent";
import SearchFormFieldsComponents from "./SearchFormFieldsComponent";
import useInboxMobileCardsData from "./useInboxMobileCardsData";
import useInboxTableConfig from "./useInboxTableConfig";

const Inbox = ({ parentRoute }) => {
  window.scroll(0, 0);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchFormDefaultValues = {};
  const filterFormDefaultValues = {
    appliactionType: "",
    status: "",
  };
  const tableOrderFormDefaultValues = {
    sortBy: "createdDate",
    limit: Digit.Utils.browser.isMobile() ? 50 : 10,
    offset: 0,
    sortOrder: "DESC",
  };

  function formReducer(state, payload) {
    switch (payload.action) {
      case "mutateSearchForm":
        Digit.SessionStorage.set("EDCR.INBOX", { ...state, searchForm: payload.data });
        return { ...state, searchForm: payload.data };
      case "mutateFilterForm":
        Digit.SessionStorage.set("EDCR.INBOX", { ...state, filterForm: payload.data });
        return { ...state, filterForm: payload.data };
      case "mutateTableForm":
        Digit.SessionStorage.set("EDCR.INBOX", { ...state, tableForm: payload.data });
        return { ...state, tableForm: payload.data };
      default:
        break;
    }
  }
  const InboxObjectInSessionStorage = Digit.SessionStorage.get("EDCR.INBOX");

  const onSearchFormReset = (setSearchFormValue) => {
    setSearchFormValue("edcrNumber", null);
    setSearchFormValue("applicationNumber", null);
    dispatch({ action: "mutateSearchForm", data: searchFormDefaultValues });
  };

  const onFilterFormReset = (setFilterFormValue) => {
    setFilterFormValue("status", "");
    setFilterFormValue("appliactionType", "");
    dispatch({ action: "mutateFilterForm", data: filterFormDefaultValues });
  };

  const onSortFormReset = (setSortFormValue) => {
    setSortFormValue("sortOrder", "DESC");
    dispatch({ action: "mutateTableForm", data: tableOrderFormDefaultValues });
  };

  const formInitValue = useMemo(() => {
    const inboxFromhomePage = Digit.SessionStorage.get("EDCR_BACK");
    if (inboxFromhomePage === "IS_EDCR_BACK") {
      return (
        {
          filterForm: filterFormDefaultValues,
          searchForm: searchFormDefaultValues,
          tableForm: tableOrderFormDefaultValues,
        }
      );
    }

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

  const { isLoading: isInboxLoading, data: { table, totalCount } = {} } = Digit.Hooks.obps.useEDCRInbox({
    tenantId,
    filters: { ...formState },
  });

  const PropsForInboxLinks = {
    logoIcon: <CaseIcon />,
    headerText: "ACTION_TEST_EDCR_SCRUTINY",
    links: [
      {
        link: `/digit-ui/citizen/obps/edcrscrutiny/apply`,
        text: t("BPA_PLAN_SCRUTINY_FOR_NEW_CONSTRUCTION_LABEL"),
      },
      {
        link: `/digit-ui/citizen/obps/edcrscrutiny/oc-apply`,
        text: t("BPA_OC_PLAN_SCRUTINY_FOR_NEW_CONSTRUCTION_LABEL"),
      },
    ],
  };

  const SearchFormFields = useCallback(
    ({ registerRef, searchFormState, searchFieldComponents }) => <SearchFormFieldsComponents {...{ registerRef, searchFormState, searchFieldComponents }} />,
    []
  );

  const FilterFormFields = useCallback(
    ({ registerRef, controlFilterForm, setFilterFormValue, getFilterFormValue }) => (
      <FilterFormFieldsComponent
        {...{
          isInboxLoading,
          registerRef,
          controlFilterForm,
          setFilterFormValue,
          filterFormState: formState?.filterForm,
          getFilterFormValue,
        }}
      />
    ),
    [isInboxLoading]
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
  };

  const propsForFilterForm = {
    FilterFormFields,
    onFilterFormSubmit,
    filterFormDefaultValues: formState?.filterForm,
    resetFilterFormDefaultValues: filterFormDefaultValues,
    onFilterFormReset,
  };

  const propsForInboxTable = useInboxTableConfig({ ...{ parentRoute, onPageSizeChange, formState, totalCount, table, dispatch, onSortingByData } });

  const propsForInboxMobileCards = useInboxMobileCardsData({ table });

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
