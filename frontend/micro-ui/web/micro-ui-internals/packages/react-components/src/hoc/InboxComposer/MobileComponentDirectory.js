import React, { Fragment } from "react"
import { SearchField, SearchForm } from "../../molecules/SearchForm"
import { FilterForm } from "../../molecules/FilterForm"
import SubmitBar from "../../atoms/SubmitBar"
import { CloseSvg, SortSvg } from "../../atoms/svgindex"
import { FormProvider, useForm } from "react-hook-form"
import PopupHeadingLabel from "../../atoms/PopupHeadingLabel"
import ActionBar from "../../atoms/ActionBar";

const MobilePopUpCloseButton = ({closeMobilePopupModal}) => <div className="InboxMobilePopupCloseButtonWrapper" onClick={closeMobilePopupModal}>
    <CloseSvg />
</div>

const MobileComponentDirectory = {
    SearchFormComponent: ({registerSearchFormField, searchFormState, handleSearchFormSubmit, onResetSearchForm, SearchFormFields, closeMobilePopupModal, onSearchFormSubmit, t}) => <SearchForm onSubmit={({...props}) => {
        closeMobilePopupModal()
        onSearchFormSubmit({...props})
    }} handleSubmit={handleSearchFormSubmit} id="search-form" className="rm-mb form-field-flex-one inboxPopupMobileWrapper" >
        <MobilePopUpCloseButton {...{closeMobilePopupModal}} />
        <SearchFormFields registerRef={registerSearchFormField} searchFormState={searchFormState} />
        <ActionBar style={{maxWidth: "100%"}}>
        <SearchField className="submit">
            <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="search-form" />
            <p onClick={onResetSearchForm}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
        </SearchField>
        </ActionBar>
    </SearchForm>,
    FilterFormComponent: ({registerFilterFormField, onResetFilterForm, controlFilterForm, handleFilterFormSubmit, setFilterFormValue, getFilterFormValue, FilterFormFields, closeMobilePopupModal, onFilterFormSubmit}) => <FilterForm onSubmit={({...props}) => {
        closeMobilePopupModal()
        onFilterFormSubmit({...props})
    }} closeButton={() => <MobilePopUpCloseButton {...{closeMobilePopupModal}} />} handleSubmit={handleFilterFormSubmit} id="filter-form" onResetFilterForm={onResetFilterForm} className="inboxPopupMobileWrapper p-unset">
        <FilterFormFields registerRef={registerFilterFormField} {...{ controlFilterForm, handleFilterFormSubmit, setFilterFormValue, getFilterFormValue }} />
    </FilterForm>,
    SortFormComponent: ({sortFormDefaultValues={}, closeMobilePopupModal, MobileSortFormValues, onMobileSortOrderData, onSortFormReset, t}) => {
        const { setValue: setSortFormValue, handleSubmit: handleSortFormSubmit, ...methods } = useForm({defaultValues: sortFormDefaultValues})
        function onResetSortForm(){
            closeMobilePopupModal()
            onSortFormReset(setSortFormValue)
        }
        return <FormProvider {...{ setValue: setSortFormValue, handleSubmit: handleSortFormSubmit, ...methods }}>
            <SearchForm onSubmit={({...props}) => {
                closeMobilePopupModal()
                onMobileSortOrderData({...props})
            }} handleSubmit={handleSortFormSubmit} id="sort-form" className="rm-mb form-field-flex-one inboxPopupMobileWrapper" >
                <MobilePopUpCloseButton {...{closeMobilePopupModal}} />
                <PopupHeadingLabel IconSVG={SortSvg} headingLabel={t("COMMON_TABLE_SORT") } {...{onResetSortForm}}/>
                <MobileSortFormValues />
                <ActionBar style={{maxWidth: "100%"}}>
                <SearchField className="submit">
                    <SubmitBar label={t("COMMON_TABLE_SORT")} submit form="sort-form" />
                    <p onClick={onResetSortForm}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
                </SearchField>
                </ActionBar>
            </SearchForm>
        </FormProvider>
    }
}

export default MobileComponentDirectory