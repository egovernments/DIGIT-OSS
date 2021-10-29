import React, { Fragment, useEffect, useReducer } from "react"
import InboxLinks from "../atoms/InboxLinks"
import Table from "../atoms/Table"
import { SearchField, SearchForm } from "../molecules/SearchForm"
import { FilterForm, FilterFormField } from "../molecules/FilterForm"
import SubmitBar from "../atoms/SubmitBar"
import { useTranslation } from "react-i18next"
import Card from "../atoms/Card"
import { Loader } from "../atoms/Loader"
import { useForm, Controller } from "react-hook-form";
import SearchAction from "../molecules/SearchAction"
import FilterAction from "../molecules/FilterAction"
import SortAction from "../molecules/SortAction"
import PopUp from "../atoms/PopUp"
import { CloseSvg } from "../atoms/svgindex"

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
    onFilterFormSubmit,
    onFilterFormReset,
    resetFilterFormDefaultValues,
    formState: inboxFormState
}) => {
    const { t } = useTranslation()

    function activateModal(state, action){
        switch(action.type){
            case "set":
                return action.payload
            case "remove":
                return false
            default:
                console.warn("no such action defined")
        }
    }

    const [ currentlyActiveMobileModal, setActiveMobileModal ] = useReducer(activateModal, false)

    const closeMobilePopupModal = () => {
        setActiveMobileModal({type:"remove"})
    }

    const { register: registerSearchFormField, control: controlSearchForm , handleSubmit: handleSearchFormSubmit, setValue: setSearchFormValue, getValues: getSearchFormValue, reset: resetSearchForm, formState: searchFormState } = useForm({
        defaultValues: {...searchFormDefaultValues}
    })
    
    const { register: registerFilterFormField, control: controlFilterForm , handleSubmit: handleFilterFormSubmit, setValue: setFilterFormValue, getValues: getFilterFormValue, reset: resetFilterForm } = useForm({
        defaultValues: {...filterFormDefaultValues}
    })
    
    const onResetFilterForm = () => {
        onFilterFormReset(setFilterFormValue)
    }

    const onResetSearchForm = () => {
        onSearchFormReset(setSearchFormValue)
    }

    useEffect(()=>{
        if(resetFilterForm && resetSearchForm && inboxFormState){
            resetFilterForm(inboxFormState?.filterForm)
            resetSearchForm(inboxFormState?.searchForm)
        }
      }, [inboxFormState, resetSearchForm, resetFilterForm])
    
    const isMobile = window.Digit.Utils.browser.isMobile();

    const MobileComponentDirectory= {
        SearchFormComponent: () =><SearchForm onSubmit={onSearchFormSubmit} handleSubmit={handleSearchFormSubmit} id="search-form" className="rm-mb form-field-flex-one inboxPopupMobileWrapper" >
            <div className="InboxMobilePopupCloseButtonWrapper" onClick={closeMobilePopupModal}>
                <CloseSvg/>
            </div>
            <SearchFormFields registerRef={registerSearchFormField} searchFormState={searchFormState} />
            <SearchField className="submit">
                <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="search-form"/>
                <p onClick={onResetSearchForm}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
            </SearchField>
        </SearchForm>,
        FilterFormComponent: ()=><FilterForm onSubmit={onFilterFormSubmit} handleSubmit={handleFilterFormSubmit} id="filter-form" onResetFilterForm={onResetFilterForm} className="inboxPopupMobileWrapper">
                <div className="InboxMobilePopupCloseButtonWrapper" onClick={closeMobilePopupModal}>
                    <CloseSvg/>
                </div>
            <FilterFormFields registerRef={registerFilterFormField} { ...{controlFilterForm, handleFilterFormSubmit, setFilterFormValue, getFilterFormValue} } />
        </FilterForm>
    }

    const CurrentMobileModalComponent = MobileComponentDirectory[currentlyActiveMobileModal]

    if (isMobile) {
        return <div className="InboxComposerWrapper">
            {/* TODO fix design for card */}
            {/* <InboxLinks {...PropsForInboxLinks} /> */}
            <div className="searchBox">
                <SearchAction text={t("ES_COMMON_SEARCH")} handleActionClick={() => setActiveMobileModal({type:"set", payload:"SearchFormComponent"})}/>
                <FilterAction text={t("ES_COMMON_FILTER")} handleActionClick={() => setActiveMobileModal({type:"set", payload:"FilterFormComponent"})}/>
                <SortAction text={t("ES_COMMON_SORT")} handleActionClick={() => setActiveMobileModal({type:"set", payload:"SortComponent"})}/>
            </div>
            {currentlyActiveMobileModal ? <PopUp>
                <CurrentMobileModalComponent/>
            </PopUp> : null}
            {/* <FilterForm clearAll={resetFilterForm} {...{ showMobileFilterFormPopup, onMobileExclusiveFilterPopupFormClose: () => setMobileFilterFormPopup(false) }}>
            </FilterForm> */}
        </div>
    }
    return <div className="InboxComposerWrapper">
        <InboxLinks {...PropsForInboxLinks} />
        <SearchForm onSubmit={onSearchFormSubmit} handleSubmit={handleSearchFormSubmit} id="search-form" className="rm-mb form-field-flex-one" >
            <SearchFormFields registerRef={registerSearchFormField} searchFormState={searchFormState} />
            <SearchField className="submit">
                <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="search-form"/>
                <p onClick={onResetSearchForm}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
            </SearchField>
        </SearchForm>
        <FilterForm onSubmit={onFilterFormSubmit} handleSubmit={handleFilterFormSubmit} id="filter-form" onResetFilterForm={onResetFilterForm}>
            <FilterFormFields registerRef={registerFilterFormField} { ...{controlFilterForm, handleFilterFormSubmit, setFilterFormValue, getFilterFormValue} } />
            {/* <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="filter-form"/> */}
        </FilterForm>
        { isInboxLoading ? <Loader/> : <div>
        {propsForInboxTable?.data?.length<1 ? <Card className="margin-unset text-align-center">
            {t("CS_MYAPPLICATIONS_NO_APPLICATION")}
        </Card>
        : <Table
            t={t}
            // data={sourceData}
            // columns={tableColumnConfig}
            {...propsForInboxTable}
        />}
        </div>}
    </div>
}

export default InboxComposer