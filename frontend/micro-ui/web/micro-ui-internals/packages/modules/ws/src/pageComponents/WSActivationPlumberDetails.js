import { CardLabel, Dropdown, LabelFieldPair, TextInput, CardLabelError,WrapUnMaskComponent } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import * as func from "../utils";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { getPattern } from "../utils";

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
    }, [plumberDetails, formData?.connectionDetails?.[0]?.connectionType]);


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
    let isEmployee = window.location.href.includes("/employee")

    useEffect(() => {
        trigger();
    }, []);

    useEffect(() => {
        // if (plumberDetails?.[0]?.detailsProvidedBy !== "Self") {
        //   clearErrors("PlumberDetails");
        // } else {
        //   trigger();
        // }
        trigger();
      }, [plumberDetails?.[0]?.detailsProvidedBy, formData?.disConnectionDetails?.[0]]);

    useEffect(() => {
        if (Object.entries(formValue).length > 0) {
            const keys = Object.keys(formValue);
            const part = {};
            keys.forEach((key) => (part[key] = plumberDetail[key]));
            let plumbermobileCheck = window.location.href.includes("ws/config-by-disconnection-application") ? (formValue?.plumberMobileNo !== undefined && part?.plumberMobileNo) : true;
            if (!_.isEqual(formValue, part) && plumbermobileCheck) {
                let isErrorsFound = true;
                Object.keys(formValue).map(data => {
                    if (!formValue[data] && isErrorsFound) {
                        isErrorsFound = false;
                        setIsErrors(false);
                    }
                });
                if (isErrorsFound) setIsErrors(true);
                let ob = [{ ...formValue }];
                setPlumberDetails(ob);
                trigger();
            }
        }
    }, [formValue, plumberDetails]);


    useEffect(() => {
        if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
            setError(config.key, { type: errors });
        }
        else if (!Object.keys(errors).length && formState.errors[config.key]) {
            clearErrors(config.key);
        }
    }, [errors]);

    const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
    return (
        <div >
            <div style={{ marginBottom: "16px" }}>
                <div>
                    <LabelFieldPair>
                        <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY")}*`}</CardLabel>
                        <Controller
                            control={control}
                            name={"detailsProvidedBy"}
                            defaultValue={plumberDetail?.detailsProvidedBy}
                            rules={{ required: t("REQUIRED_FIELD") }}
                            isMandatory={true}
                            render={(props) => (
                                <Dropdown
                                    className="form-field"
                                    selected={getValues("detailsProvidedBy")}
                                    disable={false}
                                    option={options}
                                    errorStyle={(localFormState.touched.detailsProvidedBy && errors?.detailsProvidedBy?.message) ? true : false}
                                    select={(e) => {
                                        if (e.code == "ULB") {
                                            let obj = {
                                                ...plumberDetails?.[0],
                                                detailsProvidedBy: e,
                                                plumberName: "",
                                                plumberMobileNo: "",
                                                plumberLicenseNo: ""
                                            }
                                            setPlumberDetails([obj])
                                        } else {
                                            let obj = { detailsProvidedBy: e }
                                            setPlumberDetails([obj])
                                        }
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
                    {!plumberDetail?.detailsProvidedBy?.code || plumberDetail?.detailsProvidedBy?.code == "ULB" ?
                        <div>
                            <LabelFieldPair>
                                <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_PLIMBER_LICENSE_NO_LABEL")}*`}</CardLabel>
                                <div className="field">
                                    <Controller
                                        control={control}
                                        name="plumberLicenseNo"
                                        defaultValue={plumberDetail?.plumberLicenseNo}
                                        // rules={{ required: t("REQUIRED_FIELD") }}
                                        rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) , required: t("REQUIRED_FIELD")}}
                                        isMandatory={true}
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
                            </LabelFieldPair>
                            <CardLabelError style={errorStyle}>{localFormState.touched.plumberLicenseNo ? errors?.plumberLicenseNo?.message : ""}</CardLabelError>
                            <LabelFieldPair>
                                <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_ADDN_DETAILS_PLUMBER_NAME_LABEL")}*`}</CardLabel>
                                <div className="field">
                                    <Controller
                                        control={control}
                                        name="plumberName"
                                        defaultValue={plumberDetail?.plumberName}
                                        // rules={{ required: t("REQUIRED_FIELD") }}
                                        rules={{ validate: (e) => ((e && getPattern("Name").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
                                        isMandatory={true}
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
                            </LabelFieldPair>
                            <CardLabelError style={errorStyle}>{localFormState.touched.plumberName ? errors?.plumberName?.message : ""}</CardLabelError>
                            <LabelFieldPair>
                                <CardLabel style={isMobile && isEmployee ? {fontWeight: "700", width:"100%"} : { marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{`${t("WS_PLUMBER_MOBILE_NO_LABEL")}*`}</CardLabel>
                                <div className="field">
                                    <Controller
                                        control={control}
                                        name="plumberMobileNo"
                                        defaultValue={plumberDetail?.plumberMobileNo}
                                        // rules={{ required: t("REQUIRED_FIELD") }}
                                        rules={{ validate: (e) => ((e && getPattern("MobileNoWithPrivacy").test(e)) || !e || e.includes("*") ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
                                        type="mobileNumber"
                                        isMandatory={true}
                                        render={(props) => (
                                            <div style={{display:"flex",alignItems:"baseline",marginRight: "unset"}}>
                                                <div style={{ position: "relative", zIndex: "1", left: "35px", marginTop: "-24.5px",marginLeft:"-26px" }}>+91</div>
                                                <TextInput
                                                    style={{ background: "#FAFAFA", padding: "0px 35px" }}
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
                                                <div style={isMobile && isEmployee ?{} : {marginRight:"-50px",marginLeft:"10px"}}>
                                           <WrapUnMaskComponent
                                            unmaskField={(e) => {
                                                props.onChange(e);
                                              }}
                                              iseyevisible={props.value?.includes("*") ? true : false}
                                              privacy={{
                                                uuid: plumberDetail?.applicationNo,
                                                fieldName: "plumberInfoMobileNumber",
                                                model: "WnSConnectionPlumber",
                                                loadData: {
                                                  serviceName: formData?.connectionDetails?.[0]?.formDetails?.applicationData?.serviceType === "WATER" || formData?.disConnectionDetails?.[0]?.consumerNumber?.includes("WS") ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                                                  requestBody: {},
                                                  requestParam: {
                                                    tenantId: formData?.connectionDetails?.[0]?.formDetails?.tenantId,
                                                    applicationNumber: plumberDetail?.applicationNo,
                                                  },
                                                  jsonPath: formData?.connectionDetails?.[0]?.formDetails?.applicationData?.serviceType === "WATER" || formData?.disConnectionDetails?.[0]?.consumerNumber?.includes("WS") 
                                                    ? "WaterConnection[0].plumberInfo[0].mobileNumber"
                                                    : "SewerageConnections[0].plumberInfo[0].mobileNumber",
                                                  isArray: false,
                                                },
                                              }}>
                                            { /*privacy={{ uuid:plumberDetail?.applicationNo, fieldName: ["plumberInfoMobileNumber"], model: "WnSConnectionPlumber" }}*/}
                                            </WrapUnMaskComponent>
                                           </div>
                                           </div>
                                            
                                        )}
                                    />
                                </div>
                            </LabelFieldPair>
                            <CardLabelError style={errorStyle}>{localFormState.touched.plumberMobileNo ? errors?.plumberMobileNo?.message : ""}</CardLabelError>
                        </div> : null}
                </div>
            </div>
        </div>
    );
};


export default WSActivationPlumberDetails;