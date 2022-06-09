import React, { useState, useEffect, useMemo } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton, DatePicker, CardSectionHeader, DeleteIcon } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import OBPSDocumentsEmp from "./OBPSDocumentsEmp";


const createUnitDetails = () => ({
    InspectionDate: "",
    InspectionTime: "",
    Checklist: [],
    Documents: [],
    key: Date.now(),
});

const InspectionReport = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const isEditScreen = pathname.includes("/modify-application/");
    const [FieldReports, setFieldReports] = useState(formData?.FieldReports || [createUnitDetails()]);
    const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [tradeTypeMdmsData, setTradeTypeMdmsData] = useState([]);
    const [tradeCategoryValues, setTradeCategoryValues] = useState([]);
    const [tradeTypeOptionsList, setTradeTypeOptionsList] = useState([]);
    const [questionList, setquestionList] = useState([]);
    const [documentList, setdocumentList] = useState([]);
    const [tradeSubTypeOptionsList, setTradeSubTypeOptionsList] = useState([]);
    const [isErrors, setIsErrors] = useState(false);
    const [previousLicenseDetails, setPreviousLicenseDetails] = useState(formData?.tradedetils1 || []);
    let isRenewal = window.location.href.includes("tl/renew-application-details");
    if (window.location.href.includes("tl/renew-application-details")) isRenewal = true;
    const { data: tradeMdmsData, isLoading } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "TradeUnits", "[?(@.type=='TL')]");
    const { isLoading: bpaDocsLoading, data: bpaDocs } = Digit.Hooks.obps.useMDMS(stateId, "BPA", ["CheckList"]);
    let type = "LOW"

    const addNewFieldReport = () => {
        const newUnit = createUnitDetails();
        setFieldReports((prev) => [...prev, newUnit]);
    };


    const removeUnit = (unit) => {
        setFieldReports((prev) => prev.filter((o) => o.key != unit.key));
    };

    useEffect(() => {
        const data = FieldReports.map((e) => {
            return e;
        });
        onSelect(config?.key, data);
        sessionStorage.setItem("INSPECTION_DATA", JSON.stringify(data));
    }, [FieldReports]);

    useEffect(() => {
        onSelect("tradedetils1", previousLicenseDetails);
    }, [previousLicenseDetails]);

    useEffect(() => {
        let ques = [];
        let documentlist = [];
        bpaDocs && bpaDocs.BPA.CheckList.map((ob) => {
            if (ob?.RiskType === type && ob?.WFState === "FIELDINSPECTION_PENDING") {
                ques = [...ob.questions];
                documentlist = [...ob.docTypes]
            }
        })
        setdocumentList(documentlist);
        setquestionList(ques);
    }, [bpaDocs]);

    const commonProps = {
        focusIndex,
        allFieldReport: FieldReports,
        setFocusIndex,
        removeUnit,
        formData,
        formState,
        setFieldReports,
        t,
        setError,
        clearErrors,
        config,
        onSelect,
        userType,
        tradeCategoryValues,
        tradeTypeOptionsList,
        setTradeTypeOptionsList,
        tradeTypeMdmsData,
        tradeSubTypeOptionsList,
        setTradeSubTypeOptionsList,
        setTradeTypeMdmsData,
        setTradeCategoryValues,
        tradeMdmsData,
        isErrors,
        setIsErrors,
        previousLicenseDetails,
        setPreviousLicenseDetails,
        isLoading,
        bpaDocs,
        type,
        questionList,
        setquestionList,
        documentList
    };

    if (isEditScreen) {
        return <React.Fragment />;
    }

    return (
        <div>
            <React.Fragment>
                {FieldReports && FieldReports.map((unit, index) => (
                    <InspectionReportForm key={unit.key} index={index} unit={unit} {...commonProps} />
                ))}
            </React.Fragment>
            <LinkButton label={t("BPA_ADD_FIELD_INSPECTION")} onClick={addNewFieldReport} style={{ color: "#F47738", width: "fit-content" }} />
        </div>
    );
};

