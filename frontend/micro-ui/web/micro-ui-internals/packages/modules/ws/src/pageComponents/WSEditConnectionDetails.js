import { CardLabel, Dropdown, LabelFieldPair, Loader, TextInput, CardLabelError, CheckBox, StatusTable, Row, CardSubHeader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { getPattern } from "../utils";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import * as func from "../utils/"

const createConnectionDetails = () => ({
    water: true,
    sewerage: false,
    applicationNo: "",
    serviceName: "",
    proposedPipeSize: "",
    proposedTaps: "",
    proposedToilets: "",
    proposedWaterClosets: ""
});


const WSEditConnectionDetails = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {

    let filters = func.getQueryStringParams(location.search);
    const applicationNumber = filters?.applicationNumber;
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const [connectionDetails, setConnectionDetails] = useState(formData?.ConnectionDetails ? [formData?.ConnectionDetails?.[0]] : [createConnectionDetails()]);
    const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
    const stateCode = Digit.ULBService.getStateId();
    const [isErrors, setIsErrors] = useState(false);
    const [waterSewarageSelection, setWaterSewarageSelection] = useState({ water: true, sewerage: false });

    const [pipeSizeList, setPipesizeList] = useState([]);

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
        setPipesizeList(list);
    }, [wsServicesCalculationData]);

    useEffect(() => {
        if (userType === "employee") {
            onSelect(config.key, { ...formData[config.key], ...connectionDetails });
        }
        if (connectionDetails?.[0]?.water) setWaterSewarageSelection({ water: true, sewerage: false })

        if (connectionDetails?.[0]?.sewerage) setWaterSewarageSelection({ water: false, sewerage: true })
    }, [connectionDetails]);

    useEffect(() => {
        if (!formData?.ConnectionDetails) {
            setConnectionDetails([createConnectionDetails()]);
        }
    }, [formData?.ConnectionDetails]);

    if (isWSServicesCalculationLoading) return <Loader />

    const commonProps = {
        focusIndex,
        connectionDetails,
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
        pipeSizeList,
        wsServicesCalculationData,
        waterSewarageSelection,
        applicationNumber
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
        focusIndex,
        setFocusIndex,
        t,
        config,
        setError,
        clearErrors,
        formState,
        setIsErrors,
        isErrors,
        connectionTypeList,
        setConnectionDetails,
        wsServicesCalculationData,
        pipeSizeList,
        connectionDetails,
        waterSewarageSelection,
        applicationNumber
    } = _props;
    
    const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger, getValues } = useForm();
    const formValue = watch();
    const { errors } = localFormState;

    useEffect(() => {
        trigger();
    }, []);

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
                });
                if (isErrorsFound) setIsErrors(true);
                let ob = [{ ...formValue }];
                setConnectionDetails(ob);
                trigger();
            }
        }
    }, [formValue, connectionDetails]);

    useEffect(() => {
        let isClear = true;
        Object.keys(connectionDetails?.[0])?.map(data => {
            if (!connectionDetails[0][data] && connectionDetails[0][data] != false && isClear) isClear = false
        })
        if (isClear && Object.keys(connectionDetails?.[0])?.length > 1) {
            clearErrors("ConnectionDetails");
        }

        if (!connectionDetails?.[0]?.sewerage) {
            clearErrors(config.key, { type: "proposedToilets" })
            clearErrors(config.key, { type: "proposedWaterClosets" })
        }

        if (!connectionDetails?.[0]?.water) {
            clearErrors(config.key, { type: "proposedPipeSize" })
            clearErrors(config.key, { type: "proposedTaps" })
        }
        trigger();
    }, [connectionDetails, waterSewarageSelection]);


    useEffect(() => {
        if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
            setError(config.key, { type: errors });
        }
        else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
            clearErrors(config.key);
        }
    }, [errors]);

    const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
    const isMobile = window.Digit.Utils.browser.isMobile();
    const isEmployee = window.location.href.includes("/employee")

    return (
        <div >{
            window.location.href.includes("modify-application") ? 
            <div>
                <CardSubHeader>{t("WS_COMMON_SERV_DETAIL")}</CardSubHeader>
                <StatusTable>
                        <Row className="border-none" key={`WS_MYCONNECTIONS_CONSUMER_NO`} label={`${t(`WS_MYCONNECTIONS_CONSUMER_NO`)}`} text={applicationNumber} />
                    <Row className="border-none" key={`WS_SERVICE_NAME_LABEL`} label={`${t(`WS_SERVICE_NAME_LABEL`)}`} text={connectionDetail?.serviceName} />
                </StatusTable>
            </div> : 
            <div style={{ marginBottom: "16px" }}>
                <LabelFieldPair>
                    <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("PDF_STATIC_LABEL_APPLICATION_NUMBER_LABEL")}`}</CardLabel>
                    <div className="field">
                        <Controller
                            control={control}
                            name="applicationNo"
                            defaultValue={connectionDetail?.applicationNo}
                            isMandatory={true}
                            render={(props) => (
                                <TextInput
                                    value={props.value}
                                    autoFocus={focusIndex.index === connectionDetail?.key && focusIndex.type === "applicationNo"}
                                    errorStyle={(localFormState.touched.applicationNo && errors?.applicationNo?.message) ? true : false}
                                    onChange={(e) => {
                                        props.onChange(e.target.value);
                                        setFocusIndex({ index: connectionDetail?.key, type: "applicationNo" });
                                    }}
                                    labelStyle={{ marginTop: "unset" }}
                                    onBlur={props.onBlur}
                                    disabled={true}
                                    disable={true}
                                />
                            )}
                        />
                    </div>
                </LabelFieldPair>
                <LabelFieldPair>
                    <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_SERVICE_NAME_LABEL")}`}</CardLabel>
                    <div className="field">
                        <Controller
                            control={control}
                            name="serviceName"
                            defaultValue={connectionDetail?.serviceName}
                            isMandatory={true}
                            render={(props) => (
                                <TextInput
                                    value={props.value}
                                    autoFocus={focusIndex.index === connectionDetail?.key && focusIndex.type === "serviceName"}
                                    errorStyle={(localFormState.touched.serviceName && errors?.serviceName?.message) ? true : false}
                                    onChange={(e) => {
                                        props.onChange(e.target.value);
                                        setFocusIndex({ index: connectionDetail?.key, type: "serviceName" });
                                    }}
                                    labelStyle={{ marginTop: "unset" }}
                                    onBlur={props.onBlur}
                                    disabled={true}
                                    disable={true}
                                />
                            )}
                        />
                    </div>
                </LabelFieldPair>
                {connectionDetail?.serviceName == "WATER" && (
                    <div>
                        <LabelFieldPair>
                            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_NO_OF_PROPOSED_TAPS_LABEL")}*`}</CardLabel>
                            <div className="field">
                                <Controller
                                    control={control}
                                    name="proposedTaps"
                                    defaultValue={connectionDetail?.proposedTaps}
                                    rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
                                    type="number"
                                    isMandatory={true}
                                    render={(props) => (
                                        <TextInput
                                            type="number"
                                            value={props.value}
                                            autoFocus={focusIndex.index === connectionDetail?.key && focusIndex.type === "proposedTaps"}
                                            errorStyle={(localFormState.touched.proposedTaps && errors?.proposedTaps?.message) ? true : false}
                                            onChange={(e) => {
                                                props.onChange(e.target.value);
                                                setFocusIndex({ index: connectionDetail?.key, type: "proposedTaps" });
                                            }}
                                            labelStyle={{ marginTop: "unset" }}
                                            onBlur={props.onBlur}
                                        />
                                    )}
                                />
                            </div>
                        </LabelFieldPair>
                        <CardLabelError style={errorStyle}>{localFormState.touched.proposedTaps ? errors?.proposedTaps?.message : ""}</CardLabelError>
                        <LabelFieldPair>
                            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_PROPOSED_PIPE_SIZE_IN_INCHES_LABEL")}*`}</CardLabel>
                            <Controller
                                control={control}
                                name={"proposedPipeSize"}
                                defaultValue={connectionDetail?.proposedPipeSize}
                                rules={{ required: t("REQUIRED_FIELD") }}
                                isMandatory={true}
                                render={(props) => (
                                    <Dropdown
                                        className="form-field"
                                        selected={getValues("proposedPipeSize")}
                                        disable={false}
                                        option={pipeSizeList}
                                        errorStyle={(localFormState.touched.proposedPipeSize && errors?.proposedPipeSize?.message) ? true : false}
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
                        <CardLabelError style={errorStyle}>{localFormState.touched.proposedPipeSize ? errors?.proposedPipeSize?.message : ""}</CardLabelError>
                    </div>
                )}
                {connectionDetail?.serviceName !== "WATER" && (
                    <div>
                        <LabelFieldPair>
                            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_PROPOSED_WATER_CLOSETS_LABEL")}*`}</CardLabel>
                            <div className="field">
                                <Controller
                                    control={control}
                                    name="proposedWaterClosets"
                                    defaultValue={connectionDetail?.proposedWaterClosets}
                                    rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
                                    type="number"
                                    isMandatory={true}
                                    render={(props) => (
                                        <TextInput
                                            type="number"
                                            value={props.value}
                                            autoFocus={focusIndex.index === connectionDetail?.key && focusIndex.type === "proposedWaterClosets"}
                                            errorStyle={(localFormState.touched.proposedWaterClosets && errors?.proposedWaterClosets?.message) ? true : false}
                                            onChange={(e) => {
                                                props.onChange(e.target.value);
                                                setFocusIndex({ index: connectionDetail?.key, type: "proposedWaterClosets" });
                                            }}
                                            labelStyle={{ marginTop: "unset" }}
                                            onBlur={props.onBlur}
                                        />
                                    )}
                                />
                            </div>
                        </LabelFieldPair>
                        <CardLabelError style={errorStyle}>{localFormState.touched.proposedWaterClosets ? errors?.proposedWaterClosets?.message : ""}</CardLabelError>
                        <LabelFieldPair>
                            <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_PROPOSED_WATER_TOILETS_LABEL")}*`}</CardLabel>
                            <div className="field">
                                <Controller
                                    control={control}
                                    name="proposedToilets"
                                    defaultValue={connectionDetail?.proposedToilets}
                                    rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
                                    type="number"
                                    isMandatory={true}
                                    render={(props) => (
                                        <TextInput
                                            type="number"
                                            value={props.value}
                                            autoFocus={focusIndex.index === connectionDetail?.key && focusIndex.type === "proposedToilets"}
                                            errorStyle={(localFormState.touched.proposedToilets && errors?.proposedToilets?.message) ? true : false}
                                            onChange={(e) => {
                                                props.onChange(e.target.value);
                                                setFocusIndex({ index: connectionDetail?.key, type: "proposedToilets" });
                                            }}
                                            labelStyle={{ marginTop: "unset" }}
                                            onBlur={props.onBlur}
                                        />
                                    )}
                                />
                            </div>
                        </LabelFieldPair>
                        <CardLabelError style={errorStyle}>{localFormState.touched.proposedToilets ? errors?.proposedToilets?.message : ""}</CardLabelError>
                    </div>
                )}
            </div>}
        </div>
    );
};


export default WSEditConnectionDetails;