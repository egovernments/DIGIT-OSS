import { CardHeader, Header, Toast, Card, StatusTable, Row, Loader, Menu, PDFSvg, SubmitBar, LinkButton, ActionBar, CheckBox, MultiLink } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import BPAApplicationTimeline from "./BPAApplicationTimeline";
import DocumentDetails from "../../../components/DocumentDetails";
import ActionModal from "./Modal";
import OBPSDocument from "../../../pageComponents/OBPSDocuments";
import SubOccupancyTable from "../../../../../templates/ApplicationDetails/components/SubOccupancyTable";
import { getBusinessServices } from "../../../utils";

const BpaApplicationDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const queryClient = useQueryClient();
  const [showToast, setShowToast] = useState(null);
  const [isTocAccepted, setIsTocAccepted] = useState(false); 
  const [displayMenu, setDisplayMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [appDetails, setAppDetails] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [payments, setpayments] = useState([]);
  const history = useHistory();
  sessionStorage.setItem("bpaApplicationDetails", false);
  let isFromSendBack = false;
  const { data, isLoading } = Digit.Hooks.obps.useBPADetailsPage(tenantId, { applicationNo: id });
  const mutation = Digit.Hooks.obps.useObpsAPI(data?.applicationData?.tenantId, false);
  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: data?.applicationData?.tenantId,
    id: id,
    moduleCode: "OBPS",
    config: {
      enabled: !!data
    }
  });

  let businessService = [];

  if(data && data?.applicationData?.businessService === "BPA_LOW")
  {
    businessService = ["BPA.LOW_RISK_PERMIT_FEE"]
  }
  else if(data && data?.applicationData?.businessService === "BPA" && data?.applicationData?.riskType === "HIGH")
  {
    businessService = ["BPA.NC_APP_FEE","BPA.NC_SAN_FEE"];
  }
  else
  {
    businessService = ["BPA.NC_OC_APP_FEE","BPA.NC_OC_SAN_FEE"];
  }


  useEffect(async() => {
    businessService.length > 0 && businessService.map((buss,index) => {
      let res = Digit.PaymentService.recieptSearch(data?.applicationData?.tenantId, buss, {consumerCodes: data?.applicationData?.applicationNo}).then((value) => {

       value?.Payments[0] && !(payments.filter((val) => val?.id ===value?.Payments[0].id).length>0) && setpayments([...payments,...value?.Payments]);  
      });
    })
    
  },[data, businessService]);

  useEffect(() => {
    let payval=[]
    payments.length>0 && payments.map((ob) => {
      ob?.paymentDetails?.[0]?.bill?.billDetails?.[0]?.billAccountDetails.map((bill,index) => {
        payval.push({title:`${bill?.taxHeadCode}_DETAILS`, value:""});
        payval.push({title:bill?.taxHeadCode, value:`₹${bill?.amount}`});
        payval.push({title:"BPA_STATUS_LABEL", value:"Paid"});
      })
      payval.push({title:"BPA_TOT_AMT_PAID", value:`₹${ob?.paymentDetails?.[0]?.bill?.billDetails?.[0]?.amount}`});
    })
    payments.length > 0 && !(data.applicationDetails.filter((ob) => ob.title === "BPA_FEE_DETAILS_LABEL").length>0)&& data.applicationDetails.push({
      title:"BPA_FEE_DETAILS_LABEL",
      additionalDetails:{
        inspectionReport:[],
        values:[...payval]
      }
    })
  },[payments]);

  const getTranslatedValues = (dataValue, isNotTranslated) => {
    if(dataValue) {
      return !isNotTranslated ? t(dataValue) : dataValue
    } else {
      return t("NA")
    }
  };


  async function getRecieptSearch({tenantId,payments,...params}) {
    let response = { filestoreIds: [payments?.fileStoreId] };
    if (!payments?.fileStoreId) {
      response = await Digit.PaymentService.generatePdf(tenantId, { Payments: [{...payments}] }, "consolidatedreceipt");
    }
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }

  async function getPermitOccupancyOrderSearch({tenantId},order) {
    let requestData = {...data?.applicationData, edcrDetail:[{...data?.edcrDetails}]}
    let response = await Digit.PaymentService.generatePdf(tenantId, { Bpa: [requestData] }, order);
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }

  async function getRevocationPDFSearch({tenantId,...params}) {
    let requestData = {...data?.applicationData}
    let response = await Digit.PaymentService.generatePdf(tenantId, { Bpa: [requestData] }, "bpa-revocation");
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }

  useEffect(() => {
    const workflow = { action: selectedAction }
    switch (selectedAction) {
      case "APPROVE":
      case "SEND_TO_ARCHITECT":
      case "APPLY":
      case "SKIP_PAYMENT":
        setShowModal(true);
    }
  }, [selectedAction]);

  const closeToast = () => {
    setShowToast(null);
  };

  const downloadDiagram = (val) => {
    location.href = val;
  }

  const handleChange = () => {

  }

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  function onActionSelect(action) {
    if(action === "FORWARD") {
      history.replace(`/digit-ui/citizen/obps/sendbacktocitizen/ocbpa/${data?.applicationData?.tenantId}/${data?.applicationData?.applicationNo}/check`, { data: data?.applicationData, edcrDetails: data?.edcrDetails });
    }
    if (action === "PAY") {
      window.location.assign(`${window.location.origin}/digit-ui/citizen/payment/collect/${`${getBusinessServices(data?.businessService, data?.applicationStatus)}/${id}/${data?.tenantId}?tenantId=${data?.tenantId}`}`);
    }
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  const submitAction = (workflow) => {
    mutation.mutate(
      { BPA: { ...data?.applicationData, workflow } },
      {
        onError: (error, variables) => {
          // console.log("find error here",error)
          setShowModal(false);
          setShowToast({ key: "error", action: error });
          setTimeout(closeToast, 5000);
        },
        onSuccess: (data, variables) => {
          setShowModal(false);
          setShowToast({ key: "success", action: selectedAction });
          setTimeout(closeToast, 5000);
          queryClient.invalidateQueries("BPA_DETAILS_PAGE");
          queryClient.invalidateQueries("workFlowDetails");
        },
      }
    );
  }

  if (workflowDetails?.data?.processInstances?.[0]?.action === "SEND_BACK_TO_CITIZEN") {
      if(isTocAccepted) setIsTocAccepted(true);
      isFromSendBack = true;
      const userInfo = Digit.UserService.getUser();
      const rolearray = userInfo?.info?.roles;
      if(rolearray?.length !== 1) {
        workflowDetails = {
          ...workflowDetails,
          data: {
            ...workflowDetails?.data,
            actionState: {
              nextActions: [],
            },
          },
          data: {
            ...workflowDetails?.data,
            nextActions: []
          }
        };
      }
  }

  if (isLoading) {
    return <Loader />
  }

  let dowloadOptions = [];
  if(data?.applicationData?.businessService==="BPA_OC" && data?.applicationData?.status==="APPROVED"){
    dowloadOptions.push({
      label: t("BPA_OC_CERTIFICATE"),
      onClick: () => getPermitOccupancyOrderSearch({tenantId: data?.applicationData?.tenantId},"occupancy-certificate"),
    });
  }
  if(data?.comparisionReport){
    dowloadOptions.push({
      label: t("BPA_COMPARISON_REPORT_LABEL"),
      onClick: () => window.open(data?.comparisionReport?.comparisonReport, "_blank"),
    });
  }
  if(data && data?.applicationData?.businessService === "BPA_LOW"  && payments.length>0)
  {
    dowloadOptions.push({
      label: t("BPA_FEE_RECEIPT"),
      onClick: () => getRecieptSearch({tenantId: data?.applicationData?.tenantId,payments: payments[0],consumerCodes: data?.applicationData?.applicationNo}),
    });
    !(data?.applicationData?.status.includes("REVOCATION")) && dowloadOptions.push({
      label: t("BPA_PERMIT_ORDER"),
      onClick: () => getPermitOccupancyOrderSearch({tenantId: data?.applicationData?.tenantId},"buildingpermit-low"),
    });
    (data?.applicationData?.status.includes("REVOCATION")) && dowloadOptions.push({
      label: t("BPA_REVOCATION_PDF_LABEL"),
      onClick: () => getRevocationPDFSearch({tenantId: data?.applicationData?.tenantId}),
    });
    
  }
  else if(data && data?.applicationData?.businessService === "BPA" && data?.applicationData?.riskType === "HIGH" )
  {
    dowloadOptions.push({
      label: t("BPA_APP_FEE_RECEIPT"),
      onClick: () => getRecieptSearch({tenantId: data?.applicationData?.tenantId,payments: payments[0],consumerCodes: data?.applicationData?.applicationNo}),
    });
    if(payments.length == 2)dowloadOptions.push({
      label: t("BPA_SAN_FEE_RECEIPT"),
      onClick: () => getRecieptSearch({tenantId: data?.applicationData?.tenantId,payments: payments[1],consumerCodes: data?.applicationData?.applicationNo}),
    });
  }
  else
  {
    payments.length>0 && dowloadOptions.push({
      label: t("BPA_APP_FEE_RECEIPT"),
      onClick: () => getRecieptSearch({tenantId: data?.applicationData?.tenantId,payments: payments[0],consumerCodes: data?.applicationData?.applicationNo}),
    });
    if(payments.length == 2)dowloadOptions.push({
      label: t("BPA_SAN_FEE_RECEIPT"),
      onClick: () => getRecieptSearch({tenantId: data?.applicationData?.tenantId,payments: payments[1],consumerCodes: data?.applicationData?.applicationNo}),
    });
  }

  if (workflowDetails?.data?.nextActions?.length > 0) {
    workflowDetails.data.nextActions = workflowDetails?.data?.nextActions?.filter(actn => actn.action !== "INITIATE");
    workflowDetails.data.nextActions = workflowDetails?.data?.nextActions?.filter(actn => actn.action !== "ADHOC");
  };
  
  return (
    <Fragment>
      <Header>{t("CS_TITLE_APPLICATION_DETAILS")}</Header>
      {dowloadOptions && dowloadOptions.length>0 && <MultiLink
          className="multilinkWrapper"
          onHeadClick={() => setShowOptions(!showOptions)}
          displayOptions={showOptions}
          options={dowloadOptions}
          style={{top:"90px"}}
        />}
      {data?.applicationDetails?.map((detail, index, arr) => {
        return (
          <Card key={index} style={detail?.title === ""?{marginTop:"-8px"}:{}}>
            <CardHeader>{t(detail?.title)}</CardHeader>
            <StatusTable>
              {!(detail?.additionalDetails?.noc) && detail?.values?.map((value) => (
                <Row className="border-none" label={t(value?.title)} text={getTranslatedValues(value?.value , value?.isNotTranslated) || t("CS_NA")} />
              ))}
              {detail?.additionalDetails?.owners && detail?.additionalDetails?.owners.map((owner,index) => (
                <div key={index}>
                <Row className="border-none" label={`${t("Owner")} - ${index+1}`} />
                {owner?.values.map((value) =>(
                  <Row className="border-none" label={t(value?.title)} text={getTranslatedValues(value?.value , value?.isNotTranslated) || t("CS_NA")} />
                ))}
                </div>
              ))}
              {!(detail?.additionalDetails?.FIdocuments) && !(detail?.additionalDetails?.subOccupancyTableDetails) && detail?.additionalDetails?.values && detail?.additionalDetails?.values?.map((value) => (
                <Row className="border-none" label={t(value?.title)} text={getTranslatedValues(value?.value , value?.isNotTranslated) || t("CS_NA")} />
              ))}
              {detail?.additionalDetails?.FIdocuments && detail?.additionalDetails?.values && detail?.additionalDetails?.values?.map((doc,index) => (
              <div key={index}>
                {doc.isNotDuplicate && <div> 
                <StatusTable>
                <Row label={t(doc?.documentType)}></Row>
                <OBPSDocument value={detail?.additionalDetails?.values} Code={doc?.documentType} index={index}/> 
                <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
                </StatusTable>
                </div>}
             </div>
          )) }
              {detail?.additionalDetails?.subOccupancyTableDetails && <SubOccupancyTable edcrDetails={detail?.additionalDetails} />}
        {detail?.additionalDetails?.noc && detail?.additionalDetails?.noc.map((nocob, ind) => (
        <div key={ind}>
        <StatusTable>
        <Row className="border-none" label={t(`BPA_${nocob?.values?.[0]?.documentType.replaceAll(".","_")}_HEADER`)}></Row>
        <Row className="border-none" label={t(`${detail?.values?.[0]?.title}`)} textStyle={{marginLeft:"10px"}} text={getTranslatedValues(detail?.values?.[0]?.value , detail?.values?.[0]?.isNotTranslated)} />
        <Row className="border-none" label={t(`${nocob?.title}`)}></Row>
        </StatusTable>
        {nocob?.values && nocob?.values.map((noc,index)=> (
        <div key={index}>
        <StatusTable>
        <OBPSDocument value={nocob?.values} Code={noc?.documentType?.split("_")[0]} index={index} isNOC={true}/> 
        </StatusTable>
        </div>
        ))
        }
        </div>
      ))}
              {detail?.additionalDetails?.obpsDocuments?.[0]?.values && (
                <Fragment>
                  <Row className="border-none" label={t(detail?.additionalDetails?.obpsDocuments?.[0].title)} />
                  <DocumentDetails documents={detail?.additionalDetails?.obpsDocuments?.[0]?.values} />
                </Fragment>
              )}
              {detail?.additionalDetails?.scruntinyDetails &&
                // <DocumentDetails documents={detail?.additionalDetails?.scruntinyDetails} />
                detail?.additionalDetails?.scruntinyDetails.map((scrutiny) => (
                  <Fragment>
                    <Row className="border-none" label={t(scrutiny?.title)} />
                    <LinkButton 
                      onClick={() => downloadDiagram(scrutiny?.value)} 
                      label={<PDFSvg style={{background: "#f6f6f6", padding: "8px" }} width="100px" height="100px" viewBox="0 0 25 25" minWidth="100px" />}>
                    </LinkButton>
                  </Fragment>
                ))}
            </StatusTable>
            {index === arr.length - 1 && (
              <Fragment>
                <BPAApplicationTimeline application={data?.applicationData} id={id} />
                {!workflowDetails?.isLoading && workflowDetails?.data?.nextActions?.length > 0 && !isFromSendBack && (
                  <CheckBox
                    styles={{ margin: "20px 0 40px" }}
                    checked={isTocAccepted}
                    label={t(`BPA_TERMS_AND_CONDITIONS`)}
                    onChange={() => setIsTocAccepted(!isTocAccepted)}
                  />
                )}
                {!workflowDetails?.isLoading && workflowDetails?.data?.nextActions?.length > 0 && (
                  <ActionBar style={{position: "relative", boxShadow: "none", minWidth: "240px", maxWidth: "310px", padding: "0px"}}>
                  <div style={{width: "100%"}}>
                    {displayMenu && workflowDetails?.data?.nextActions ? (
                      <Menu
                        style={{ bottom: "37px", minWidth: "240px", maxWidth: "310px", width: "100%", right: "0px"  }}
                        localeKeyPrefix={"WF_BPA"}
                        options={workflowDetails?.data?.nextActions.map((action) => action.action)}
                        t={t}
                        onSelect={onActionSelect}
                      />
                    ) : null}
                    <SubmitBar style={{width: "100%"}} disabled={isFromSendBack ? !isFromSendBack : !isTocAccepted} label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
                  </div>
                  </ActionBar>
                )}
              </Fragment>
            )}
          </Card>
        );
      })}
      {showModal ? (
        <ActionModal
          t={t}
          action={selectedAction}
          tenantId={tenantId}
          // state={state}
          id={id}
          closeModal={closeModal}
          submitAction={submitAction}
          actionData={workflowDetails?.data?.timeline}
        />
      ) : null}
      {showToast && (
        <Toast
          error={showToast.key === "error" ? true : false}
          label={t(showToast.key === "success" ? `ES_OBPS_${showToast.action}_UPDATE_SUCCESS` : showToast.action)}
          onClose={closeToast}
          style={{zIndex: "1000"}}
        />
      )}
    </Fragment>
  );
};

export default BpaApplicationDetail;