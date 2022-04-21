import React, { Fragment } from "react";
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, CardLabelError, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useWatch } from "react-hook-form";


const getSearchField = (field, formState, Controller, register, control, t) => {
    const formErrors = formState?.errors;
    switch (field.type) {
        case "singlevaluelist":
            return (<SearchField>
                <label>{t(`${field.label}${field.isMandatory?"*":""}`)}</label>
                <Controller
                    control={control}
                    name={field.name}
                    rules={{
                        required: field.isMandatory
                    }}
                    render={(props) => (
                        <Dropdown selected={props.value} select={props.onChange} onBlur={props.onBlur} option={Object.values(field.defaultValue).map(el => t(el))} t={t} />
                    )}
                />
                {formErrors && formErrors?.[field.name] && formErrors?.[field.name]?.type === "required" && (
                    <CardLabelError>{t(`This field is required`)}</CardLabelError>
                )}
            </SearchField>
            )
        case "epoch":
            return (
                <>
                <SearchField>
                        <label>{`${t(field.label)}${field.isMandatory ? "*" : ""}`}</label>
                    <Controller 
                    rules = {{
                        required:field.isMandatory
                    }}
                    render={(props) => <DatePicker date={props.value} onChange={props.onChange} />} 
                    name={field.name} 
                    control={control} />
                        {formErrors && formErrors?.[field.name] && formErrors?.[field.name]?.type === "required" && (
                            <CardLabelError>{t(`This field is required`)}</CardLabelError>
                        )}
                </SearchField>
                
                </>
            )

        default:
            return (
                <div>Field not defined</div>
            )
    }
}

const SearchFormFieldsComponent = ({ formState, Controller, register, control, t,reset,data }) => {
    let resetObj={};
    data?.reportDetails?.searchParams?.map(el=> resetObj[el?.name]="")
    return (
        <>
            {data?.reportDetails?.searchParams?.map(field => (
                getSearchField(field, formState, Controller, register, control, t)
            ))}
            <SearchField className="submit">
                <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
                <p
                    style={{ marginTop: "24px" }}
                    onClick={() => {
                        reset(resetObj)
                    }}
                >
                    {t(`ES_COMMON_CLEAR_ALL`)}
                </p>
            </SearchField>
        </>
    );
}

export default SearchFormFieldsComponent