import React, { useState, Fragment, useEffect } from "react"
import InboxLinks from "../atoms/InboxLinks"
import Table from "../atoms/Table"
import { SearchField, SearchForm } from "../molecules/SearchForm"
import { FilterForm, FilterFormField } from "../molecules/FilterForm"
import SubmitBar from "../atoms/SubmitBar"
import { useTranslation } from "react-i18next"
import Card from "../atoms/Card"
import { Loader } from "../atoms/Loader"
import { useForm, Controller } from "react-hook-form";


const InboxComposer = ({
    isMobile=false,
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
    formState
}) => {
    const { t } = useTranslation()
    const [ showMobileFilterFormPopup, setMobileFilterFormPopup ] = useState(false)

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
        resetFilterForm(formState?.filterForm)
        resetSearchForm(formState?.searchForm)
      }, [formState])
    

    if (isMobile) {
        return <div className="InboxComposerWrapper">
            <InboxLinks {...PropsForInboxLinks} />
                <FilterForm clearAll={resetFilterForm} {...{ showMobileFilterFormPopup, onMobileExclusiveFilterPopupFormClose: () => setMobileFilterFormPopup(false) }}>
            </FilterForm>
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