import React, {Fragment} from "react"
import { CardLabelError, SearchField, TextInput, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SearchFormFieldsComponents = ({registerRef, searchFormState}) => {
    const { t } = useTranslation()

    return <>
        <SearchField>
            <label>{t("BPA_APPLICATION_NUMBER_LABEL")}</label>
            <TextInput name="applicationNo" inputRef={registerRef({})} />
        </SearchField>
        <SearchField>
            <label>{t("CORE_COMMON_MOBILE_NUMBER")}</label>
            <MobileNumber name="mobileNumber" type="number" inputRef={registerRef({
                minLength: {
                    value: 10,
                    message: t("CORE_COMMON_MOBILE_ERROR")
                },
                maxLength: {
                    value: 10,
                    message: t("CORE_COMMON_MOBILE_ERROR")
                },
                pattern: {
                    value: /[6789][0-9]{9}/,
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