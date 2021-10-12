import React, { useState, Fragment } from "react"
import InboxLinks from "../atoms/InboxLinks"
import Table from "../atoms/Table"
import { SearchField, SearchForm } from "../molecules/SearchForm"
import { FilterForm, FilterFormField } from "../molecules/FilterForm"
import SubmitBar from "../atoms/SubmitBar"
import { useTranslation } from "react-i18next"
import Card from "../atoms/Card"
import { Loader } from "../atoms/Loader"
import { useForm, Controller } from "react-hook-form";


const InboxComposer = ({isMobile=false, isInboxLoading, PropsForInboxLinks, SearchFormFields, searchFormDefaultValues, onSearchFormSubmit, FilterFormFields, filterFormDefaultValues, propsForInboxTable, onFilterFormSubmit }) => {
    const { t } = useTranslation()
    const [ showMobileFilterFormPopup, setMobileFilterFormPopup ] = useState(false)

    const { register: registerSearchFormField, control: controlSearchForm , handleSubmit: handleSearchFormSubmit, setValue: setSearchFormValue, getValues: getSearchFormValue, reset: resetSearchForm } = useForm({
        defaultValues: {...searchFormDefaultValues}
    })
    
    const { register: registerFilterFormField, control: controlFilterForm , handleSubmit: handleFilterFormSubmit, setValue: setFilterFormValue, getValues: getFilterFormValue, reset: resetFilterForm } = useForm({
        defaultValues: {...filterFormDefaultValues}
    })

    if (isMobile) {
        return <div className="InboxComposerWrapper">
            <InboxLinks {...PropsForInboxLinks} />
            <FilterForm clearAll={resetFilterForm} {...{ showMobileFilterFormPopup, onMobileExclusiveFilterPopupFormClose: () => setMobileFilterFormPopup(false) }}>
            
            </FilterForm>
        </div>
    }
    return <div className="InboxComposerWrapper">
        <InboxLinks {...PropsForInboxLinks} />
        <SearchForm onSubmit={onSearchFormSubmit} handleSubmit={handleSearchFormSubmit} id="search-form" className="rm-mb" >
            <SearchFormFields registerRef={registerSearchFormField}/>
            <SearchField className="submit">
                <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="search-form"/>
                <p onClick={() => {
                    resetSearchForm(resetSearchFormDefaultValues);
                    // previousPage();
                  }}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
            </SearchField>
        </SearchForm>
        <FilterForm onSubmit={onFilterFormSubmit} handleSubmit={handleFilterFormSubmit} id="filter-form">
            <FilterFormFields registerRef={registerFilterFormField} { ...{controlFilterForm, handleFilterFormSubmit, setFilterFormValue, getFilterFormValue} } />
            {/* <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="filter-form"/> */}
        </FilterForm>
        { isInboxLoading ? <Loader/> : <div>
        {propsForInboxTable?.data?.length<1 ? <Card style={{ marginTop: 20 }}>
            Nothin bro nothin
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