import React, { Fragment, useCallback, useEffect, useMemo, useReducer } from "react";
import InboxLinks from "../../atoms/InboxLinks";
import Table from "../../atoms/Table";
import { SearchField, SearchForm } from "../../molecules/SearchForm";
import { FilterForm, FilterFormField } from "../../molecules/FilterForm";
import SubmitBar from "../../atoms/SubmitBar";
import { useTranslation } from "react-i18next";
import Card from "../../atoms/Card";
import { Loader } from "../../atoms/Loader";
import { useForm, Controller } from "react-hook-form";
import SearchAction from "../../molecules/SearchAction";
import FilterAction from "../../molecules/FilterAction";
import SortAction from "../../molecules/SortAction";
import DetailsCard from "../../molecules/DetailsCard";
import PopUp from "../../atoms/PopUp";
import { CloseSvg } from "../../atoms/svgindex";
import MobileComponentDirectory from "./MobileComponentDirectory";

const InboxComposer = ({
  isInboxLoading,
  PropsForInboxLinks,
  SearchFormFields,
  searchFormDefaultValues,
  onSearchFormSubmit,
  onSearchFormReset,
  resetSearchFormDefaultValues,
  FilterFormFields,
  filterFormDefaultValues,
  propsForInboxTable,
  propsForInboxMobileCards,
  onFilterFormSubmit,
  onFilterFormReset,
  resetFilterFormDefaultValues,
  onMobileSortOrderData,
  sortFormDefaultValues,
  onSortFormReset,
  formState: inboxFormState,
  className,
}) => {
  const { t } = useTranslation();

  function activateModal(state, action) {
    switch (action.type) {
      case "set":
        return action.payload;
      case "remove":
        return false;
      default:
        break;
    }
  }

  const [currentlyActiveMobileModal, setActiveMobileModal] = useReducer(activateModal, false);

  const closeMobilePopupModal = () => {
    setActiveMobileModal({ type: "remove" });
  };

  const {
    register: registerSearchFormField,
    control: controlSearchForm,
    handleSubmit: handleSearchFormSubmit,
    setValue: setSearchFormValue,
    getValues: getSearchFormValue,
    reset: resetSearchForm,
    formState: searchFormState,
    clearErrors: clearSearchFormErrors,
  } = useForm({
    defaultValues: { ...searchFormDefaultValues },
  });

  const {
    register: registerFilterFormField,
    control: controlFilterForm,
    handleSubmit: handleFilterFormSubmit,
    setValue: setFilterFormValue,
    getValues: getFilterFormValue,
    reset: resetFilterForm,
  } = useForm({
    defaultValues: { ...filterFormDefaultValues },
  });

  const onResetFilterForm = () => {
    onFilterFormReset(setFilterFormValue);
  };

  const onResetSearchForm = () => {
    onSearchFormReset(setSearchFormValue);
    clearSearchFormErrors();
    closeMobilePopupModal();
  };

  useEffect(() => {
    if (resetFilterForm && resetSearchForm && inboxFormState) {
      resetFilterForm(inboxFormState?.filterForm);
      resetSearchForm(inboxFormState?.searchForm);
    }
  }, [inboxFormState, resetSearchForm, resetFilterForm]);

  const isMobile = window.Digit.Utils.browser.isMobile();

  if (isMobile) {
    const CurrentMobileModalComponent = useCallback(
      ({ ...props }) => (currentlyActiveMobileModal ? MobileComponentDirectory[currentlyActiveMobileModal]({ ...props }) : null),
      [currentlyActiveMobileModal]
    );

    const propsForCurrentMobileModalComponent = {
      SearchFormFields,
      FilterFormFields,
      registerSearchFormField,
      searchFormState,
      handleSearchFormSubmit,
      onResetSearchForm,
      registerFilterFormField,
      onResetFilterForm,
      controlFilterForm,
      handleFilterFormSubmit,
      setFilterFormValue,
      getFilterFormValue,
      closeMobilePopupModal,
      onSearchFormSubmit,
      onFilterFormSubmit,
      onMobileSortOrderData,
      sortFormDefaultValues,
      onSortFormReset,
      MobileSortFormValues: propsForInboxMobileCards?.MobileSortFormValues,
      t,
    };

    return (
      <div className="InboxComposerWrapper">
        {/* TODO fix design for card */}
        {/* <InboxLinks {...PropsForInboxLinks} /> */}
        <div className="searchBox">
          <SearchAction
            text={t("ES_COMMON_SEARCH")}
            handleActionClick={() => setActiveMobileModal({ type: "set", payload: "SearchFormComponent" })}
          />
          <FilterAction
            text={t("ES_COMMON_FILTER")}
            handleActionClick={() => setActiveMobileModal({ type: "set", payload: "FilterFormComponent" })}
          />
          <SortAction text={t("COMMON_TABLE_SORT")} handleActionClick={() => setActiveMobileModal({ type: "set", payload: "SortFormComponent" })} />
        </div>
        {currentlyActiveMobileModal ? (
          <PopUp>
            <CurrentMobileModalComponent {...propsForCurrentMobileModalComponent} />
          </PopUp>
        ) : null}
        {/* {isInboxLoading ? <Loader /> : <DetailsCard {...propsForInboxMobileCards} />} */}
        {isInboxLoading ? <Loader /> :
          <div>
            {propsForInboxMobileCards?.data?.length < 1 ?
              <Card className="margin-unset text-align-center">
                {propsForInboxTable?.noResultsMessage ? t(propsForInboxTable?.noResultsMessage) : t("CS_MYAPPLICATIONS_NO_APPLICATION")}
              </Card> : <DetailsCard {...propsForInboxMobileCards} />}
          </div>}
      </div>
    );
  }

  const isEnabledCommonModules =
    window.location.href.includes("/obps/") ||
    window.location.href.includes("/noc/") ||
    window.location.href.includes("/ws/water/bill-amendment/inbox") ||
    window.location.href.includes("/ws/sewerage/bill-amendment/inbox");

  const isEnabledWSCommonModules = window.location.href.includes("/ws/water/inbox") || window.location.href.includes("/ws/sewerage/inbox");

  if (isEnabledCommonModules) {
    return (
      <div className="inbox-container">
        <div className="filters-container">
          <InboxLinks {...PropsForInboxLinks} />
          <div>
            <FilterForm onSubmit={onFilterFormSubmit} handleSubmit={handleFilterFormSubmit} id="filter-form" onResetFilterForm={onResetFilterForm}>
              <FilterFormFields
                registerRef={registerFilterFormField}
                {...{ controlFilterForm, handleFilterFormSubmit, setFilterFormValue, getFilterFormValue }}
              />
            </FilterForm>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <SearchForm onSubmit={onSearchFormSubmit} handleSubmit={handleSearchFormSubmit} id="search-form" className="rm-mb form-field-flex-one">
            <SearchFormFields
              registerRef={registerSearchFormField}
              searchFormState={searchFormState}
              {...{ controlSearchForm }}
              searchFieldComponents={
                <div style={window.location.href.includes("/citizen/obps") ? {display : "flex"} : {}}>
                  <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="search-form" className="submit-bar-search" />
                  <p onClick={onResetSearchForm} className="clear-search" style={{ paddingTop: "9px", color: " #f47738" }}>
                    {t(`ES_COMMON_CLEAR_SEARCH`)}
                  </p>
                </div>
              }
            />
          </SearchForm>
          <div className="result" style={{ marginLeft: "24px", flex: 1 }}>
            {isInboxLoading ? (
              <Loader />
            ) : (
              <div>
                {propsForInboxTable?.data?.length < 1 ? (
                  <Card className="margin-unset text-align-center">
                    {propsForInboxTable.noResultsMessage ? t(propsForInboxTable.noResultsMessage) : t("CS_MYAPPLICATIONS_NO_APPLICATION")}
                  </Card>
                ) : (
                  <Table t={t} {...propsForInboxTable} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isEnabledWSCommonModules) {
    return (
      <div className={`InboxComposerWrapper ${className || ""}`}>
        <InboxLinks {...PropsForInboxLinks} />
        <SearchForm onSubmit={onSearchFormSubmit} handleSubmit={handleSearchFormSubmit} id="search-form" className="search-complaint-container">
          <div className={`complaint-input-container ${className || ""}`}>
            <SearchFormFields registerRef={registerSearchFormField} searchFormState={searchFormState} {...{ controlSearchForm }} />
            <SearchField className="clear-search-container">
              <div className="clear-search">
                <p onClick={onResetSearchForm}>{t(`ES_COMMON_CLEAR_SEARCH`)}</p>
              </div>
            </SearchField>
            <SearchField className="submit">
              <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="search-form" />
            </SearchField>
          </div>
        </SearchForm>
        <FilterForm onSubmit={onFilterFormSubmit} handleSubmit={handleFilterFormSubmit} id="filter-form" onResetFilterForm={onResetFilterForm}>
          <FilterFormFields
            registerRef={registerFilterFormField}
            {...{ controlFilterForm, handleFilterFormSubmit, setFilterFormValue, getFilterFormValue }}
          />
        </FilterForm>
        {isInboxLoading ? (
          <Loader />
        ) : (
          <div>
            {propsForInboxTable?.data?.length < 1 ? (
              <Card className="margin-unset text-align-center">
                {propsForInboxTable.noResultsMessage ? t(propsForInboxTable.noResultsMessage) : t("CS_MYAPPLICATIONS_NO_APPLICATION")}
              </Card>
            ) : (
              <Table t={t} {...propsForInboxTable} />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="InboxComposerWrapper">
      <InboxLinks {...PropsForInboxLinks} />
      <SearchForm onSubmit={onSearchFormSubmit} handleSubmit={handleSearchFormSubmit} id="search-form" className="rm-mb form-field-flex-one">
        <SearchFormFields registerRef={registerSearchFormField} searchFormState={searchFormState} {...{ controlSearchForm }} />
        <div className="SubmitAndClearAllContainer">
          <SearchField className="submit">
            <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="search-form" />
            <p onClick={onResetSearchForm}>{t(`ES_COMMON_CLEAR_SEARCH`)}</p>
          </SearchField>
        </div>
      </SearchForm>
      <FilterForm onSubmit={onFilterFormSubmit} handleSubmit={handleFilterFormSubmit} id="filter-form" onResetFilterForm={onResetFilterForm}>
        <FilterFormFields
          registerRef={registerFilterFormField}
          {...{ controlFilterForm, handleFilterFormSubmit, setFilterFormValue, getFilterFormValue }}
        />
        {/* <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="filter-form"/> */}
      </FilterForm>
      {isInboxLoading ? (
        <Loader />
      ) : (
        <div>
          {propsForInboxTable?.data?.length < 1 ? (
            <Card className="margin-unset text-align-center">
              {propsForInboxTable.noResultsMessage ? t(propsForInboxTable.noResultsMessage) : t("CS_MYAPPLICATIONS_NO_APPLICATION")}
            </Card>
          ) : (
            <Table t={t} {...propsForInboxTable} />
          )}
        </div>
      )}
    </div>
  );
};

export default InboxComposer;
