import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton, CardLabelError, MobileNumber, DatePicker, CardSubHeader, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { getUniqueItemsFromArray, stringReplaceAll } from "../utils";
import cloneDeep from "lodash/cloneDeep";
import TimePicker from "react-time-picker";
import {sortDropdownNames} from "../utils/index";
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
    // const [owners, setOwners] = useState(formData?.owners || [createOwnerDetails()]);
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
    const { data: tradeMdmsData,isLoading } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "TradeUnits", "[?(@.type=='TL')]");
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
        sessionStorage.setItem("INSPECTION_DATA",JSON.stringify(data));
    }, [FieldReports]);

    useEffect(() => {
        onSelect("tradedetils1", previousLicenseDetails);
      }, [previousLicenseDetails]);

      useEffect(() => {
        let ques = [];
        let documentlist = [];
        bpaDocs && bpaDocs.BPA.CheckList.map((ob) => {
            if(ob?.RiskType === type && ob?.WFState==="FIELDINSPECTION_PENDING")
            {
                ques = [...ob.questions];
                documentlist = [...ob.docTypes]
            }
        })
        setdocumentList(documentlist);
        setquestionList(ques);
    },[bpaDocs]);


    // useEffect(() => {
    //   setUnits([createOwnerDetails()]);
    // }, [formData?.ownershipCategory?.code]);


    const commonProps = {
        focusIndex,
        allFieldReport: FieldReports,
        setFocusIndex,
        removeUnit,
        formData,
        formState,
        setFieldReports,
        // mdmsData,
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
        // mdmsData,
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

    // useEffect(() => {
    //     if (tradeMdmsData?.TradeLicense?.TradeType?.length > 0 && formData?.tradedetils?.["0"]?.structureType?.code) {
    //         setTradeTypeMdmsData(tradeMdmsData?.TradeLicense?.TradeType);
    //         let tradeType = cloneDeep(tradeMdmsData?.TradeLicense?.TradeType);
    //         let tradeCatogoryList = [];
    //         tradeType.map(data => {
    //             data.code = data?.code?.split('.')[0];
    //             data.i18nKey = t(`TRADELICENSE_TRADETYPE_${data?.code?.split('.')[0]}`);
    //             tradeCatogoryList.push(data);
    //         });
    //         const filterTradeCategoryList = getUniqueItemsFromArray(tradeCatogoryList, "code");
    //         setTradeCategoryValues(filterTradeCategoryList);
    //     }
    // }, [formData?.tradedetils?.[0]?.structureType?.code, !isLoading, tradeMdmsData]);

    useEffect(() => {
        trigger();
    }, []);

    useEffect(() => {
        const keys = Object.keys(formValue);
        const part = {};
        keys.forEach((key) => (part[key] = unit[key]));

        let _ownerType = isIndividualTypeOwner ? {} : { ownerType: { code: "NONE" } };
        let questionLength = questionList ? {questionLength:questionList.length} :{questionLength: 0};
        let Ques = questionList? {questionList:questionList}:{questionList:[]};

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
    // useEffect(() => {
    //     if (tradeTypeMdmsData?.length > 0 && ckeckingLocation && !isLoading) {
    //         let tradeType = cloneDeep(tradeTypeMdmsData);
    //         let filteredTradeType = tradeType.filter(data => data?.code?.split('.')[0] === unit?.tradeCategory?.code)
    //         let tradeTypeOptions = [];
    //         filteredTradeType.map(data => {
    //             data.code = data?.code?.split('.')[1];
    //             data.code = data?.code?.split('.')[0];
    //             data.i18nKey = t(`TRADELICENSE_TRADETYPE_${data?.code?.split('.')[0]}`);
    //             tradeTypeOptions.push(data);
    //         });
    //         const filterTradeCategoryList = getUniqueItemsFromArray(filteredTradeType, "code");
    //         setTradeTypeOptionsList(filterTradeCategoryList);
    //     }
    // }, [tradeTypeMdmsData, !isLoading, tradeMdmsData]);

    const getOptions = (option) => {
        let fieldoptions=[]
        option.split("/").map((op) => {
            fieldoptions.push({i18nKey:op,code:op});
        })
        return fieldoptions;
    }


    const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
    return (
        <React.Fragment>
            <div style={{ marginBottom: "16px" }}>
                <div /* style={{ border: "1px solid #D6D5D4", padding: "16px", marginTop: "8px", background: "#FAFAFA" } }*/>
                    {allFieldReport?.length > 1 ? (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div onClick={() => removeUnit(unit)} style={{ padding: "5px", cursor: "pointer", textAlign: "right" }}>
                                <span>
                                    <svg style={{ float: "right", position: "relative", bottom: "5px" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="#494848" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    ) : null}
                    <CardSectionHeader>{`${t("BPA_FI_REPORT")}`} {index+1}</CardSectionHeader>
                    <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("BPA_FI_DATE_LABEL")} * :`}</CardLabel>
            <div className="field">
              <Controller
                name="InspectionDate"
                rules={{ required: t("REQUIRED_FIELD") }}
                //defaultValue={tradedetail?.commencementDate}
                control={control}
                render={(props) => (
                  <DatePicker
                    date={props.value}
                    // date={CommencementDate} 
                    name="InspectionDate"
                    onChange={props.onChange}
                    //disabled={isRenewal}
                  />
                )}
              />
            </div>
            </LabelFieldPair>
            <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("ES_COMMON_TIME")} * :`}</CardLabel>
            <div className="field">
            <Controller
                name="InspectionTime"
                rules={{ required: t("REQUIRED_FIELD") }}
                //defaultValue={tradedetail?.commencementDate}
                control={control}
                render={(props) => (
                    <TextInput
                    name="InspectionTime"
                    type="time"
                    value={props.value} 
                    onChange={props.onChange}
                    //className="custom-time-picker"
                     />
                )}
            />
              </div>
          </LabelFieldPair>
          <CardSectionHeader>{t("BPA_CHECK_LIST_DETAILS")}</CardSectionHeader>
          {questionList && questionList.map((ob,ind) => (
              <div key={ind} style={{ border: "1px solid #D6D5D4", padding: "16px", marginTop: "8px", background: "#FAFAFA", maxWidth:"600px", minWidth:"280px" } }>
                  <LabelFieldPair>
                        <CardLabel style={{marginRight:"30px"}} className="card-label-smaller">{`${t(ob.question)} * :`}</CardLabel>
                        <Controller
                            control={control}
                            name={`question_${ind}`}
                            //defaultValue={unit?.tradeSubType}
                            rules={{ required: t("REQUIRED_FIELD") }}
                            render={(props) => (
                                <Dropdown
                                    className="form-field"
                                    selected={getValues(`question${ind}`)}
                                    disable={false}
                                    option={getOptions(ob.fieldType)}
                                    //errorStyle={(localFormState.touched.tradeSubType && errors?.tradeSubType?.message) ? true : false}
                                    select={(e) => {
                                        if (props?.value?.code == e?.code) return true;
                                        //if(e?.code != props?.value?.code && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true});
                                        //setValue("uom", e?.uom ? e?.uom : "");
                                        //setValue("uomValue", "");
                                        props.onChange(e);
                                    }}
                                    optionKey="i18nKey"
                                    onBlur={props.onBlur}
                                    t={t}
                                />
                            )}
                        />
                    </LabelFieldPair>
                    <LabelFieldPair>
                        <CardLabel style={{marginRight:"30px"}} className="card-label-smaller">{t("BPA_ENTER_REMARKS")}</CardLabel>
                        <div className="field">
                            <Controller
                                control={control}
                                name={`Remarks_${ind}`}
                                defaultValue={unit?.uomValue}
                               // rules={t("REQUIRED_FIELD"), validate: { pattern: (val) => (/^(0)*[1-9][0-9]{0,5}$/.test(val) ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) } } }
                                render={(props) => (
                                    <TextInput
                                        value={getValues(`Remarks${ind}`)}
                                        //autoFocus={focusIndex.index === unit?.key && focusIndex.type === "uomValue"}
                                        //errorStyle={(localFormState.touched.uomValue && errors?.uomValue?.message) ? true : false}
                                        onChange={(e) => {
                                            //if(e.target.value != unit?.uomValue && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true});
                                            props.onChange(e);
                                            //setFocusIndex({ index: unit.key, type: "uomValue" });
                                        }}
                                        //disable={!(unit?.tradeSubType?.uom)}
                                        onBlur={props.onBlur}
                                        style={{ background: "#FAFAFA" }}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>
              </div>
          
          ))}
          <CardSectionHeader style={{marginTop:"20px"}}>{t("BPA_FIELD_INSPECTION_DOCUMENTS")}</CardSectionHeader>
          <OBPSDocumentsEmp t={t} config={config} onSelect={onSelect} userType={userType} formData={formData} setError={setError} clearErrors={clearErrors} formState={formState} index={index} setFieldReports={setFieldReports} documentList={documentList}/>
                </div>
                {/* <CardLabelError style={errorStyle}> {localFormState.touched.uomValue ? errors?.uomValue?.message : ""} </CardLabelError> */}
            </div>
        </React.Fragment>
    );
};

export default InspectionReport;
