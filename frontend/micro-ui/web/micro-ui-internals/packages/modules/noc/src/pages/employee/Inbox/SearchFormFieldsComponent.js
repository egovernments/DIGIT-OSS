import React, {Fragment} from "react"
import { CardLabelError, SearchField, TextInput } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SearchFormFieldsComponents = ({registerRef, searchFormState}) => {
    const { t } = useTranslation()

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