import { CardLabel, Dropdown, LabelFieldPair, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import * as func from "../utils";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const createPlumberDetails = () => ([{
    plumberName: "",
    plumberMobileNo: "",
    plumberLicenseNo: "",
    detailsProvidedBy: ""
}]);


const WSActivationPlumberDetails = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
    const { t } = useTranslation();
    const filters = func.getQueryStringParams(location.search);
    const [plumberDetails, setPlumberDetails] = useState(formData?.plumberDetails || [createPlumberDetails()]);
    const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
    const [isErrors, setIsErrors] = useState(false);

    const options = [
        { i18nKey: "WS_PLUMBER_ULB", code: "ULB" },
        { i18nKey: "WS_PLUMBER_SELF", code: "Self" },
    ];


    useEffect(() => {
        const data = plumberDetails.map((e) => {
            return e;
        });
        onSelect(config?.key, data);
    }, [plumberDetails]);


    const commonProps = {
        focusIndex,
        allOwners: plumberDetails,
        setFocusIndex,
        formData,
        formState,
        t,
        setError,
        clearErrors,
        config,
        setPlumberDetails,
        setIsErrors,
        isErrors,
        plumberDetails,
        filters,
        options,
        setPlumberDetails
    };

    return (
        <React.Fragment>
            {plumberDetails.map((plumberDetail, index) => (
                <PlumberDetails key={plumberDetail.key} index={index} plumberDetail={plumberDetail} {...commonProps} />
            ))}
        </React.Fragment>
    );
};

