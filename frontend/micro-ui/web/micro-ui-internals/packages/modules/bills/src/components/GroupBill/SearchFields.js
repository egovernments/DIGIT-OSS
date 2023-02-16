import React, { Fragment, useState } from "react";
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, Loader, MobileNumber, CardLabelError } from "@egovernments/digit-ui-react-components";
import { Controller, useWatch } from "react-hook-form";

const SearchFields = ({ register, control, reset, tenantId, t, formState,tenantlocalties }) => {

    const formErrors = formState?.errors
    const propsForMobileNumber = {
        maxlength: 10,
        pattern: "[6-9][0-9]{9}",
        title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
        componentInFront: "+91",
    };

    const propsForOldConnectionNumberNpropertyId = {
        pattern: "[A-Za-z]{2}\-[A-Za-z]{2}\-[0-9]{4}\-[0-9]{2}\-[0-9]{2}\-[0-9]{6}",
        title: t("ERR_DEFAULT_INPUT_FIELD_MSG"),
    };
    let validation = {}

    const { isLoading, data: generateServiceType } = Digit.Hooks.useCommonMDMS(tenantId, "BillingService", "BillsGenieKey");

    const filterServiceType = generateServiceType?.BillingService?.BusinessService?.filter((element) => element.billGineiURL);
    let serviceTypeList = [];
    if (filterServiceType) {
        serviceTypeList = filterServiceType.map((element) => {
            return {
                name: Digit.Utils.locale.getTransformedLocale(`BILLINGSERVICE_BUSINESSSERVICE_${element.code}`),
                url: element.billGineiURL,
                businesService: element.code,
            };
        });
    }
    
    //const { data: tenantlocalties, isLoadingLocalities } = Digit.Hooks.useBoundaryLocalities(tenantId, 'revenue',{}, t);
    
    //const filteredData = generateServiceType?.["common-masters"]?.uiCommonPay.filter(element => element?.cancelBill)

    //let serviceTypeList = [];

    // filteredData && filteredData.length > 0 && filteredData.forEach(data => {
    //     generateServiceType?.BillingService?.BusinessService.forEach(service => {
    //         if (service.code === data.code) {
    //             serviceTypeList.push(service);
    //         }
    //     })
    // });

    // serviceTypeList = serviceTypeList?.map(element => {
    //     return {
    //         name: Digit.Utils.locale.getTransformedLocale(`BILLINGSERVICE_BUSINESSSERVICE_${element.code}`),
    //         url: element.billGineiURL,
    //         businesService: element.code,
    //     };
    // })
    // if (filterServiceType) {
    //     serviceTypeList = filterServiceType?.filter(element => element?.code?.includes?.("WS") || element?.code?.includes?.("SW") ).map((element) => {
    //         return {
    //             name: Digit.Utils.locale.getTransformedLocale(`BILLINGSERVICE_BUSINESSSERVICE_${element.code}`),
    //             url: element.billGineiURL,
    //             businesService: element.code,
    //         };
    //     });
    // }

    const serviceCategory = useWatch({ control: control, name: "businesService", defaultValue: "" });

    const isMobile = window.Digit.Utils.browser.isMobile();
    const getLabel = () => {
        const service = serviceCategory?.businesService
        if (service === "WS" || service === "SW" || !service)
            return <label style={isMobile ? {} : { marginLeft: "-80px", width: "120%" } }>{t("ABG_COMMON_TABLE_COL_CONSUMER_ID")}</label>
        else
            return <label style={isMobile ? {} : { marginLeft: "-80px", width: "120%" } }>{t("ABG_COMMON_TABLE_COL_PROPERTY_ID")}</label>

    }

    const getInputBasedOnServiceCategory = () => {
        const service = serviceCategory?.businesService
        if (service === "WS" || service === "SW" || !service) {
            return <SearchField>
                <label>{t("ABG_COMMON_TABLE_COL_CONSUMER_ID")}</label>
                <TextInput name="consumerCode"
                    inputRef={register({})}
                />
            </SearchField>
        } else {
            return <SearchField>
                <label>{t("ABG_COMMON_TABLE_COL_PROPERTY_ID")}</label>
                <TextInput name="consumerCode"
                    inputRef={register({})}
                />
            </SearchField>
        }
    }



    return (
        <>
            <SearchField>
                <label>
                    {`${t("ABG_COMMON_TABLE_COL_SERVICE_CATEGORY")} *`}
                </label>

                <Controller
                    control={control}
                    rules={{ required: t("REQUIRED_FIELD") }}
                    name="businesService"
                    render={(props) => (
                        <Dropdown
                            option={serviceTypeList}
                            select={(e) => {
                                props.onChange(e);
                            }}
                            optionKey="name"
                            onBlur={props.onBlur}
                            t={t}
                            selected={props.value}
                            style={isMobile?{} : {width:"125%"}}
                            optionCardStyles={{zIndex:"20"}}
                        />
                    )}
                />
                {formErrors && formErrors?.businesService && formErrors?.businesService?.type === "required" && (
                    <CardLabelError>{t(`CS_COMMON_REQUIRED`)}</CardLabelError>)}
            </SearchField>

            <SearchField>
                <label style={isMobile?{} : { width: "125%", marginLeft: "-40px" }}>
                    {`${t("CS_INBOX_LOCALITY_FILTER")} *`}
                </label>

                <Controller
                    control={control}
                    rules={{ required: t("REQUIRED_FIELD") }}
                    name="locality"
                    render={(props) => (
                        <Dropdown
                            option={tenantlocalties}
                            select={(e) => {
                                props.onChange(e);
                            }}
                            optionKey="name"
                            onBlur={props.onBlur}
                            t={t}
                            selected={props.value}
                            style={isMobile? {} : { width: "125%",marginLeft:"-40px" }}
                        />
                    )}
                />
                {formErrors && formErrors?.locality && formErrors?.locality?.type === "required" && (
                    <CardLabelError style={{marginLeft:"-35px"}}>{t(`CS_COMMON_REQUIRED`)}</CardLabelError>)}
            </SearchField>
            <SearchField>
                {getLabel()}
                <TextInput name="consumerCode" style={isMobile? {} : {marginLeft:"-80px",width:"120%"}}
                    inputRef={register({})}
                />
            </SearchField>
            <SearchField className="submit">
                <SubmitBar label={t("ABG_GROUP_BILL_SEARCH_BUTTON")} submit />
                <p
                    onClick={() => {
                        reset({
                            businesService: "",
                            locality:"",
                        });
                    }}
                >
                    {t("CS_COMMON_CLEAR_SEARCH")}
                </p>
            </SearchField>
        </>
    );
};
export default SearchFields;
