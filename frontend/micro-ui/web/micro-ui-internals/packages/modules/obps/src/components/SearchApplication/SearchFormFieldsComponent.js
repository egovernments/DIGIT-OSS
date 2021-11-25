import React, { Fragment } from "react"
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, CardLabelError, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useWatch } from "react-hook-form";

const SearchFormFieldsComponent = ({formState,Controller, register, control, t, reset, previousPage}) => {
    const stateTenantId = Digit.ULBService.getStateId()
    const applicationType = useWatch({control, name:"applicationType"})
    const { applicationTypes, ServiceTypes } = Digit.Hooks.obps.useServiceTypeFromApplicationType({
        Applicationtype: applicationType?.code || "BUILDING_PLAN_SCRUTINY",
        tenantId: stateTenantId
    });
    const businessServices = "BPA,BPA_LOW,BPA_OC,ARCHITECT,BUILDER,ENGINEER,STRUCTURALENGINEER";
    const { isLoading, data: businessServiceData } = Digit.Hooks.obps.useBusinessServiceData(stateTenantId, businessServices, {});
    let bpaStatus = [], bparegStatus = [], applicationStatuses = [];
    businessServiceData?.BusinessServices?.map(data => {
        data.states.map(state => {
            if(state.state && state.applicationStatus) {
                if (data.business == "BPAREG") {
                    bparegStatus.push({
                        code: state.applicationStatus,
                        i18nKey: `WF_ARCHITECT_${state.state}`,
                        module: data.business
                   })
                } else {
                    bpaStatus.push({
                        code: state.applicationStatus,
                        i18nKey: `WF_BPA_${state.state}`,
                        module: data.business
                   })
                }
            }
        })
    });
    const bpaStatusUnique = [...new Map(bpaStatus.map(item => [item["code"], item])).values()];
    const bparegStatusUnique = [...new Map(bparegStatus.map(item => [item["code"], item])).values()];
    if (applicationType?.code) applicationStatuses = applicationType?.code == "BPA_STAKEHOLDER_REGISTRATION" ? bparegStatusUnique : bpaStatusUnique;

    return <>
        <SearchField>
            <label>{t("BPA_SEARCH_APPLICATION_NO_LABEL")}</label>
            <TextInput name="applicationNo" inputRef={register({})} />
        </SearchField>
        <SearchField>
            <label>{t("BPA_APP_MOBILE_NO_SEARCH_PARAM")}</label>
            <MobileNumber name="mobileNumber" inputRef={register({
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
                    //type: "tel",
                    message: t("CORE_COMMON_MOBILE_ERROR")
                }})} 
                type="number"
                componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>} 
                //maxlength={10}
            />
            <CardLabelError>
                    {formState?.errors?.["mobileNumber"]?.message}
            </CardLabelError>
        </SearchField>
        <SearchField>
            <label>{t("BPA_SEARCH_APPLICATION_TYPE_LABEL")}</label>
            <Controller
                    control={control}
                    name="applicationType"
                    render={(props) => (
                        <Dropdown
                        selected={props.value}
                        select={props.onChange}
                        onBlur={props.onBlur}
                        option={applicationTypes}
                        optionKey="i18nKey"
                        t={t}
                        />
                    )}
                    />
        </SearchField>
        <SearchField>
            <label>{t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")}</label>
            <Controller
                    control={control}
                    name="serviceType"
                    render={(props) => (
                        <Dropdown
                        selected={props.value}
                        select={props.onChange}
                        onBlur={props.onBlur}
                        option={ServiceTypes}
                        optionKey="i18nKey"
                        t={t}
                        />
                    )}
                    />
        </SearchField>
        <SearchField>
            <label>{t("BPA_APP_FROM_DATE_SEARCH_PARAM")}</label>
            <Controller
                render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                name="fromDate"
                control={control}
                />
        </SearchField>
        <SearchField>
            <label>{t("BPA_APP_TO_DATE_SEARCH_PARAM")}</label>
            <Controller
                render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                name="toDate"
                control={control}
                />
        </SearchField>
        <SearchField>
            <label>{t("BPA_SEARCH_APPLICATION_STATUS_LABEL")}</label>
            <Controller
                    control={control}
                    name="status"
                    render={(props) => (
                        <Dropdown
                        selected={props.value}
                        select={props.onChange}
                        onBlur={props.onBlur}
                        option={applicationStatuses}
                        optionKey="i18nKey"
                        t={t}
                        />
                    )}
                    />
        </SearchField>
        <SearchField className="submit">
            <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
            <p style={{marginTop: "24px"}} onClick={() => {
                reset({ 
                    applicationNo: "",
                    mobileNumber: "",
                    applicationType: "", 
                    serviceType: "",
                    fromDate: "", 
                    toDate: "",
                    status: "",
                    offset: 0,
                    limit: 10,
                    sortBy: "commencementDate",
                    sortOrder: "DESC"
                });
                previousPage();
            }}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
        </SearchField>
    </>
}

export default SearchFormFieldsComponent