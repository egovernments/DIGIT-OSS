import React, { Fragment } from "react";
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, CardLabelError, MobileNumber,MultiSelectDropdown,FilterFormField } from "@egovernments/digit-ui-react-components";
import { useWatch } from "react-hook-form";


const getSearchField = (field, formState, Controller, register, control, t) => {
    const formErrors = formState?.errors; 

    switch (field.type) {
        case "string":
            return (
                <SearchField>
                    <label>{t(`${field.label}${field.isMandatory ? "*" : ""}`)}</label>
                    <TextInput
                        name={field.name}
                        type="text"
                        inputRef={register({
                            maxLength: {
                                value: 60,
                                message: t("EXCEEDS_60_CHAR_LIMIT"),
                            },
                            required: field.isMandatory
                        })}
                    />
                </SearchField>
            )

        case "singlevaluelist":
            var optionsArr = Object.values(field.defaultValue)?.map(el => t(el))
            optionsArr.unshift(t('ALL'))
            return (<SearchField>
                <label>{t(`${field.label}${field.isMandatory?"*":""}`)}</label>
                <Controller
                    control={control}
                    name={field.name}
                    rules={{
                        required: field.isMandatory
                    }}
                    render={(props) => (
                        <Dropdown selected={props.value} select={props.onChange} onBlur={props.onBlur} option={optionsArr} t={t} />
                    )}
                />
                {formErrors && formErrors?.[field.name] && formErrors?.[field.name]?.type === "required" && (
                    <CardLabelError>{t(`This field is required`)}</CardLabelError>
                )}
            </SearchField>
            )
        case "multivaluelist":
            var optionsArr = Object.values(field.defaultValue).map(el => t(el))
            optionsArr.unshift(t('ALL'))
            const optionsObjArr = optionsArr.map((option)=> {
                return {
                    name: field.islocalisationRequired ? t(`${field.localisationPrefix}${option}`):option
                }
            })
            optionsArr.unshift(t('ALL'))
            const selectMulti = (listOfSelections, props) => {
                const res = listOfSelections.map((propsData) => {
                    const data = propsData[1]
                    return data
                })
                return props.onChange(res);
            };
            return (
            <SearchField>
                <label>{t(`${field.label}${field.isMandatory ? "*" : ""}`)}</label>
                <Controller
                    control={control}
                    name={field.name}
                    rules={{
                        required: field.isMandatory
                    }}
                    render={(props) => (
                        <MultiSelectDropdown
                            options={optionsObjArr}
                            props={props}
                            isPropsNeeded={true}
                            onSelect={selectMulti}
                            selected={props?.value}
                            optionsKey="name"
                            defaultUnit={t("BPA_SELECTED_TEXT")}
                        />
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

    data?.reportDetails?.searchParams?.map(el => el.type === "multivaluelist" ? resetObj[el?.name] = [] : resetObj[el?.name] = "")
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