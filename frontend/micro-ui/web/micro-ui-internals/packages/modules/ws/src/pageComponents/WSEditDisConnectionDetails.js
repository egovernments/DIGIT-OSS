import { CardLabel, Dropdown, LabelFieldPair, Loader, TextInput, CardLabelError, CheckBox, StatusTable, Row, CardSubHeader, RadioButtons, DatePicker , CardSectionHeader, TextArea  } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { getPattern } from "../utils";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import * as func from "../utils/"
import { stringReplaceAll } from "../utils";

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


const WSEditDisConnectionDetails = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {

    let filters = func.getQueryStringParams(location.search);
    const applicationNumber = filters?.applicationNumber;
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const [connectionDetails, setConnectionDetails] = useState(formData?.ConnectionDetails ? [formData?.ConnectionDetails?.[0]] : [createConnectionDetails()]);
    const applicationData = Digit.SessionStorage.get("WS_DISCONNECTION");

    // const [disconnectionData, setDisconnectionData] = useState({
    //     type: applicationData.WSDisconnectionForm ? applicationData.WSDisconnectionForm.type : "",
    //     date: applicationData.WSDisconnectionForm ? applicationData.WSDisconnectionForm.date : "",
    //     reason: applicationData.WSDisconnectionForm ?  applicationData.WSDisconnectionForm.reason : "",
    //     documents: applicationData.WSDisconnectionForm ? applicationData.WSDisconnectionForm.documents : []
    // });
    const [disconnectionData, setDisconnectionData] = useState({
        type: "",
        date: "",
        reason: ""
    });
    const [disconnectionTypeList, setDisconnectionTypeList] = useState([]);

    const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
    const stateCode = Digit.ULBService.getStateId();
    const [isErrors, setIsErrors] = useState(false);
    const [waterSewarageSelection, setWaterSewarageSelection] = useState({ water: true, sewerage: false });

    const [pipeSizeList, setPipesizeList] = useState([]);

    const { isWSServicesCalculationLoading, data: wsServicesCalculationData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-calculation", ["PipeSize"]);
    const { isMdmsLoading, data: mdmsData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-masters", ["disconnectionType"]);

    useEffect(() => {
        const data = connectionDetails.map((e) => {
            return e;
        });
        onSelect(config?.key, data);
    }, [connectionDetails]);

    useEffect(() => {
        const disconnectionTypes = mdmsData?.["ws-services-masters"]?.disconnectionType || []; 
        disconnectionTypes?.forEach(data => data.i18nKey = `WS_DISCONNECTIONTYPE_${stringReplaceAll(data?.code?.toUpperCase(), " ", "_")}`);
    
        setDisconnectionTypeList(disconnectionTypes);
      }, [mdmsData]);

    useEffect(() => {
        const list = wsServicesCalculationData?.["ws-services-calculation"]?.PipeSize || [];
        list?.forEach(data => data.i18nKey = data.size);
        setPipesizeList(list);
    }, [wsServicesCalculationData]);

    useEffect(() => {
        if (userType === "employee") {
            onSelect(config.key, { ...formData[config.key], ...disconnectionData });
        }
        if (connectionDetails?.[0]?.water) setWaterSewarageSelection({ water: true, sewerage: false })

        if (connectionDetails?.[0]?.sewerage) setWaterSewarageSelection({ water: false, sewerage: true })
    }, [disconnectionData]);

    useEffect(() => {
        if (!formData?.ConnectionDetails) {
            setConnectionDetails([createConnectionDetails()]);
        }
    }, [formData?.ConnectionDetails]);

    const filedChange = (val) => {
        const oldData = {...disconnectionData};
        oldData[val.code]=val;
        setDisconnectionData(oldData);
      }

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
        applicationNumber,
        disconnectionData,
        disconnectionTypeList,
        filedChange,
        setDisconnectionData
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
        applicationNumber,
        disconnectionData,
        disconnectionTypeList,
        filedChange,
        setDisconnectionData
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
    return (
        <div >
            <div>
                <CardLabel style={{ fontWeight: "700", marginBottom: "5px" }}>{t("WS_COMMON_APP_DETAIL")}</CardLabel>
                <StatusTable>
                        <Row className="border-none" key={`WS_MYCONNECTIONS_CONSUMER_NO`} label={`${t(`WS_MYCONNECTIONS_CONSUMER_NO`)}:`} text={applicationNumber} />                   
                </StatusTable>
            </div>
            <div style={{ marginBottom: "16px" }}>
                <LabelFieldPair style={{ display: "block" }}>
                    <CardLabel style={{ fontWeight: "700" }} className="card-label-smaller">{t("WS_DISCONNECTION_TYPE")}</CardLabel>
                    <RadioButtons
                        t={t}
                        options={disconnectionTypeList}
                        optionsKey="i18nKey"
                        value={disconnectionData.type?.value?.code}
                        selectedOption={disconnectionData.type?.value}
                        isMandatory={false}
                        onSelect={(val) => filedChange({code: "type",value: val})}
                        labelKey="WS_DISCONNECTION_TYPE"
                        style={{display: "flex", gap: "0px 3rem"}}
                    />
                </LabelFieldPair>
                <LabelFieldPair>
                    <CardLabel style={{ marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_DISCONECTION_DATE")}:`}</CardLabel>
                    <div className="field">
                        <Controller
                            control={control}
                            name="disconnectionDate"
                            defaultValue={disconnectionData?.date}
                            isMandatory={true}
                            render={(props) => (
                                <DatePicker
                                    date={disconnectionData?.date}
                                    autoFocus={focusIndex.index === connectionDetail?.key && focusIndex.type === "datePicker"}
                                    onChange={(date) => {
                                      setDisconnectionData({ ...disconnectionData, date: date });
                                      setFocusIndex({ index: connectionDetail?.key, type: "datePicker" });
                                    }}
                                    
                                 ></DatePicker>
                            )}
                        />
                    </div>
                </LabelFieldPair>

                <LabelFieldPair>
                    <CardLabel style={{ marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_DISCONNECTION_REASON")}:`}</CardLabel>
                    <div className="field">
                        <Controller
                            control={control}
                            name="serviceName"
                            defaultValue={disconnectionData.reason?.value}
                            isMandatory={true}
                            render={(props) => (
                                <TextArea
                                    isMandatory={false}
                                    optionKey="i18nKey"
                                    t={t}
                                    name={"reason"}
                                    value={props.value}
                                    autoFocus={focusIndex.index === connectionDetail?.key && focusIndex.type === "reason"}
                                    onChange={(e) => { 
                                        filedChange({code:"reason" , value:e.target.value})
                                        setFocusIndex({ index: connectionDetail?.key, type: "reason" });
                                    }}
                                />
                            )}
                        />
                    </div>
                </LabelFieldPair>
            </div>
        </div>
    );
};

export default WSEditDisConnectionDetails;