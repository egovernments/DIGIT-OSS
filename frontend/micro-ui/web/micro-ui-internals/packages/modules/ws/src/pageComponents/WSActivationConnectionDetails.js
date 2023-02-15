import { CardLabel, Dropdown, LabelFieldPair, Loader, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { stringReplaceAll, getPattern } from "../utils";
import cloneDeep from "lodash/cloneDeep";
import * as func from "../utils";
import { useForm, Controller, useWatch } from "react-hook-form";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";


const createConnectionDetails = (service) => (service == "WATER" ? {
    connectionType: "",
    noOfTaps: "",
    waterSource: "",
    pipeSize: "",
    waterSubSource: "",
    sourceSubData: ""
} : {
    noOfWaterClosets: "",
    noOfToilets: ""
});


const WSActivationConnectionDetails = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {


    const { t } = useTranslation();
    const { pathname } = useLocation();
    const filters = func.getQueryStringParams(location.search);
    const [connectionDetails, setConnectionDetails] = window.location.href.includes("modify") ? useState(
         formData?.connectionDetails ? [formData?.connectionDetails?.[0]] : [createConnectionDetails(filters?.service?.toUpperCase())]
    ) : useState(formData?.connectionDetails || [createConnectionDetails(filters?.service?.toUpperCase())]);
    const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateCode = Digit.ULBService.getStateId();
    const [isErrors, setIsErrors] = useState(false);


    const [pipeSizeList, setPipesizeList] = useState([]);
    const [connectionTypeList, setConnectionTypeList] = useState([]);
    const [waterSourceList, setWaterSourceList] = useState([]);
    const [waterSubSourceList, setWaterSubSourceList] = useState([]);

    const { isMdmsLoading, data: mdmsData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-masters", ["connectionType", "waterSource"]);
    const { isWSServicesCalculationLoading, data: wsServicesCalculationData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-calculation", ["PipeSize"]);

    useEffect(() => {
        const data = connectionDetails.map((e) => {
            return e;
        });
        onSelect(config?.key, data);
    }, [connectionDetails]);

    useEffect(() => {
        const list = wsServicesCalculationData?.["ws-services-calculation"]?.PipeSize || [];
        list?.forEach(data => data.i18nKey = data.size);

        const connectionTypes = mdmsData?.["ws-services-masters"]?.connectionType || [];
        connectionTypes?.forEach(data => data.i18nKey = `WS_CONNECTIONTYPE_${stringReplaceAll(data?.code?.toUpperCase(), " ", "_")}`);

        const waterSource = mdmsData?.["ws-services-masters"]?.waterSource && cloneDeep(mdmsData?.["ws-services-masters"]?.waterSource) || [];
        waterSource?.forEach(data => data.i18nKey = `WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(data?.code?.split('.')[0]?.toUpperCase(), " ", "_")}`);

        var flags = [], waterSourceOutput = [], l = waterSource.length, i;
        for (i = 0; i < l; i++) {
            if (flags[waterSource[i].i18nKey]) continue;
            flags[waterSource[i].i18nKey] = true;
            waterSourceOutput.push({
                i18nKey: waterSource?.[i]?.i18nKey,
                code: waterSource?.[i]?.code,
                // waterSubSource: waterSource?.[i]?.code?.split(".")[0]
            });
        }

        setPipesizeList(list);
        setConnectionTypeList(connectionTypes);
        setWaterSourceList(waterSourceOutput);

        if (connectionDetails?.[0]?.waterSource?.code) {
            const waterSubSource = mdmsData?.["ws-services-masters"]?.waterSource && cloneDeep(mdmsData?.["ws-services-masters"]?.waterSource) || [];
            waterSubSource?.forEach(data => data.i18nKey = `WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(data?.code?.toUpperCase(), ".", "_")}`);
            const listOfSubSource = waterSubSource?.filter(data => connectionDetails?.[0]?.waterSource?.code?.split('.')[0] == data?.code?.split(".")[0]);
            setWaterSubSourceList(listOfSubSource);
        }

    }, [mdmsData, wsServicesCalculationData]);

    useEffect(() => {
        if (userType === "employee") {
            onSelect(config.key, { ...formData[config.key], ...connectionDetails });
        }
    }, [connectionDetails]);

    if (isMdmsLoading || isWSServicesCalculationLoading) return <Loader />

    const commonProps = {
        focusIndex,
        allOwners: connectionDetails,
        setFocusIndex,
        formData,
        formState,
        t,
        setError,
        clearErrors,
        config,
        setConnectionDetails,
        setIsErrors,
        isErrors,
        connectionDetails,
        connectionTypeList,
        waterSourceList,
        waterSubSourceList,
        pipeSizeList,
        filters,
        setWaterSubSourceList,
        mdmsData
    };

    return (
        <React.Fragment>
            {connectionDetails.map((connectionDetail, index) => (
                <ConnectionDetails key={connectionDetail.key} index={index} connectionDetail={connectionDetail} {...commonProps} />
            ))}
        </React.Fragment>
    );
};

const ConnectionDetails = (_props) => {
    const {
        connectionDetail,
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
        connectionDetails,
        setIsErrors,
        isErrors,
        connectionTypeList,
        waterSourceList,
        waterSubSourceList,
        pipeSizeList,
        setConnectionDetails,
        filters,
        setWaterSubSourceList,
        mdmsData
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
        if (window.location.href.includes("modify")) trigger(); 
     }, [connectionDetails]);

    useEffect(() => {
        if (Object.entries(formValue).length > 0) {
            const keys = Object.keys(formValue);
            const part = {};
            keys.forEach((key) => (part[key] = connectionDetail[key]));
            if (!_.isEqual(formValue, part)) {
                let isErrorsFound = true;
                Object.keys(formValue).map(data => {
                    if (!formValue[data] && isErrorsFound) {
                        isErrorsFound = false
                        setIsErrors(false);
                      }
                    // if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
                    //     setIsErrors(true);
                    // }
                });
                if (isErrorsFound) setIsErrors(true);
                let ob = [{ ...formValue }];
                // let mcollectFormValue = JSON.parse(sessionStorage.getItem("mcollectFormData"));
                // mcollectFormValue = { ...mcollectFormValue, ...ob[0] }
                // sessionStorage.setItem("mcollectFormData", JSON.stringify(mcollectFormValue));
                setConnectionDetails(ob);
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
                    { !window.location.href.includes("by-config") && !window.location.href.includes("ws/modify-application") ?
                        <LabelFieldPair>
                            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_ACK_COMMON_APP_NO_LABEL")}*`}</CardLabel>
                            <div className="field">
                                <TextInput 
                                    disabled={true} 
                                    value={filters?.applicationNumber}>
                                </TextInput>
                            </div>
                            
                        </LabelFieldPair>
                    : null 
                    }
                    {filters?.service === "WATER" ? <div>
                        <LabelFieldPair>
                            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_CONN_TYPE")}*`}</CardLabel>
                            <Controller
                                control={control}
                                name={"connectionType"}
                                defaultValue={connectionDetail?.connectionType}
                                rules={{ required: t("REQUIRED_FIELD") }}
                                isMandatory={true}
                                render={(props) => (
                                    <Dropdown
                                        className="form-field"
                                        selected={getValues("connectionType")}
                                        disable={false}
                                        option={connectionTypeList}
                                        errorStyle={(localFormState.touched.connectionType && errors?.connectionType?.message) ? true : false}
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
                        <CardLabelError style={errorStyle}>{localFormState.touched.connectionType ? errors?.connectionType?.message : ""}</CardLabelError>
                        <LabelFieldPair>
                            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_WATER_SOURCE")}*`}</CardLabel>
                            <Controller
                                control={control}
                                name={"waterSource"}
                                defaultValue={connectionDetail?.waterSource}
                                rules={{ required: t("REQUIRED_FIELD") }}
                                isMandatory={true}
                                render={(props) => (
                                    <Dropdown
                                        className="form-field"
                                        selected={getValues("waterSource")}
                                        disable={false}
                                        option={waterSourceList}
                                        errorStyle={(localFormState.touched.waterSource && errors?.waterSource?.message) ? true : false}
                                        select={(e) => {


                                            let obj = { ...connectionDetails?.[0], waterSource: e?.code, waterSubSource: "" }
                                            setConnectionDetails([obj]);
                                            const waterSubSourceData = mdmsData?.["ws-services-masters"]?.waterSource && cloneDeep(mdmsData?.["ws-services-masters"]?.waterSource) || [];
                                            waterSubSourceData?.forEach(data => data.i18nKey = `WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(data?.code?.toUpperCase(), ".", "_")}`);
                                            const listOfSubSource = waterSubSourceData?.filter(data => e?.code?.split(".")[0] == data?.code?.split(".")[0]);
                                            setWaterSubSourceList(listOfSubSource);

                                            props.onChange(e);
                                        }}
                                        optionKey="i18nKey"
                                        onBlur={props.onBlur}
                                        t={t}
                                    />
                                )}
                            />
                        </LabelFieldPair>
                        <CardLabelError style={errorStyle}>{localFormState.touched.waterSource ? errors?.waterSource?.message : ""}</CardLabelError>
                        <LabelFieldPair>
                            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_WATER_SUB_SOURCE")}*`}</CardLabel>
                            <Controller
                                control={control}
                                name={"sourceSubData"}
                                defaultValue={connectionDetail?.sourceSubData}
                                rules={{ required: t("REQUIRED_FIELD") }}
                                isMandatory={true}
                                render={(props) => (
                                    <Dropdown
                                        className="form-field"
                                        selected={getValues("sourceSubData")}
                                        disable={false}
                                        option={waterSubSourceList}
                                        errorStyle={(localFormState.touched.sourceSubData && errors?.sourceSubData?.message) ? true : false}
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
                        <CardLabelError style={errorStyle}>{localFormState.touched.sourceSubData ? errors?.sourceSubData?.message : ""}</CardLabelError>
                        <LabelFieldPair>
                            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_PIPE_SIZE_IN_INCHES_LABEL")}*`}</CardLabel>
                            <Controller
                                control={control}
                                name={"pipeSize"}
                                defaultValue={connectionDetail?.pipeSize}
                                rules={{ required: t("REQUIRED_FIELD") }}
                                isMandatory={true}
                                render={(props) => (
                                    <Dropdown
                                        className="form-field"
                                        selected={getValues("pipeSize")}
                                        disable={false}
                                        option={pipeSizeList}
                                        errorStyle={(localFormState.touched.pipeSize && errors?.pipeSize?.message) ? true : false}
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
                        <CardLabelError style={errorStyle}>{localFormState.touched.pipeSize ? errors?.pipeSize?.message : ""}</CardLabelError>
                        <LabelFieldPair>
                            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_NO_OF_TAPS")}*`}</CardLabel>
                            <div className="field">
                                <Controller
                                    control={control}
                                    name="noOfTaps"
                                    defaultValue={connectionDetail?.noOfTaps}
                                    rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
                                    type="number"
                                    isMandatory={true}
                                    render={(props) => (
                                        <TextInput
                                            type="number"
                                            value={props.value}
                                            autoFocus={focusIndex.index === connectionDetail?.key && focusIndex.type === "noOfTaps"}
                                            errorStyle={(localFormState.touched.noOfTaps && errors?.noOfTaps?.message) ? true : false}
                                            onChange={(e) => {
                                                props.onChange(e.target.value);
                                                setFocusIndex({ index: connectionDetail?.key, type: "noOfTaps" });
                                            }}
                                            labelStyle={{ marginTop: "unset" }}
                                            onBlur={props.onBlur}
                                        />
                                    )}
                                />
                            </div>
                        </LabelFieldPair>
                        <CardLabelError style={errorStyle}>{localFormState.touched.noOfTaps ? errors?.noOfTaps?.message : ""}</CardLabelError>
                    </div>
                        : <div>
                            <LabelFieldPair>
                                <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_NUMBER_WATER_CLOSETS_LABEL")}*`}</CardLabel>
                                <div className="field">
                                    <Controller
                                        control={control}
                                        name="noOfWaterClosets"
                                        defaultValue={connectionDetail?.noOfWaterClosets}
                                        rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
                                        type="number"
                                        isMandatory={true}
                                        render={(props) => (
                                            <TextInput
                                                value={props.value}
                                                type="number"
                                                autoFocus={focusIndex.index === connectionDetail?.key && focusIndex.type === "noOfWaterClosets"}
                                                errorStyle={(localFormState.touched.noOfWaterClosets && errors?.noOfWaterClosets?.message) ? true : false}
                                                onChange={(e) => {
                                                    props.onChange(e.target.value);
                                                    setFocusIndex({ index: connectionDetail?.key, type: "noOfWaterClosets" });
                                                }}
                                                labelStyle={{ marginTop: "unset" }}
                                                onBlur={props.onBlur}
                                            />
                                        )}
                                    />
                                </div>
                            </LabelFieldPair>
                            <CardLabelError style={errorStyle}>{localFormState.touched.noOfWaterClosets ? errors?.noOfWaterClosets?.message : ""}</CardLabelError>
                            <LabelFieldPair>
                                <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_NO_OF_TOILETS")}*`}</CardLabel>
                                <div className="field">
                                    <Controller
                                        control={control}
                                        name="noOfToilets"
                                        defaultValue={connectionDetail?.noOfToilets}
                                        rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
                                        type="number"
                                        isMandatory={true}
                                        render={(props) => (
                                            <TextInput
                                                value={props.value}
                                                type="number"
                                                autoFocus={focusIndex.index === connectionDetail?.key && focusIndex.type === "noOfToilets"}
                                                errorStyle={(localFormState.touched.noOfToilets && errors?.noOfToilets?.message) ? true : false}
                                                onChange={(e) => {
                                                    props.onChange(e.target.value);
                                                    setFocusIndex({ index: connectionDetail?.key, type: "noOfToilets" });
                                                }}
                                                labelStyle={{ marginTop: "unset" }}
                                                onBlur={props.onBlur}
                                            />
                                        )}
                                    />
                                </div>
                            </LabelFieldPair>
                            <CardLabelError style={errorStyle}>{localFormState.touched.noOfToilets ? errors?.noOfToilets?.message : ""}</CardLabelError>
                        </div>}
                </div>
            </div>
        </div>
    );
};


export default WSActivationConnectionDetails;