import React, {Fragment} from "react"
import { Controller, useWatch } from "react-hook-form";
import { TextInput, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, SearchField, Dropdown, Table, Card, MobileNumber, Loader, CardText, Header } from "@egovernments/digit-ui-react-components";

const SearchFields = ({register, control, reset, tenantId, t, formState, setShowToast, previousPage }) => {

    return <>
         <SearchField>
         <div className="filter-label">{t("ABG_SERVICE_CATEGORY_LABEL")}</div>
              <Dropdown name="Dropdown" t={t} option={serviceTypeList} value={service} selected={service} select={setService} optionKey={"name"} />
                    <label>{t("PT_APPLICATION_NO_LABEL")}</label>
                    <TextInput name="acknowledgementIds" inputRef={register({})} />
                </SearchField>
                <SearchField>
                    <label>{t("PT_SEARCHPROPERTY_TABEL_PID")}</label>
                    <TextInput name="propertyIds" inputRef={register({})} />
                </SearchField>
                <SearchField>
                <label>{t("PT_OWNER_MOBILE_NO")}</label>
                <MobileNumber
                    name="mobileNumber"
                    inputRef={register({
                    minLength: {
                        value: 10,
                        message: t("CORE_COMMON_MOBILE_ERROR"),
                    },
                    maxLength: {
                        value: 10,
                        message: t("CORE_COMMON_MOBILE_ERROR"),
                    },
                    pattern: {
                    value: /[6789][0-9]{9}/,
                    //type: "tel",
                    message: t("CORE_COMMON_MOBILE_ERROR"),
                    },
                })}
                type="number"
                componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>}
                //maxlength={10}
                />
                 <CardLabelError>{formState?.errors?.["mobileNumber"]?.message}</CardLabelError>
                </SearchField>
                <SearchField>
                    <label>{t("PT_SEARCHPROPERTY_TABEL_APPLICATIONTYPE")}</label>
                    <Controller
                            control={control}
                            name="creationReason"
                            render={(props) => (
                                <Dropdown
                                selected={props.value}
                                select={props.onChange}
                                onBlur={props.onBlur}
                                optionKey="i18nKey"
                                t={t}
                                disable={false}
                                />
                            )}
                            />
                </SearchField>
                <SearchField>
                    <label>{t("ES_SEARCH_PROPERTY_STATUS")}</label>
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
                                disable={false}
                                />
                            )}
                            />
                </SearchField>
                {/* <SearchField>
                    <label>{t("PT_FROM_DATE")}</label>
                    <Controller
                        render={(props) => <DatePicker date={props.value} disabled={false} onChange={props.onChange} />}
                        name="fromDate"
                        control={control}
                        />
                </SearchField>
                <SearchField>
                    <label>{t("PT_TO_DATE")}</label>
                    <Controller
                        render={(props) => <DatePicker date={props.value} disabled={false} onChange={props.onChange} />}
                        name="toDate"
                        control={control}
                        />
                </SearchField> */}
                <SearchField className="submit">
                    <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
                    <p style={{marginTop:"10px"}}
                     onClick={() => {
                        reset({ 
                            acknowledgementIds: "", 
                            fromDate: "", 
                            toDate: "",
                            propertyIds: "",
                            Dropdown:"",
                            mobileNumber:"",
                            status: "",
                            creationReason: "",
                            offset: 0,
                            limit: 10,
                            sortBy: "commencementDate",
                            sortOrder: "DESC"
                        });
                        setShowToast(null);
                        previousPage();
                    }}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
                </SearchField>
    </>
}
export default SearchFields