import React, { Fragment,useState } from "react";
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, Loader, MobileNumber, CardLabelError } from "@egovernments/digit-ui-react-components";
import { Controller, useWatch } from "react-hook-form";

const SearchFields = ({ register, control, reset, tenantId, t,formState}) => {
     
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
    const filteredData = generateServiceType?.["common-masters"]?.uiCommonPay.filter(element => element?.cancelBill)

    let serviceTypeList = [];

    filteredData && filteredData.length > 0 && filteredData.forEach(data => {
        generateServiceType?.BillingService?.BusinessService.forEach(service => {
            if (service.code === data.code) {
                serviceTypeList.push(service);
            }
        })
    });

    serviceTypeList = serviceTypeList?.map(element => {
        return {
            name: Digit.Utils.locale.getTransformedLocale(`BILLINGSERVICE_BUSINESSSERVICE_${element.code}`),
            url: element.billGineiURL,
            businesService: element.code,
        };
    })
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
    
    
    const getLabel = () => {
        const service = serviceCategory?.businesService
        if (service === "WS" || service === "SW" || !service)
            return <label>{t("ABG_COMMON_TABLE_COL_CONSUMER_ID")}</label>
        else
            return <label>{t("ABG_COMMON_TABLE_COL_PROPERTY_ID")}</label>
    }

    const getInputBasedOnServiceCategory = () => {
        const service = serviceCategory?.businesService
        if(service==="WS" || service==="SW" || !service){
            return <SearchField>
                <label>{t("ABG_COMMON_TABLE_COL_CONSUMER_ID")}</label>
                <TextInput name="consumerCode"
                    inputRef={register({})}
                />
            </SearchField>
        }else {
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
                            optionCardStyles={{zIndex:"20"}}
                        />
                    )}
                />
                {formErrors && formErrors?.businesService && formErrors?.businesService?.type === "required" && (
                    <CardLabelError>{t(`CS_COMMON_REQUIRED`)}</CardLabelError>)}
            </SearchField>
            <SearchField>
                <label>{t("ABG_BILL_NUMBER_LABEL")}</label>
                <TextInput
                    name="billNo"
                    inputRef={register({})}
                    
                />
            </SearchField>
            <SearchField>
                {getLabel()}
                <TextInput name="consumerCode"
                    inputRef={register({})}
                />
            </SearchField>
            <SearchField>
                <label>{t("ABG_MOBILE_NO_LABEL")}</label>
                <MobileNumber name="mobileNumber" inputRef={register({})} {...propsForMobileNumber} />
            </SearchField>
            <SearchField className="submit">
                <SubmitBar label={t("ABG_GROUP_BILL_SEARCH_BUTTON")} submit />
                <p
                    onClick={() => {
                        reset({
                            businesService: "",
                            mobileNumber: "",
                            consumerCode:"",
                            billNo:""
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
