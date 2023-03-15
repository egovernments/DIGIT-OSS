import React, {Fragment} from "react"
import { CardLabelError, SearchField, TextInput } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SearchFormFieldsComponents = ({registerRef, searchFormState, searchFieldComponents}) => {
    const { t } = useTranslation()
    const isMobile = window.Digit.Utils.browser.isMobile();

    if (!isMobile) {
        return <React.Fragment>
            <div className="search-container" style={{ width: "auto", marginLeft: "24px" }}>
                <div className="search-complaint-container">
                    <div className="complaint-input-container" style={{ textAlign: "start" }}>
                        <SearchField>
                            <label>{t("NOC_APPLICATION_NUMBER_LABEL")}</label>
                            <TextInput name="applicationNo" inputRef={registerRef({})} />
                        </SearchField>
                        <SearchField>
                            <label>{t("NOC_BPA_APPLICATION_NUMBER_LABEL")}</label>
                            <TextInput name="sourceRefId" inputRef={registerRef({})} />
                        </SearchField>
                        <div className="search-action-wrapper" style={{ width: "100%" }}>
                            {searchFieldComponents}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }

    return <>
        <SearchField>
            <label>{t("NOC_APPLICATION_NUMBER_LABEL")}</label>
            <TextInput name="applicationNo" inputRef={registerRef({})} />
        </SearchField>
        <SearchField>
            <label>{t("NOC_BPA_APPLICATION_NUMBER_LABEL")}</label>
            <TextInput name="sourceRefId" inputRef={registerRef({})} />
        </SearchField>
    </>
}

export default SearchFormFieldsComponents