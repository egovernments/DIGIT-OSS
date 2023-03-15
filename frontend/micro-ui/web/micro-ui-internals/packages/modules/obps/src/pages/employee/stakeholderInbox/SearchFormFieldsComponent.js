import React, {Fragment} from "react"
import { CardLabelError, SearchField, TextInput, MobileNumber } from "@egovernments/digit-ui-react-components";
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
                            {searchFormState?.errors?.["mobileNumber"]?.message ? <CardLabelError>
                                {searchFormState?.errors?.["mobileNumber"]?.message}
                            </CardLabelError> : null}
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
           {searchFormState?.errors?.["mobileNumber"]?.message ? <CardLabelError>
                {searchFormState?.errors?.["mobileNumber"]?.message}
            </CardLabelError> : null}
        </SearchField>
    </>
}

export default SearchFormFieldsComponents