import { CardLabel, LabelFieldPair, TextInput, CardLabelError, DatePicker } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { getPattern } from "../utils";
import * as func from "../utils";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const createActivationDetails = () => ({
    meterId: "",
    meterInstallationDate: null,
    meterInitialReading: "",
    connectionExecutionDate: null
});


const WSActivationPageDetails = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
    const { t } = useTranslation();
    const filters = func.getQueryStringParams(location.search);
    const [activationDetails, setActivationDetails] = window.location.href.includes("modify") ? useState(
         formData?.activationDetails ? [formData?.activationDetails?.[0]] : [createActivationDetails()]
    ) : useState(formData?.activationDetails || [createActivationDetails()]);
    const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
    const [isErrors, setIsErrors] = useState(false);

    useEffect(() => {
        const data = activationDetails.map((e) => {
            return e;
        });
        onSelect(config?.key, data);
    }, [activationDetails]);

    useEffect(() => {
        if (userType === "employee") {
            onSelect(config.key, { ...formData[config.key], ...activationDetails });
        }
    }, [activationDetails]);

    const commonProps = {
        focusIndex,
        allOwners: activationDetails,
        setFocusIndex,
        formData,
        formState,
        t,
        setError,
        clearErrors,
        config,
        setActivationDetails,
        setIsErrors,
        isErrors,
        activationDetails,
        filters
    };

    return (
        <React.Fragment>
            {activationDetails.map((activationDetail, index) => (
                <ConnectionDetails key={activationDetail.key} index={index} activationDetail={activationDetail} {...commonProps} />
            ))}
        </React.Fragment>
    );
};

