import React, {Fragment} from "react"
import { CardLabelError, SearchField, TextInput } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SearchFormFieldsComponents = ({registerRef, searchFormState}) => {
    const { t } = useTranslation()

    return <>
        <SearchField>
            <label>{t("NOC_APP_NO_LABEL")}</label>
            <TextInput name="applicationNo" inputRef={registerRef({})} />
        </SearchField>
        <SearchField>
            <label>{t("CORE_COMMON_MOBILE_NUMBER")}</label>
            <TextInput name="mobileNumber" type="number" inputRef={registerRef({
                minLength: {
                    value: 10,
                    message: t("CORE_COMMON_MOBILE_ERROR")
                },
                maxLength: {
                    value: 10,
                    message: t("CORE_COMMON_MOBILE_ERROR")
                },
                pattern: {
                    value: /[789][0-9]{9}/,
                    message: t("CORE_COMMON_MOBILE_ERROR")
                }
            })} />
            <CardLabelError>
                {searchFormState?.errors?.["mobileNumber"]?.message}
            </CardLabelError>
        </SearchField>
    </>
}

export default SearchFormFieldsComponents