const InspectionReportForm = (_props) => {
    const {
        unit,
        index,
        focusIndex,
        allFieldReport,
        setFocusIndex,
        removeUnit,
        setFieldReports,
        t,
        formData,
        config,
        onSelect,
        userType,
        setError,
        clearErrors,
        formState,
        tradeCategoryValues,
        tradeTypeOptionsList,
        setTradeTypeOptionsList,
        tradeTypeMdmsData,
        tradeSubTypeOptionsList,
        setTradeSubTypeOptionsList,
        setTradeTypeMdmsData,
        setTradeCategoryValues,
        tradeMdmsData,
        isErrors,
        setIsErrors,
        previousLicenseDetails,
        setPreviousLicenseDetails,
        isLoading,
        bpaDocs,
        type,
        questionList,
        setquestionList,
        documentList
    } = _props;

    const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger, getValues } = useForm();
    const formValue = watch();
    const { errors } = localFormState;

    const isIndividualTypeOwner = useMemo(() => formData?.ownershipCategory?.code.includes("INDIVIDUAL"), [formData?.ownershipCategory?.code]);

    useEffect(() => {
        trigger();
    }, []);

    useEffect(() => {
        const keys = Object.keys(formValue);
        const part = {};
        keys.forEach((key) => (part[key] = unit[key]));

        let _ownerType = isIndividualTypeOwner ? {} : { ownerType: { code: "NONE" } };
        let questionLength = questionList ? { questionLength: questionList.length } : { questionLength: 0 };
        let Ques = questionList ? { questionList: questionList } : { questionList: [] };

        if (!_.isEqual(formValue, part)) {
            Object.keys(formValue).map(data => {
                if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
                    setIsErrors(true);
                }
            });
            setFieldReports((prev) => prev.map((o) => (o.key && o.key === unit.key ? { ...o, ...formValue, ..._ownerType, ...questionLength, ...Ques } : { ...o })));
            trigger();
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

    let ckeckingLocation = window.location.href.includes("renew-application-details");
    if (window.location.href.includes("edit-application-details")) ckeckingLocation = true;

    const getOptions = (option) => {
        let fieldoptions = []
        option.split("/").map((op) => {
            fieldoptions.push({ i18nKey: `SCORE_${op}`, code: op });
        })
        return fieldoptions;
    }

    const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px", maxWidth:"950px", minWidth:"280px", borderRadius:"4px" };
    return (
        <React.Fragment>
            <div style={{ marginBottom: "16px", maxWidth: "950px" }}>
                <div className="fieldInspectionWrapper">
                    {allFieldReport?.length > 1 ? (
                        <LinkButton
                            label={<DeleteIcon style={{ float: "right", position: "relative", bottom: "-6px" }} fill={!(allFieldReport.length == 1) ? "#494848" : "#FAFAFA"} />}
                            style={{ width: "100px", display: "inline", background: "black" }}
                            onClick={(e) => removeUnit(unit)}
                        />
                    ) : null}
                    <CardSectionHeader>{allFieldReport?.length > 1 ? `${t("BPA_FI_REPORT")}-${index + 1}` : `${t("BPA_FI_REPORT")}`}</CardSectionHeader>
                    <LabelFieldPair style={{ width: "100%" }}>
                        <CardLabel style={{ marginTop: "0px", width: "100%" }} className="card-label-smaller">{`${t("BPA_FI_DATE_LABEL")} * `}</CardLabel>
                        <div className="field" style={{ width: "100%" }}>
                            <Controller
                                name="InspectionDate"
                                rules={{ required: t("REQUIRED_FIELD") }}
                                control={control}
                                render={(props) => (
                                    <DatePicker
                                        date={props.value}
                                        name="InspectionDate"
                                        onChange={props.onChange}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>
                    <LabelFieldPair style={{ width: "100%" }}>
                        <CardLabel style={{ marginTop: "0px", width: "100%" }} className="card-label-smaller">{`${t("ES_COMMON_TIME")} * `}</CardLabel>
                        <div className="field" style={{ width: "100%" }}>
                            <Controller
                                name="InspectionTime"
                                rules={{ required: t("REQUIRED_FIELD") }}
                                control={control}
                                render={(props) => (
                                    <TextInput
                                        name="InspectionTime"
                                        type="time"
                                        value={props.value}
                                        onChange={props.onChange}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>
                    <CardSectionHeader>{t("BPA_CHECK_LIST_DETAILS")}</CardSectionHeader>
                    {questionList && questionList.map((ob, ind) => (
                        <div key={ind} className="fieldInsepctionInsideWrapper" style={{ maxWidth: "100%" }}>
                            <LabelFieldPair style={{width :"100%"}}>
                                <CardLabel style={{ marginRight: "30px", width :"100%" }} className="card-label-smaller">{`${t(ob.question)}*`}</CardLabel>
                                <div className="field" style={{ width: "100%" }}>
                                    <Controller
                                        control={control}
                                        name={`question_${ind}`}
                                        rules={{ required: t("REQUIRED_FIELD") }}
                                        render={(props) => (
                                            <Dropdown
                                                className="form-field"
                                                style={{ width: "100%", maxWidth: "100%" }}
                                                selected={getValues(`question${ind}`)}
                                                disable={false}
                                                option={getOptions(ob.fieldType)}
                                                select={(e) => {
                                                    if (props?.value?.code == e?.code) return true;
                                                    props.onChange(e);
                                                }}
                                                optionKey="i18nKey"
                                                onBlur={props.onBlur}
                                                t={t}
                                            />
                                        )}
                                    />
                                </div>
                            </LabelFieldPair>
                            <LabelFieldPair style={{width :"100%"}}>
                                <CardLabel style={{ marginRight: "30px", width : "100%" }} className="card-label-smaller">{t("BPA_ENTER_REMARKS")}</CardLabel>
                                <div className="field" style={{ width: "100%" }}>
                                    <Controller
                                        control={control}
                                        name={`Remarks_${ind}`}
                                        defaultValue={unit?.uomValue}
                                        render={(props) => (
                                            <TextInput
                                                value={getValues(`Remarks${ind}`)}
                                                onChange={(e) => {
                                                    props.onChange(e);
                                                }}
                                                onBlur={props.onBlur}
                                            />
                                        )}
                                    />
                                </div>
                            </LabelFieldPair>
                        </div>
                    ))}
                    <CardSectionHeader style={{ marginTop: "20px" }}>{t("BPA_FIELD_INSPECTION_DOCUMENTS")}</CardSectionHeader>
                    <OBPSDocumentsEmp t={t} config={config} onSelect={onSelect} userType={userType} formData={formData} setError={setError} clearErrors={clearErrors} formState={formState} index={index} setFieldReports={setFieldReports} documentList={documentList} />
                </div>
            </div>
        </React.Fragment>
    );
};

export default InspectionReport;
