import React, { useState } from "react"
import InboxLinks from "../atoms/InboxLinks"
import Table from "../atoms/Table"
import { SearchField, SearchForm } from "../molecules/SearchForm"
import { FilterForm, FilterFormField } from "../molecules/FilterForm"
import SubmitBar from "../atoms/SubmitBar"
import { useTranslation } from "react-i18next"
import Card from "../atoms/Card"

const InboxComposer = ({isMobile=false, PropsForInboxLinks, SearchFormFields, handleSearchFormSubmit, onSearchFormSubmit, resetSearchForm, resetFilterForm, FilterFormFields, sourceData, tableColumnConfig }) => {
    const { t } = useTranslation()
    
    const [ showMobileFilterFormPopup, setMobileFilterFormPopup ] = useState(false)

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
            <SearchFormFields/>
            <SearchField className="submit">
                <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="search-form"/>
                <p onClick={() => {
                    resetSearchForm(resetSearchFormDefaultValues);
                    previousPage ();
                  }}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
            </SearchField>
        </SearchForm>
        <FilterForm clearAll={resetFilterForm}>
            <FilterFormFields/>
        </FilterForm>
        {sourceData?.display ? <Card style={{ marginTop: 20 }}>
            {
            t(sourceData.display)
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
            data={sourceData}
            columns={tableColumnConfig}
            getCellProps={(cellInfo) => {
            return {
                style: {
                minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
                padding: "20px 18px",
                fontSize: "16px"
            },
            };
            }}
            // onPageSizeChange={onPageSizeChange}
            // currentPage={getValues("offset")/getValues("limit")}
            // onNextPage={nextPage}
            // onPrevPage={previousPage}
            // pageSizeLimit={getValues("limit")}
            // onSort={onSort}
            // disableSort={false}
            // sortParams={[{id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false}]}
            // totalRecords={100}
        />}
    </div>
}

export default InboxComposer