const ConnectionDetails = (_props) => {
    const {
        activationDetail,
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
        activationDetails,
        setIsErrors,
        isErrors,
        filters,
        setActivationDetails
    } = _props;

    const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger, getValues } = useForm();
    const formValue = watch();
    const { errors } = localFormState;
    const isMobile = window.Digit.Utils.browser.isMobile();
    let isEmployee = window.location.href.includes("/employee")

    useEffect(() => {
        trigger();
    }, []);

    useEffect(() => {
        if (Object.entries(formValue).length > 0) {
            const keys = Object.keys(formValue);
            const part = {};
            keys.forEach((key) => (part[key] = activationDetail[key]));
            if (!_.isEqual(formValue, part)) {
                let isErrorsFound = true;
                Object.keys(formValue).map(data => {
                    if (!formValue[data] && isErrorsFound) {
                        isErrorsFound = false
                        setIsErrors(false);
                      }
                });
                if (isErrorsFound) setIsErrors(true);
                let ob = [{ ...formValue }];
                setActivationDetails(ob);
                trigger();
            }
        }
    }, [formValue]);

    useEffect(() => {
        trigger();
    }, [formData?.connectionDetails?.[0]?.connectionType]);

    useEffect(() => {
        if (window.location.href.includes("modify")) trigger(); 
     }, [activationDetails, formData?.ConnectionDetails, formData?.ConnectionHolderDetails, formData?.DocumentsRequired, formData?.connectionDetails, formData?.cpt]);


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
        <div>
            <div style={{ marginBottom: "16px" }}>
                {filters?.service === "WATER" && formData?.connectionDetails?.[0]?.connectionType?.code?.toUpperCase() === "METERED" ? <div>
                    <LabelFieldPair>
                        <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_METER_ID")}*`}</CardLabel>
                        <div className="field">
                            <Controller
                                control={control}
                                name="meterId"
                                defaultValue={activationDetail?.meterId}
                                type="number"
                                rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
                                isMandatory={true}
                                render={(props) => (
                                    <TextInput
                                        type="number"
                                        value={props.value}
                                        autoFocus={focusIndex.index === activationDetail?.key && focusIndex.type === "meterId"}
                                        errorStyle={(localFormState.touched.meterId && errors?.meterId?.message) ? true : false}
                                        onChange={(e) => {
                                            props.onChange(e.target.value);
                                            setFocusIndex({ index: activationDetail?.key, type: "meterId" });
                                        }}
                                        labelStyle={{ marginTop: "unset" }}
                                        onBlur={props.onBlur}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}>{localFormState.touched.meterId ? errors?.meterId?.message : ""}</CardLabelError>
                    <LabelFieldPair>
                        <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_ADDN_DETAIL_METER_INSTALL_DATE")}*`}</CardLabel>
                        <div className="field">
                            <Controller
                                name="meterInstallationDate"
                                rules={{ required: t("REQUIRED_FIELD") }}
                                // isMandatory={true}
                                defaultValue={activationDetail?.meterInstallationDate}
                                control={control}
                                render={(props) => (
                                    <DatePicker
                                        date={props.value}
                                        name="meterInstallationDate"
                                        onChange={props.onChange}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}>{localFormState.touched.meterInstallationDate ? errors?.meterInstallationDate?.message : ""}</CardLabelError>
                    <LabelFieldPair>
                        <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_INITIAL_METER_READING_LABEL")}*`}</CardLabel>
                        <div className="field">
                            <Controller
                                type="number"
                                control={control}
                                name="meterInitialReading"
                                rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
                                defaultValue={activationDetail?.meterInitialReading}
                                isMandatory={true}
                                render={(props) => (
                                    <TextInput
                                        type="number"
                                        value={props.value}
                                        autoFocus={focusIndex.index === activationDetail?.key && focusIndex.type === "meterInitialReading"}
                                        errorStyle={(localFormState.touched.meterInitialReading && errors?.meterInitialReading?.message) ? true : false}
                                        onChange={(e) => {
                                            props.onChange(e.target.value);
                                            setFocusIndex({ index: activationDetail?.key, type: "meterInitialReading" });
                                        }}
                                        labelStyle={{ marginTop: "unset" }}
                                        onBlur={props.onBlur}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}>{localFormState.touched.meterInitialReading ? errors?.meterInitialReading?.message : ""}</CardLabelError>
                </div> : null}
                <LabelFieldPair>
                    <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_CONN_EXECUTION_DATE")}*`}</CardLabel>
                    <div className="field">
                        <Controller
                            name="connectionExecutionDate"
                            rules={{ required: t("REQUIRED_FIELD") }}
                            // isMandatory={true}
                            defaultValue={activationDetail?.connectionExecutionDate}
                            control={control}
                            render={(props) => (
                                <DatePicker
                                    date={props.value}
                                    name="connectionExecutionDate"
                                    onChange={props.onChange}
                                    autoFocus={focusIndex.index === activationDetail?.key && focusIndex.type === "connectionExecutionDate"}
                                    errorStyle={(localFormState.touched.connectionExecutionDate && errors?.connectionExecutionDate?.message) ? true : false}
                                />
                            )}
                        />
                    </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.connectionExecutionDate ? errors?.connectionExecutionDate?.message : ""}</CardLabelError>
                {window.location.href.includes("modify") ? <div>
                <LabelFieldPair>
                    <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_MODIFICATIONS_EFFECTIVE_FROM")}*`}</CardLabel>
                    <div className="field">
                        <Controller
                            name="dateEffectiveFrom"
                            rules={{ required: t("REQUIRED_FIELD") }}
                            isMandatory={true}
                            defaultValue={activationDetail?.dateEffectiveFrom}
                            control={control}
                            render={(props) => (
                                <DatePicker
                                    date={props.value}
                                    name="dateEffectiveFrom"
                                    onChange={props.onChange}
                                    autoFocus={focusIndex.index === activationDetail?.key && focusIndex.type === "dateEffectiveFrom"}
                                    errorStyle={(localFormState.touched.dateEffectiveFrom && errors?.dateEffectiveFrom?.message) ? true : false}
                                />
                            )}
                        />
                    </div>
                </LabelFieldPair>
                <CardLabelError style={errorStyle}>{localFormState.touched.dateEffectiveFrom ? errors?.dateEffectiveFrom?.message : ""}</CardLabelError>
                </div> : null}
            </div>
        </div>
    );
};

export default WSActivationPageDetails;