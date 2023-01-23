import React, { Fragment } from "react";
import { Controller, useWatch } from "react-hook-form";
import {
    TextInput,
    SubmitBar,
    LinkLabel,
    ActionBar,
    CloseSvg,
    DatePicker,
    CardLabelError,
    SearchForm,
    SearchField,
    Dropdown,
    Table,
    Card,
    MobileNumber,
    Loader,
    CardText,
    Header,
} from "@egovernments/digit-ui-react-components";
const SearchFields = ({ register, control, reset, tenantId, t, previousPage, formState, isLoading }) => {
const isMobile = window.Digit.Utils.browser.isMobile();

    return (
        <>
            <SearchField className="pt-form-field">
                <label>{t("AUDIT_FROM_DATE_LABEL")}</label>
                <Controller
                    render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                    name="fromDate"
                    control={control}
                />
            </SearchField>
            <SearchField className="pt-form-field">
                <label>{t("AUDIT_TO_DATE_LABEL")}</label>
                <Controller
                    render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                    name="toDate"
                    control={control}
                />
            </SearchField>
            <SearchField className="pt-search-action-submit">
                <SubmitBar style={{marginTop: isMobile? "510px":"25px", marginLeft:isMobile? "0":"-30px"  ,maxWidth : isMobile? "100%":"240px",
}} label={t("ES_COMMON_APPLY")} submit />
            </SearchField>
        </>
    );
};
export default SearchFields;
