import React, { Fragment } from "react"
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, CardLabelError } from "@egovernments/digit-ui-react-components";

const applicationStatuses = [
    {
        code: "CANCELLED",
        i18nKey: "WF_BPA_CANCELLED"
    },
    {
        code: "APPROVED",
        i18nKey: "WF_BPA_APPROVED"
    },
    {
        code: "INPROGRESS",
        i18nKey: "WF_BPA_INPROGRESS"
    },
    {
        code: "PENDINGPAYMENT",
        i18nKey: "WF_NEWTL_PENDINGPAYMENT"
    },
    {
        code: "CITIZEN_APPROVAL_INPROCESS",
        i18nKey: "WF_BPA_CITIZEN_APPROVAL_INPROCESS"
    },
    {
        code: "CITIZEN_APPROVAL_PENDING",
        i18nKey: "WF_BPA_CITIZEN_APPROVAL_PENDING"
    },
    {
        code: "DOC_VERIFICATION_PENDING",
        i18nKey: "WF_BPA_DOC_VERIFICATION_PENDING"
    },
    {
        code: "FIELDINSPECTION_PENDING",
        i18nKey: "WF_BPA_FIELDINSPECTION_PENDING"
    },
    {
        code: "INITIATED",
        i18nKey: "WF_BPA_INITIATED"
    }	
]


const SearchFormFieldsComponent = ({formState,Controller, register, control, t, getApplicationType, getselectedServiceType, applicationTypes, ServiceTypes, reset, defaultAppType, defaultserviceType,previousPage}) => <>
    <SearchField>
        <label>{t("BPA_SEARCH_APPLICATION_NO_LABEL")}</label>
        <TextInput name="applicationNo" inputRef={register({})} />
    </SearchField>
    <SearchField>
        <label>{t("BPA_APP_MOBILE_NO_SEARCH_PARAM")}</label>
        <TextInput name="mobileNumber" inputRef={register({
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
                    selected={getApplicationType(props.value)}
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
                    selected={getselectedServiceType(props.value)}
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
        <p onClick={() => {
            reset({ 
                applicationNo: "",
                mobileNumber: "",
                applicationType: defaultAppType, 
                serviceType: defaultserviceType,
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

export default SearchFormFieldsComponent