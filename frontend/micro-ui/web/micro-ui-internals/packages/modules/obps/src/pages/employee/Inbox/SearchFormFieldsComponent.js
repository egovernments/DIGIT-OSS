import React, {Fragment} from "react"
import { CardLabelError, SearchField, TextInput } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SearchFormFieldsComponents = ({registerRef, searchFormState}) => {
    const { t } = useTranslation()

    return <>
        <SearchField>
            <label>{t("REFERENCE_NO")}</label>
            <TextInput name="applicationNo" inputRef={registerRef({})} />
        </SearchField>
        <SearchField>
            <label>{t("CORE_COMMON_MOBILE_NUMBER")}</label>
            <TextInput name="mobileNumber" inputRef={registerRef({
                minLength: {
                    value: 10,
                    message: t("CORE_COMMON_MOBILE_ERROR")
                },
                maxLength: 10
            })} />
            <CardLabelError>
                {searchFormState?.errors?.["mobileNumber"]?.message}
            </CardLabelError>
        </SearchField>
    </>
}

export default SearchFormFieldsComponents