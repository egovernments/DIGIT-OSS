import React, {Fragment} from "react"
import { Controller, useWatch } from "react-hook-form";
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, Loader } from "@egovernments/digit-ui-react-components";

const SearchFields = ({register, control, reset, tenantId, t }) => {
  let validation = {};

    return <>
        <SearchField>
            <label>{t("TL_TRADE_LICENSE_LABEL")}</label>
            <TextInput name="licenseNumbers" inputRef={register({})} />
        </SearchField>
        <SearchField>
            <label>{t("TL_TRADE_OWNER_S_NUMBER_LABEL")}</label>
            <TextInput name="mobileNumber" inputRef={register({})} 
            type="mobileNumber"
            componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>} 
            maxlength={10}
        {...(validation = {
                pattern: "[6-9]{1}[0-9]{9}",
                type: "tel",
                title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
            })}/>
        </SearchField>
        <SearchField>
            <label>{t("TL_SEARCH_TRADE_LICENSE_ISSUED_FROM")}</label>
            <Controller
                render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                name="fromDate"
                control={control}
            />
        </SearchField>
        <SearchField>
            <label>{t("TL_SEARCH_TRADE_LICENSE_ISSUED_TO")}</label>
            <Controller
                render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                name="toDate"
                control={control}
                />
        </SearchField>
        <SearchField>
            <label>{t("TL_LOCALIZATION_TRADE_NAME")}</label>
            <TextInput name="tradeName" inputRef={register({})}/>
        </SearchField>
        <SearchField className="submit">
            <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
            <p onClick={() => 
                {
                reset({ 
                    licenseNumbers: "", 
                    mobileNumber: "", 
                    fromDate: "",
                    toDate: "",
                    offset: 0,
                    limit: 10,
                    sortBy: "commencementDate",
                    sortOrder: "DESC",
                    status: "",
                    RenewalPending: true
                });
                previousPage ();
                }
            }>{t(`ES_COMMON_CLEAR_ALL`)}</p>
        </SearchField>
    </>
}
export default SearchFields