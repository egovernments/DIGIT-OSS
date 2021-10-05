import React, { useState } from "react"
import InboxLinks from "../atoms/InboxLinks"
import Table from "../atoms/Table"
import { SearchField, SearchForm } from "../molecules/SearchForm"
import { FilterForm, FilterFormField } from "../molecules/FilterForm"
import SubmitBar from "../atoms/SubmitBar"
import { useTranslation } from "react-i18next"
import Card from "../atoms/Card"
import { useForm, Controller } from "react-hook-form";


const InboxComposer = ({isMobile=false, PropsForInboxLinks, SearchFormFields, searchFormDefaultValues, onSearchFormSubmit, FilterFormFields, filterFormDefaultValues, propsForInboxTable }) => {
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
                    // resetSearchForm(resetSearchFormDefaultValues);
                    previousPage ();
                  }}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
            </SearchField>
        </SearchForm>
        <FilterForm clearAll={resetFilterForm}>
            <FilterFormFields/>
        </FilterForm>
        {propsForInboxTable?.sourceData?.display ? <Card style={{ marginTop: 20 }}>
            {
            t(propsForInboxTable?.sourceData?.display)
                .split("\\n")
                .map((text, index) => (
                <p key={index} style={{ textAlign: "center" }}>
                    {text}
                </p>
                ))
            }
        </Card>
        : <Table
            t={t}
            // data={sourceData}
            // columns={tableColumnConfig}
            {...propsForInboxTable}
        />}
    </div>
}

export default InboxComposer