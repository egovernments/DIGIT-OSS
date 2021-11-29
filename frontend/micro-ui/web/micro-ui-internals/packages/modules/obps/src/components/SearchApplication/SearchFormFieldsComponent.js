import React, { Fragment } from "react"
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, CardLabelError, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useWatch } from "react-hook-form";

const SearchFormFieldsComponent = ({formState,Controller, register, control, t, reset, previousPage}) => {
    const stateTenantId = Digit.ULBService.getStateId();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const applicationType = useWatch({control, name:"applicationType"});
    const oldApplicationType = sessionStorage.getItem("search_application");
    if(oldApplicationType && JSON.parse(oldApplicationType)?.code !== applicationType?.code) control.setValue("status", "");
    sessionStorage.setItem("search_application", JSON.stringify(applicationType));
    const { applicationTypes, ServiceTypes } = Digit.Hooks.obps.useServiceTypeFromApplicationType({
        Applicationtype: applicationType?.code || "BUILDING_PLAN_SCRUTINY",
        tenantId: stateTenantId
    });
    const businessServices = "BPA,BPA_LOW,BPA_OC,ARCHITECT,BUILDER,ENGINEER,STRUCTURALENGINEER";
    const { isLoading, data: businessServiceData } = Digit.Hooks.obps.useBusinessServiceData(tenantId, businessServices, {});
    let bpaStatus = [], bpaOCStatus = [], bparegStatus = [], applicationStatuses = [];
    businessServiceData?.BusinessServices?.forEach(data => {
        data.states.forEach(state => {
            if(state.state && state.applicationStatus) {
                if (data.business == "BPAREG") {
                    bparegStatus.push({
                        code: state.applicationStatus,
                        i18nKey: `WF_ARCHITECT_${state.state}`,
                        module: data.business
                   })
                } else {
                    if(data?.businessService == "BPA_OC") {
                        bpaOCStatus.push({
                            code: state.applicationStatus,
                            i18nKey: `WF_BPA_${state.state}`,
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
            }
        })
    });


    let bpaFlags = [], bpaStatusUnique = [], i;
    for (i = 0; i < bpaStatus.length; i++) {
        if (bpaFlags[bpaStatus[i].code]) continue;
        bpaFlags[bpaStatus[i].code] = true;
        bpaStatusUnique.push(bpaStatus[i].code);
    }

    let bpaOCFlags = [], bpaOCStatusStatusUnique = [], j;
    for (j = 0; j < bpaOCStatus.length; j++) {
        if (bpaOCFlags[bpaOCStatus[j].code]) continue;
        bpaOCFlags[bpaOCStatus[j].code] = true;
        bpaOCStatusStatusUnique.push(bpaOCStatus[j].code);
    }

    let bpaRegFlags = [], bparegStatusUnique = [], k;
    for (k = 0; k < bparegStatus.length; k++) {
        if (bpaRegFlags[bparegStatus[k].code]) continue;
        bpaRegFlags[bparegStatus[k].code] = true;
        bparegStatusUnique.push(bparegStatus[k].code);
    }
    
    const bpaApplicationStatus = [], bpaOCApplicationStatus = [], bpaRegApplicationStatus = [];

    bpaStatusUnique.forEach(code => bpaApplicationStatus.push({i18nKey: `WF_BPA_${code}`, code: code}));
    bpaOCStatusStatusUnique.forEach(code => bpaOCApplicationStatus.push({i18nKey: `WF_BPA_${code}`, code: code}));
    bparegStatusUnique.forEach(code => bpaRegApplicationStatus.push({i18nKey: `WF_BPA_${code}`, code: code}));

    if (applicationType?.code === "BPA_STAKEHOLDER_REGISTRATION") applicationStatuses = bpaRegApplicationStatus;
    else if (applicationType?.code === "BUILDING_PLAN_SCRUTINY") applicationStatuses = bpaApplicationStatus;
    else if (applicationType?.code === "BUILDING_OC_PLAN_SCRUTINY") applicationStatuses = bpaOCApplicationStatus;
    else applicationStatuses = [];

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
                // closeMobilePopupModal()
            }}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
        </SearchField>
    </>
}

export default SearchFormFieldsComponent