const PlumberDetails = (_props) => {
    const {
        plumberDetail,
        index,
        focusIndex,
        allOwners,
        setFocusIndex,
        t,
        formData,
        config,
        setError,
        clearErrors,
        formState,
        isEdit,
        plumberDetails,
        setIsErrors,
        isErrors,
        filters,
        options,
        setPlumberDetails
    } = _props;

    const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger, getValues } = useForm();
    const formValue = watch();
    const { errors } = localFormState;
    const isMobile = window.Digit.Utils.browser.isMobile();

    useEffect(() => {
        trigger();
    }, []);

    useEffect(() => {
        if (Object.entries(formValue).length > 0) {
            const keys = Object.keys(formValue);
            const part = {};
            keys.forEach((key) => (part[key] = plumberDetail[key]));
            if (!_.isEqual(formValue, part)) {
                Object.keys(formValue).map(data => {
                    if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
                        setIsErrors(true);
                    }
                });
                let ob = [{ ...formValue }];
                let mcollectFormValue = JSON.parse(sessionStorage.getItem("mcollectFormData"));
                mcollectFormValue = { ...mcollectFormValue, ...ob[0] }
                sessionStorage.setItem("mcollectFormData", JSON.stringify(mcollectFormValue));
                setPlumberDetails(ob);
                trigger();
            }
        }
    }, [formValue]);


    useEffect(() => {
        if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
            setError(config.key, { type: errors });
        }
        else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
            clearErrors(config.key);
        }
    }, [errors]);

    const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
    return (
        <div >
            <div style={{ marginBottom: "16px" }}>
                <div>
                    <LabelFieldPair>
                        <CardLabel style={{ marginTop: "-5px" }} style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY")}:`}</CardLabel>
                        <Controller
                            control={control}
                            name={"detailsProvidedBy"}
                            defaultValue={plumberDetail?.detailsProvidedBy}
                            // rules={{ required: t("REQUIRED_FIELD") }}
                            render={(props) => (
                                <Dropdown
                                    className="form-field"
                                    selected={getValues("detailsProvidedBy")}
                                    disable={false}
                                    option={options}
                                    errorStyle={(localFormState.touched.detailsProvidedBy && errors?.detailsProvidedBy?.message) ? true : false}
                                    select={(e) => {
                                        props.onChange(e);
                                    }}
                                    optionKey="i18nKey"
                                    onBlur={props.onBlur}
                                    t={t}
                                />
                            )}
                        />
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}>{localFormState.touched.detailsProvidedBy ? errors?.detailsProvidedBy?.message : ""}</CardLabelError>
                    {plumberDetail?.detailsProvidedBy?.code == "ULB" && <LabelFieldPair>
                        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_PLIMBER_LICENSE_NO_LABEL")}:`}</CardLabel>
                        <div className="field">
                            <Controller
                                control={control}
                                name="plumberLicenseNo"
                                defaultValue={plumberDetail?.plumberLicenseNo}
                                // rules={{ validate: (e) => ((e && getPattern("Amount").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) }}
                                render={(props) => (
                                    <TextInput
                                        value={props.value}
                                        autoFocus={focusIndex.index === plumberDetail?.key && focusIndex.type === "plumberLicenseNo"}
                                        errorStyle={(localFormState.touched.plumberLicenseNo && errors?.plumberLicenseNo?.message) ? true : false}
                                        onChange={(e) => {
                                            props.onChange(e.target.value);
                                            setFocusIndex({ index: plumberDetail?.key, type: "plumberLicenseNo" });
                                        }}
                                        labelStyle={{ marginTop: "unset" }}
                                        onBlur={props.onBlur}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>}
                    {plumberDetail?.detailsProvidedBy?.code == "ULB" && <CardLabelError style={errorStyle}>{localFormState.touched.plumberLicenseNo ? errors?.plumberLicenseNo?.message : ""}</CardLabelError>}
                    {plumberDetail?.detailsProvidedBy?.code == "ULB" && <LabelFieldPair>
                        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_ADDN_DETAILS_PLUMBER_NAME_LABEL")}:`}</CardLabel>
                        <div className="field">
                            <Controller
                                control={control}
                                name="plumberName"
                                defaultValue={plumberDetail?.plumberName}
                                // rules={{ validate: (e) => ((e && getPattern("Amount").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) }}
                                render={(props) => (
                                    <TextInput
                                        value={props.value}
                                        autoFocus={focusIndex.index === plumberDetail?.key && focusIndex.type === "plumberName"}
                                        errorStyle={(localFormState.touched.plumberName && errors?.plumberName?.message) ? true : false}
                                        onChange={(e) => {
                                            props.onChange(e.target.value);
                                            setFocusIndex({ index: plumberDetail?.key, type: "plumberName" });
                                        }}
                                        labelStyle={{ marginTop: "unset" }}
                                        onBlur={props.onBlur}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>}
                    {plumberDetail?.detailsProvidedBy?.code == "ULB" && <CardLabelError style={errorStyle}>{localFormState.touched.plumberName ? errors?.plumberName?.message : ""}</CardLabelError>}
                    {plumberDetail?.detailsProvidedBy?.code == "ULB" && <LabelFieldPair>
                        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_PLUMBER_MOBILE_NO_LABEL")}:`}</CardLabel>
                        <div className="field">
                            <Controller
                                control={control}
                                name="mobileNumber"
                                defaultValue={plumberDetail?.plumberMobileNo}
                                // rules={{ validate: (e) => ((e && getPattern("Amount").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) }}
                                type="mobileNumber"
                                render={(props) => (
                                    <TextInput
                                        type="mobileNumber"
                                        value={props.value}
                                        autoFocus={focusIndex.index === plumberDetail?.key && focusIndex.type === "plumberMobileNo"}
                                        errorStyle={(localFormState.touched.plumberMobileNo && errors?.plumberMobileNo?.message) ? true : false}
                                        onChange={(e) => {
                                            props.onChange(e.target.value);
                                            setFocusIndex({ index: plumberDetail?.key, type: "plumberMobileNo" });
                                        }}
                                        labelStyle={{ marginTop: "unset" }}
                                        onBlur={props.onBlur}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>}
                    {plumberDetail?.detailsProvidedBy?.code == "ULB" && <CardLabelError style={errorStyle}>{localFormState.touched.plumberMobileNo ? errors?.plumberMobileNo?.message : ""}</CardLabelError>}
                </div>
            </div>
        </div>
    );
};


export default WSActivationPlumberDetails;