import {
  Card,
  CardLabel,
  CardSectionHeader,
  CardText,
  Header,
  LabelFieldPair,
  LastRow,
  CardSectionSubText,
  CheckBox,
  Loader,
  TextInput,
  Dropdown,
  DatePicker,
  UploadFile,
  ActionBar,
  SubmitBar,
  CardLabelError,
  InfoBannerIcon,
  Toast,
  Table
} from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useMemo, useReducer, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";



const ApplicationBillAmendment = () => {
  const [showToast, setShowToast] = useState(null)
  //connectionNumber=WS/107/2021-22/227166&tenantId=pb.amritsar&service=WATER&connectionType=Metered
  const { t } = useTranslation();
  const { connectionNumber, tenantId, service, connectionType, isEdit } = Digit.Hooks.useQueryParams();
  const stateId = Digit.ULBService.getStateId();
  let { state } = useLocation();
  state = state  ? (typeof(state) === "string" ? JSON.parse(state) : state) : {};
  const [error, setUploadError] = useState("")
  const [ischeckedReduce, setischeckedReduce] = useState(false)
  const [ischeckedAddition, setischeckedAddition] = useState(false)
  let isMobile = window.Digit.Utils.browser.isMobile();
  let isEmployee = window.location.href.includes("/employee");

  const { isLoading: BillAmendmentMDMSLoading, data: BillAmendmentMDMS } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSMDMSBillAmendment({
    tenantId: stateId,
  });

  const servicev1 = connectionNumber.includes("WS") ? "WS" : "SW";
  const billSearchFilters = { tenantId, consumerCode: connectionNumber, service: servicev1 };
  const { data: preBillSearchData, isLoading: isBillSearchLoading } = Digit.Hooks.usePaymentSearch(tenantId, billSearchFilters);

  const { data, isFetched } = Digit.Hooks.fsm.useMDMS(stateId, "DIGIT-UI", "WSTaxHeadMaster");
  const availableBillAmendmentTaxHeads = data?.BillingService?.TaxHeadMaster?.filter((w) => w.IsBillamend);

  let billSearchData = preBillSearchData?.filter((e) =>
    availableBillAmendmentTaxHeads?.find((taxHeadMaster) => taxHeadMaster.code === e.taxHeadCode)
  );
  const rebateAndPenaltyTaxHeads = data?.BillingService?.TaxHeadMaster?.filter(e => e.code.includes("ADHOC") && e.IsBillamend && e.service === servicev1)

  const {
    register,
    control,
    watch,
    setValue,
    unregister,
    handleSubmit,
    formState: { errors, ...rest },
    getValues,
    reset,
    ...methods
  } = useForm({
    defaultValues: {
      ...state?.data?.applicationDetails?.amendment?.additionalDetails?.editForm
    },
  });
  const applicationDetailsFromState = state?.data?.applicationDetails
  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    isSuccess,
    mutate,
  } = Digit.Hooks.ws.useApplicationActionsBillAmendUpdate();

  const [goToAppDetailsPage, setGoToAppDetailsPage] = useState(false)
  const fromDateVal = watch("effectivefrom");
  const amendmentReason = watch("amendmentReason");
  const WS_REDUCED_AMOUNT = watch("WS_REDUCED_AMOUNT");
  const WS_ADDITIONAL_AMOUNT = watch("WS_ADDITIONAL_AMOUNT");
  const SW_REDUCED_AMOUNT = watch("SW_REDUCED_AMOUNT");
  const SW_ADDITIONAL_AMOUNT = watch("SW_ADDITIONAL_AMOUNT");
  const history = useHistory();
  const uploadFile = async (data, fname, props) => {
    setUploadError("")
    try {
      if(data?.target?.files?.[0]?.size < 5242880 && /(.*?)(jpg|jpeg|png|pdf)$/i.test(data?.target?.files?.[0]?.type)){
      dispatch({ type: "addLoader", payload: { id: fname } });
      const response = await Digit.UploadServices.Filestorage("WS", data?.target?.files[0], tenantId);
      const fileStoreId = response?.data?.files?.[0]?.fileStoreId;
      if (fileStoreId) {
        const { data: urlResponse } = await Digit.UploadServices.Filefetch([fileStoreId], tenantId);
        const url = urlResponse?.fileStoreIds?.[0]?.url;
        dispatch({ type: "upload", payload: { id: fname, url } });
        props.onChange({ id: fname, url, fileName: data?.target?.files[0]?.name, fileStoreId, fileStore: fileStoreId });
      } else {
        alert(t("CS_FILE_UPLOAD_ERROR"));
      }
    }
    else
    {
      if(data?.target?.files?.[0]?.size > 5242880)
     { 
      setUploadError({message : "FILE_SIZE_EXCEEDED", documentType :fname })}
      else
      setUploadError({message: "FILE_TYPE_MISMATCHED", documentType: fname})
    }
    }
    catch (err) {
    } finally {
      dispatch({ type: "removeLoader", payload: { id: fname } });
    }
  };

  useEffect(() => dispatch({ type: "updateAmendmentReason", payload: amendmentReason }), [amendmentReason]);

  function fileReducer(state, action) {
    switch (action.type) {
      case "upload":
        return state.map((e) => (e.documentType === action.payload.id ? { ...e, url: action.payload.url } : e));
      case "remove":
        return state.map((e) => {
          let __e = e;
          if (e.documentType === action.payload.id) {
            delete __e.url;
            delete __e.loader;
          }
          return __e;
        });
      case "addLoader":
        return state.map((e) => (e.documentType === action.payload.id ? { ...e, loader: true } : e));
      case "removeLoader":
        return state.map((e) => (e.documentType === action.payload.id ? { ...e, loader: false } : e));
      case "updateAmendmentReason":
        return action.payload?.allowedDocuments?.allowedDocs;
      default:
        return state;
    }
  }

  const functionToHandleFileUpload = async (data, fname, props) => {
    await uploadFile(data, fname, props);
  };

  function functionToDisplayTheMessage(e) {
    if (e?.url) {
      return e?.loader ? <Loader /> : t("CS_ACTION_FILEUPLOADED");
    } else {
      t("CS_ACTION_NO_FILEUPLOADED");
    }
  }
  const [requiredDocuments, dispatch] = useReducer(fileReducer, []);

  const setOtherTextFieldsAndActionToNull = (key) => {
    setValue(key, { VALUE: false });
  };

  const getDemandDetailsComparingUpdates = (d) => {
    let actionPerformed;
    const action = (d?.[`${servicev1}_REDUCED_AMOUNT`]?.VALUE !== undefined && d?.[`${servicev1}_REDUCED_AMOUNT`]?.VALUE) || ((d?.[`${servicev1}_ADDITIONAL_AMOUNT`]?.VALUE !==undefined) && !(d?.[`${servicev1}_ADDITIONAL_AMOUNT`]?.VALUE)) ? "rebate" : "penalty";
    if (servicev1 === "WS")
      actionPerformed = JSON.parse(JSON.stringify(d?.WS_REDUCED_AMOUNT?.VALUE ? d?.WS_REDUCED_AMOUNT : d?.WS_ADDITIONAL_AMOUNT));
    else actionPerformed = JSON.parse(JSON.stringify(d?.SW_REDUCED_AMOUNT?.VALUE ? d?.SW_REDUCED_AMOUNT : d?.SW_ADDITIONAL_AMOUNT));
    delete actionPerformed?.VALUE;
    const actionPerformedInArray = Object.entries(actionPerformed);
    if (d?.[`${servicev1}_REBATE`]) {
      actionPerformedInArray.push([`${servicev1}_TIME_ADHOC_REBATE`, d?.[`${servicev1}_REBATE`]])
    } else if (d?.[`${servicev1}_PENALTY`]) {
      actionPerformedInArray.push([`${servicev1}_TIME_ADHOC_PENALTY`, d?.[`${servicev1}_PENALTY`]])
    }
    return actionPerformedInArray.filter((ob) => ob?.[1] !== "")?.map((e) => {
      const preUpdateDataAmount = billSearchData.find((a) => a.taxHeadCode === e[0])?.amount;
      return {
        taxHeadMasterCode: e[0],
        //taxAmount: e[1] - preUpdateDataAmount,
        taxAmount: e[1] ? (action !== "penalty" ? -parseInt(e[1]) : parseInt(e[1])) : 0
      };
    });

  };

  const getTotalDetailsOfUpdatedData = (d) => {
    const action = d?.[`${servicev1}_REDUCED_AMOUNT`]?.VALUE ? "REBATE" : "PENALTY";
    const originalDemand = {}
    billSearchData.map(el => {
      originalDemand[el.taxHeadCode] = el.amount
    })

    let actionPerformed;
    if (servicev1 === "WS")
      actionPerformed = JSON.parse(JSON.stringify(d?.WS_REDUCED_AMOUNT?.VALUE ? d?.WS_REDUCED_AMOUNT : d?.WS_ADDITIONAL_AMOUNT));
    else actionPerformed = JSON.parse(JSON.stringify(d?.SW_REDUCED_AMOUNT?.VALUE ? d?.SW_REDUCED_AMOUNT : d?.SW_ADDITIONAL_AMOUNT));
    delete actionPerformed?.VALUE;
    actionPerformed[`${servicev1}_${action}`] = d?.[`${servicev1}_${action}`] ? d?.[`${servicev1}_${action}`] : 0;

    return { ...actionPerformed, actionPerformed, TOTAL: Object.values(actionPerformed).reduce((a, b) => parseInt(a) + parseInt(b), 0), originalDemand, action };
  };

  const closeToast = () => {
    setShowToast(null)
  }

  let amendmentIdToRedirect

  useEffect(() => {
    const timer = setTimeout(() => {
      if (goToAppDetailsPage) window.location.href = `${window.location.origin}/digit-ui/employee/ws/generate-note-bill-amendment?applicationNumber=${state?.data.applicationDetails.amendment.amendmentId}`
    }, 5000);
    return () => clearTimeout(timer);
  }, [goToAppDetailsPage]);

  const onFormSubmit = (d) => {
    const data = {
      Amendment: {
        consumerCode: connectionNumber,
        tenantId,
        businessService: servicev1,
        amendmentReason: amendmentReason?.code,
        reasonDocumentNumber: d?.reasonDocumentNumber,
        effectiveFrom: new Date(d?.effectiveFrom).getTime(),
        effectiveTill: new Date(d?.effectiveTill).getTime(),
        documents: Object.values(d?.DOCUMENTS).map((e) => {
          const res = {
            ...e,
            documentType: e?.id,
            fileUrl: e?.url,
          };
          delete res.id;
          delete res.url;
          return res;
        }),
        demandDetails: getDemandDetailsComparingUpdates(d),
        additionalDetails: {
          searchBillDetails: getTotalDetailsOfUpdatedData(d),
          editForm: d
        },
      },
    };
    //here if state.data.action is "RE-SUBMIT-APPLICATION" then need to implement the mutation logic(call billamendment/_update) here and show relevant toast and redirect to application details screen. check existing logic of mutation in applicationdetails template file
    // workflow: {
    //   businessId: applicationData?.billAmendmentDetails?.amendmentId,
    //     action: action?.action,
    //       tenantId: tenantId,
    //         businessService: "BS.AMENDMENT",
    //           moduleName: "BS"
    // }
    //send this workflow object inside and AmendmentUpdate object, AmendmentUpdate object will contain all the amendment details(current)
    //then call mutate wit this data

    if (state?.data?.action === "RE-SUBMIT-APPLICATION") {
      //isme processInstance aur wfDocuments obj bhi bhejo RAIN-6981
      const workflow = {
        businessId: state?.data?.applicationDetails?.amendment?.amendmentId,
        action: "RE-SUBMIT",
        tenantId: tenantId,
        businessService: state?.data?.applicationDetails?.applicationData?.serviceType === "WATER" ? "WS.AMENDMENT":"SW.AMENDMENT",
        moduleName: state?.data?.applicationDetails?.applicationData?.serviceType === "WATER" ? "WS":"SW",
      }
      const AmendmentUpdate = { ...state?.data?.applicationDetails?.applicationData?.billAmendmentDetails, workflow, ...data?.Amendment }
      mutate({ AmendmentUpdate }, {
        onError: (error, variables) => {
          //setIsEnableLoader(false);
          setShowToast({ key: "error", error, label: t("CS_WATER_UPDATE_APPLICATION_FAILED") });
          setTimeout(closeToast, 5000);
        },
        onSuccess: (data, variables) => {
          //setIsEnableLoader(false);
          if (data?.Amendments?.length > 0) {
            if (variables?.AmendmentUpdate?.workflow?.action.includes("RE-SUBMIT")) {
              setShowToast({ key: "success", label: t("ES_MODIFYSWCONNECTION_RE_SUBMIT_UPDATE_SUCCESS") })
            }
            //now goto application details page

            setGoToAppDetailsPage(true)

            // history?.push(`/digit-ui/employee/ws/application-details-bill-amendment?applicationNumber=${data?.Amendments[0].amendmentId}`)
            return
          }
        },
      })
      return
    }

    history.push("/digit-ui/employee/ws/response", data);
  };


  const isValidToDate = (enteredValue) => {
    const enteredTs = new Date(enteredValue).getTime()
    const fromDate = fromDateVal ? new Date(fromDateVal).getTime() : new Date().getTime()
    // return ( toDate > enteredTs && enteredTs >= currentTs ) ? true : false 
    return (enteredTs > fromDate) ? true : "Invalid format"

  };

  function getReasonDocNoHeader(){
    if(amendmentReason?.code === "COURT_CASE_SETTLEMENT")
    return "WS_COURT_ORDER_NO";
    else if(amendmentReason?.code === "ARREAR_WRITE_OFF" || amendmentReason?.code === "ONE_TIME_SETTLEMENT")
    return "WS_GOVERNMENT_NOTIFICATION_NUMBER";
    else
    return "WS_DOCUMENT_NO";
  }

  let adhocAmount = 0;
  billSearchData?.filter((ob) => ob?.taxHeadCode?.includes("ADHOC"))?.map((ob) => {
    adhocAmount = adhocAmount + ob?.amount;
  });
  billSearchData = billSearchData?.filter((ob) => !(ob?.taxHeadCode?.includes("ADHOC")));

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div style={{marginLeft:"20px"}}><Header>{state?.data?.action ? t("WS_APP_FOR_WATER_AND_SEWERAGE_EDIT_LABEL") : t("WS_BILL_AMENDMENT_BUTTON")}</Header></div>
      <Card>
        <LabelFieldPair style={{marginBottom:"20px"}}>
          <CardLabel style={{ fontWeight: "500" }}>{t(`WS_ACKNO_CONNECTION_NO_LABEL`)}</CardLabel>
          <CardText style={{ marginBottom: "0px" }}>{connectionNumber}</CardText>
        </LabelFieldPair>
        <CardSectionHeader style={{ marginBottom: "16px" }}>{t(`WS_ADJUSTMENT_AMOUNT`)}</CardSectionHeader>
        <CardSectionSubText style={{ marginBottom: "16px" }}>{t(`WS_ADJUSTMENT_AMOUNT_ADDITION_TEXT`)}</CardSectionSubText>

        {!isBillSearchLoading ? (
          <table cellPadding={"8px"} cellSpacing={"10px"}>
            <div  style={isMobile && isEmployee ? {overflow:"scroll",maxWidth:"50%"} : {}}>
            <tbody>
            <tr style={{ textAlign: "left" }}>
              <th>{t("WS_TAX_HEADS")}</th>
              <th style={{textAlign : "right"}}>{t("WS_CURRENT_AMOUNT")}</th>
              <th style={{paddingLeft:"150px"}}>
                <>
                  <Controller
                    name={`${servicev1}_REDUCED_AMOUNT.VALUE`}
                    key={`${servicev1}_REDUCED_AMOUNT.VALUE`}
                    control={control}
                    rules={{
                      validate: (value) => {
                        return !!value || (servicev1 === "WS" ? !!WS_ADDITIONAL_AMOUNT?.VALUE : !!SW_ADDITIONAL_AMOUNT?.VALUE);
                      },
                    }}
                    render={(props) => {
                      return (
                        <div style={{paddingTop:"20px"}}>
                        <CheckBox
                          style={{ "marginLeft": "35px" }}
                          label={t(`${servicev1}_REDUCED_AMOUNT`)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              props.onChange(true);
                              setischeckedReduce(true);
                              setischeckedAddition(false);
                              setOtherTextFieldsAndActionToNull(`${servicev1}_ADDITIONAL_AMOUNT`, false);
                            } else {
                              setischeckedReduce(false);
                              props.onChange(false);
                            }
                          }}
                          disable={isEdit && (state?.data?.applicationDetails?.amendment?.additionalDetails?.editForm?.["WS_REDUCED_AMOUNT"]?.["VALUE"] == false || state?.data?.applicationDetails?.amendment?.additionalDetails?.editForm?.["SW_REDUCED_AMOUNT"]?.["VALUE"] == false) ? true : false}
                          checked={props?.value}
                        />
                        </div>
                      );
                    }}
                  />
                  {errors?.WS_REDUCED_AMOUNT?.VALUE && ischeckedReduce == true ? <CardLabelError>{t("WS_REQUIRED_FIELD")}</CardLabelError> : null}
                </>
              </th>
              <th>
                <>
                  <Controller
                    name={`${servicev1}_ADDITIONAL_AMOUNT.VALUE`}
                    key={`${servicev1}_ADDITIONAL_AMOUNT.VALUE`}
                    control={control}
                    rules={{
                      validate: (value) => {
                        return !!value || (servicev1 === "WS" ? !!WS_REDUCED_AMOUNT?.VALUE : !!SW_REDUCED_AMOUNT?.VALUE);
                      },
                    }}
                    render={(props) => {
                      return (
                        <div style={{paddingTop:"17px"}}>
                        <CheckBox
                          style={{ "marginLeft": "35px" }}
                          // className="form-field"
                          label={t(`${servicev1}_ADDITIONAL_AMOUNT`)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              props.onChange(true);
                              setischeckedAddition(true);
                              setischeckedReduce(false);
                              setOtherTextFieldsAndActionToNull(`${servicev1}_REDUCED_AMOUNT`, false);
                            } else {
                              setischeckedAddition(false);
                              props.onChange(false);
                            }
                          }}
                          disable={isEdit && (state?.data?.applicationDetails?.amendment?.additionalDetails?.editForm?.["WS_ADDITIONAL_AMOUNT"]?.["VALUE"] == false || state?.data?.applicationDetails?.amendment?.additionalDetails?.editForm?.["WS_ADDITIONAL_AMOUNT"]?.["VALUE"] == false) ? true : false}
                          checked={props?.value}
                        />
                        </div>
                      );
                    }}
                  />
                  {errors?.WS_ADDITIONAL_AMOUNT?.VALUE && ischeckedAddition == true ? <CardLabelError>{t("WS_REQUIRED_FIELD")}</CardLabelError> : null}
                </>
              </th>
            </tr>
            {billSearchData?.map((node) => (
              <tr>
                <td style={{ paddingRight: "60px", fontWeight:"700" }}>{t(`${node.taxHeadCode}`)}</td>
                <td style={{  textAlign: "end" }}>₹ {node.amount}</td>
                <div>
                <td style={{ paddingRight: "60px", paddingLeft:"150px" }}>
                  <>
                    <TextInput
                      disabled={servicev1 === "WS" ? !WS_REDUCED_AMOUNT?.VALUE : !SW_REDUCED_AMOUNT?.VALUE}
                      type={"number"}
                      name={`${servicev1}_REDUCED_AMOUNT.${node.taxHeadCode}`}
                      inputRef={register({
                        max: {
                          value: node.amount,
                          message: t(`${servicev1}_ERROR_ENTER_LESS_THAN_MAX_VALUE`),
                        },
                        pattern:{
                          value: /^[+]?[1-9]\d*$/,
                          message: t("CS_INVALID_INPUT")
                        }
                      })}
                    />
                  </>
                </td>
                {servicev1 === "WS"
                      ? errors?.WS_REDUCED_AMOUNT?.[node.taxHeadCode] && <CardLabelError style={{marginBottom:"-20px", marginTop:"-30px", marginLeft:"150px"}}>{errors?.WS_REDUCED_AMOUNT?.[node.taxHeadCode]?.message}</CardLabelError>
                      : errors?.SW_REDUCED_AMOUNT?.[node.taxHeadCode] && <CardLabelError style={{marginBottom:"-20px", marginTop:"-30px", marginLeft:"150px"}}>{errors?.SW_REDUCED_AMOUNT?.[node.taxHeadCode].message}</CardLabelError>}
                  </div>    
                <td style={{ paddingRight: "60px" }}>
                  <>
                    <TextInput
                      disabled={servicev1 === "WS" ? !WS_ADDITIONAL_AMOUNT?.VALUE : !SW_ADDITIONAL_AMOUNT?.VALUE}
                      type={"number"}
                      name={`${servicev1}_ADDITIONAL_AMOUNT.${node.taxHeadCode}`}
                      //inputRef={register()}
                      inputRef={register({
                        pattern:{
                          value: /^[+]?[1-9]\d*$/,
                          message: t("CS_INVALID_INPUT")
                        }
                      })}
                    />
                  </>
                  {servicev1 === "WS"
                      ? errors?.WS_ADDITIONAL_AMOUNT?.[node.taxHeadCode]  && <CardLabelError style={{ marginTop:"-19px"}}>{errors?.WS_ADDITIONAL_AMOUNT?.[node.taxHeadCode]?.message}</CardLabelError>
                      : errors?.SW_ADDITIONAL_AMOUNT?.[node.taxHeadCode]  && (
                          <CardLabelError style={{ marginTop:"-19px"}}>{errors?.SW_ADDITIONAL_AMOUNT?.[node.taxHeadCode]?.message}</CardLabelError>
                        )}
                
                </td>
              </tr>
            ))}
            {<tr>
              <td style={{ paddingRight: "60px", fontWeight:"700" }}>{t("WS_REBATE_PENALTY")}
                <div className="tooltip" style={{marginLeft:"10px",marginBottom:"-4px"}}>
                  <InfoBannerIcon fill="#0b0c0c" style />
                  <span className="tooltiptext" style={{
                    whiteSpace: "nowrap",
                    fontSize: "medium"
                  }}>
                    {`1. ${t(`WS_ADHOC_REBATE_TOOLTIP`)}`}
                    <br /><br />
                    {`2. ${t(`WS_ADHOC_PENALTY_TOOLTIP`)}`}
                  </span>
                </div>
              </td>
              <td style={{  textAlign: "end" }}>₹ {adhocAmount || 0}</td>
              
              <td style={{ paddingRight: "60px", paddingLeft:"150px" }}>
                <>
                  <TextInput
                    disabled={servicev1 === "WS" ? !WS_REDUCED_AMOUNT?.VALUE : !SW_REDUCED_AMOUNT?.VALUE}
                    name={`${servicev1}_REBATE`}
                    inputRef={register()}
                  />
                </>
              </td>
              <td style={{ paddingRight: "60px" }}>
                <>
                  <TextInput
                    disabled={servicev1 === "WS" ? !WS_ADDITIONAL_AMOUNT?.VALUE : !SW_ADDITIONAL_AMOUNT?.VALUE}
                    name={`${servicev1}_PENALTY`}
                    inputRef={register()}
                  />
                </>
              </td>
            </tr>}
            </tbody>
            </div>
          </table>
        ) : (
          <Loader />
        )}
        {BillAmendmentMDMSLoading ? (
          <Loader />
        ) : (
          <>
            <CardSectionHeader style={{ marginBottom: "16px" }}>{t("WS_ADD_DEMAND_REVISION_BASIS")}</CardSectionHeader>
            <CardSectionSubText style={{ marginBottom: "16px" }}>{t("WS_SELECT_DEMAND_REVISION")}</CardSectionSubText>
            <LabelFieldPair>
              <CardLabel style={{ fontWeight: "500" }}>{`${t("WS_DEMAND_REVISION_BASIS")} *`}</CardLabel>
              <Controller
                name="amendmentReason"
                control={control}
                rules={{ required: true }}
                render={(props) => {
                  return (
                    <Dropdown
                      style={isMobile && isEmployee ? {} : { width: "640px" }}
                      option={BillAmendmentMDMS}
                      selected={props?.value}
                      optionKey={"code"}
                      t={t}
                      select={props?.onChange}
                    />
                  );
                }}
              />
            </LabelFieldPair>
            {errors?.amendmentReason ? <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>{t("WS_REQUIRED_FIELD")}</CardLabelError> : null}
            <LabelFieldPair>
              <CardLabel style={{ fontWeight: "500" }}>{`${t(getReasonDocNoHeader())} *`}</CardLabel>
              <div className="reasonDocumentNumber">
                <TextInput style={isMobile && isEmployee ? {} : { width: "640px" }} name="reasonDocumentNumber" inputRef={register({ required: true })} />
              </div>
            </LabelFieldPair>
            {errors?.reasonDocumentNumber ? <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>{t("WS_REQUIRED_FIELD")}</CardLabelError> : null}
            <LabelFieldPair>
              <CardLabel style={{ fontWeight: "500" }}>{`${t("WS_BILL_AMEND_EFFECTIVE_FROM")} *`}</CardLabel>
              <Controller
                render={(props) => <DatePicker style={isMobile && isEmployee ? {} : { width: "640px" }} date={props.value} disabled={false} onChange={props.onChange} />}
                name="effectiveFrom"
                rules={{ required: true }}
                control={control}
              />
            </LabelFieldPair>
            {errors?.effectiveFrom ? <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>{t("WS_REQUIRED_FIELD")}</CardLabelError> : null}
            {amendmentReason?.code !== "COURT_CASE_SETTLEMENT" && <div>
            <LabelFieldPair>
              <CardLabel style={{ fontWeight: "500" }}>{`${t("WS_BILL_AMEND_EFFECTIVE_TILL")} *`}</CardLabel>
              <Controller
                render={(props) => <DatePicker style={isMobile && isEmployee ? {} : { width: "640px" }} date={props.value} disabled={false} onChange={props.onChange} />}
                name="effectiveTill"
                rules={{ required: true, validate: { isValidToDate } }}
                control={control}
              />

            </LabelFieldPair>
            {errors?.effectiveTill?.type === "required" && <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>{t("WS_REQUIRED_FIELD")}</CardLabelError>}
            {errors?.effectiveTill?.message === "Invalid format" && <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>{t("ERR_DEFAULT_INPUT_FIELD_MSG")}</CardLabelError>}
            </div>}
          </>
        )}
        {!!amendmentReason ? <CardSectionHeader style={{ marginBottom: "16px" }}>{t("WS_DOCUMENT_REQUIRED")}</CardSectionHeader> : null}
        {requiredDocuments?.map((e) => (
          <div style={{marginBottom:"25px"}}>
          <LabelFieldPair>
            <CardLabel style={{ fontWeight: "500" }}>
              {t(`${e?.documentType}`)}
              {e?.required ? `*` : null}
            </CardLabel>
            <div className="field">
              <Controller
                name={`DOCUMENTS.${e?.documentType}`}
                control={control}
                rules={e?.required ? { required: true } : {}}
                render={(props) => (
                  <UploadFile
                    id={`ws-doc-${e.documentType}`}
                    onUpload={(d) => functionToHandleFileUpload(d, e?.documentType, props)}
                    onDelete={() => dispatch({ type: "remove", payload: { id: e?.documentType } })}
                    style={isMobile && isEmployee ? {} : { width: "640px" }}
                    //message={functionToDisplayTheMessage}
                    message={e?.url ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
                    accept= "image/*, .pdf, .png, .jpeg, .jpg"
                    textStyles={{ width: "100%" }}
                    inputStyles={{ width: "280px" }}
                    error={error?.message}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          {errors?.["DOCUMENTS"]?.[e?.documentType] || (error && error?.documentType === e.documentType) ? <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px"}}>{error && error?.documentType === e.documentType ? t(error?.message) : t("WS_NO_FILE_SELECTED")}</CardLabelError> : null}
          </div>
        ))}
      </Card>
      {showToast ? (
        <Toast
          isDleteBtn={true}
          // error={updateApplicationError ? "WS_APPLICATION_UPDATE_ERROR" : null}
          error={showToast?.error}
          label={showToast?.label}
          onClose={closeToast}
        />
      ) : null}
      <ActionBar>
        <SubmitBar 
          submit={true} 
          label={state?.data?.action ? t("WF_CITIZEN_NEWSW1_RESUBMIT_APPLICATION") : t("WS_COMMON_BUTTON_SUBMIT")} 
          disabled={
            (servicev1 == "WS" && ischeckedReduce && 
            ((getValues().WS_REDUCED_AMOUNT.WS_CHARGE == "" || getValues().WS_REDUCED_AMOUNT.WS_CHARGE == null) 
            && (getValues().WS_REDUCED_AMOUNT.WS_TIME_PENALTY  == "" || getValues().WS_REDUCED_AMOUNT.WS_TIME_PENALTY  == null) 
            && (getValues().WS_REDUCED_AMOUNT.WS_TIME_INTEREST  == "" || getValues().WS_REDUCED_AMOUNT.WS_TIME_INTEREST  == null) 
            && (getValues().WS_REDUCED_AMOUNT.WS_WATER_CESS == "" || getValues().WS_REDUCED_AMOUNT.WS_WATER_CESS == null))) 
            || 
            (servicev1 == "SW" && ischeckedReduce && 
            ((getValues().SW_REDUCED_AMOUNT.SW_CHARGE == "" || getValues().SW_REDUCED_AMOUNT.SW_CHARGE == null) 
            && (getValues().SW_REDUCED_AMOUNT.SW_TIME_PENALTY  == "" || getValues().SW_REDUCED_AMOUNT.SW_TIME_PENALTY == null)
            && (getValues().SW_REDUCED_AMOUNT.SW_TIME_INTEREST  == "" || getValues().SW_REDUCED_AMOUNT.SW_TIME_INTEREST  == null) 
            && (getValues().SW_REDUCED_AMOUNT.SW_SEWERAGE_CESS == "" || getValues().SW_REDUCED_AMOUNT.SW_SEWERAGE_CESS  == null)))
            || 
            (servicev1 == "WS" && ischeckedAddition && 
            ((getValues().WS_ADDITIONAL_AMOUNT.WS_CHARGE == "" || getValues().WS_ADDITIONAL_AMOUNT.WS_CHARGE == null) 
            && (getValues().WS_ADDITIONAL_AMOUNT.WS_TIME_PENALTY  == "" || getValues().WS_ADDITIONAL_AMOUNT.WS_TIME_PENALTY  == null) 
            && (getValues().WS_ADDITIONAL_AMOUNT.WS_TIME_INTEREST  == "" || getValues().WS_ADDITIONAL_AMOUNT.WS_TIME_INTEREST  == null)  
            && (getValues().WS_ADDITIONAL_AMOUNT.WS_WATER_CESS == "" || getValues().WS_ADDITIONAL_AMOUNT.WS_WATER_CESS == null)))
            || 
            (servicev1 == "SW" && ischeckedAddition && 
            ((getValues().SW_ADDITIONAL_AMOUNT.SW_CHARGE == "" || getValues().SW_ADDITIONAL_AMOUNT.SW_CHARGE == null) 
            && (getValues().SW_ADDITIONAL_AMOUNT.SW_TIME_PENALTY  == "" || getValues().SW_ADDITIONAL_AMOUNT.SW_TIME_PENALTY  == null) 
            && (getValues().SW_ADDITIONAL_AMOUNT.SW_TIME_INTEREST  == "" || getValues().SW_ADDITIONAL_AMOUNT.SW_TIME_INTEREST  == null) 
            && (getValues().SW_ADDITIONAL_AMOUNT.SW_SEWERAGE_CESS == "" || getValues().SW_ADDITIONAL_AMOUNT.SW_SEWERAGE_CESS == null)))
          }
          //UM-4354:: Above code is used To disable the button when reduced amount or additional amount is selected and none of the fields have any value
          />
      </ActionBar>
    </form>
  );
};

export default ApplicationBillAmendment;
