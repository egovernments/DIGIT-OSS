import React, { Fragment, useMemo  } from "react"
import { CardLabelError, Dropdown, SearchField, TextInput } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import {Controller } from "react-hook-form";
import { alphabeticalSortFunctionForTenantsBasedOnName } from "../../../../utils";

const SearchFormFieldsComponents = ({ registerRef, controlSearchForm, searchFormState }) => {
    const { t } = useTranslation()
    const ulbs = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const userInfo = Digit.SessionStorage.get("citizen.userRequestObject")
    const userUlbs = ulbs.filter(ulb => userInfo?.info?.roles?.some(role => role?.tenantId === ulb?.code)).sort(alphabeticalSortFunctionForTenantsBasedOnName);
    const selectedTenat = useMemo(() => {
        const filtered = ulbs.filter((item) => item.code === tenantId)
        return filtered;
    }, [ulbs])
    
    /**
     * ToDo how to display default value correctly ask @egov-saurabh
     */
    
    return <>
        <SearchField>
            <label>{t("LABEL_FOR_ULB")}</label>
            
            <Controller
                rules={{ required: true }}
                defaultValue={selectedTenat?.[0]}
                render={props => (
                    <Dropdown
                        option={userUlbs}
                        optionKey={"i18nKey"}
                        selected={props.value}
                        select={(e) => props.onChange(e)}
                        t={t}
                    />
                )}
                name={"tenantIds"}
                control={controlSearchForm}

            />
            
        </SearchField>
        <SearchField>
            <label>{t("CS_SURVEY_NAME")}</label>
            <TextInput name="title" type="text" inputRef={registerRef({
                maxLength: {
                    value: 60,
                    message: t("EXCEEDS_60_CHAR_LIMIT")
                },
            })} />
            <CardLabelError>
                {searchFormState?.errors?.["title"]?.message}
            </CardLabelError>
        </SearchField>
        <SearchField>
            <label>{t("EVENTS_POSTEDBY_LABEL")}</label>
            <TextInput name="postedBy" type="text" inputRef={registerRef({
                maxLength: {
                    value: 30,
                    message: t("EXCEEDS_30_CHAR_LIMIT")
                },
            })} />
            <CardLabelError>
                {searchFormState?.errors?.["postedBy"]?.message}
            </CardLabelError>
        </SearchField>
    </>
}

export default SearchFormFieldsComponents