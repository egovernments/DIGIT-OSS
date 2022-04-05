import React, { useEffect, useState,useRef } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";

import { useParams, useLocation, useHistory } from "react-router-dom";
import { ActionBar, Header, Loader, SubmitBar,Card,CardSubHeader,CardSectionHeader,LinkLabel, CardLabel, CardHeader, CardText} from "@egovernments/digit-ui-react-components";
import { useQueryClient } from "react-query";
import _, { first, update } from "lodash";
import { Modal,Dropdown, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import {convertEpochToDate} from "../../utils/index";


const AssessmentDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id: propertyId } = useParams();
  const stateId = Digit.ULBService.getStateId();
  const location = useLocation();
  const AssessmentData = location?.state?.Assessment;
  const [showToast, setShowToast] = useState(null);
  const queryClient = useQueryClient();
  const history = useHistory();
  const [appDetailsToShow, setAppDetailsToShow] = useState({});
  const isMobile = window.Digit.Utils.browser.isMobile();
  
  const [popup,showPopUp]=useState(false);
  const [selectedPenalityReason,setSelectedPenalityReason]=useState(null);
  const [selectedRebateReason,setSelectedRebateReason]=useState(null);


  const first_temp=useRef();
  const second_temp=useRef();
  const third_temp=useRef();
  const fourth_temp=useRef();
  
  const getPropertyTypeLocale = (value) => {
    return `PROPERTYTAX_BILLING_SLAB_${value?.split(".")[0]}`;
  };
  
  const getPropertySubtypeLocale = (value) => `PROPERTYTAX_BILLING_SLAB_${value}`;  

  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.pt.useApplicationDetail(t, tenantId, propertyId);
  const { isLoading: assessmentLoading, mutate: assessmentMutate } = Digit.Hooks.pt.usePropertyAssessment(tenantId);
  const {
    isLoading: ptCalculationEstimateLoading,
    data: ptCalculationEstimateData,
    mutate: ptCalculationEstimateMutate,
  } = Digit.Hooks.pt.usePtCalculationEstimate(tenantId);
  const { data: ChargeSlabsMenu, isLoading: isChargeSlabsLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "ChargeSlabs");
 const fetchBillParams = { consumerCode : propertyId };

 let ptCalculationEstimateDataCopy;
 if(!ptCalculationEstimateDataCopy )
 ptCalculationEstimateDataCopy = ptCalculationEstimateData?.Calculation[0];

  const paymentDetails = Digit.Hooks.useFetchBillsForBuissnessService(
    { businessService: "PT", ...fetchBillParams, tenantId: tenantId },
    {
      enabled: propertyId ? true : false,
    }
  );

  useEffect(() => {
    // estimate calculation
    ptCalculationEstimateMutate({ Assessment: AssessmentData });
    }, []);
  useEffect(() => {
    if (applicationDetails) setAppDetailsToShow(_.cloneDeep(applicationDetails));
  }, [applicationDetails]);

  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: applicationDetails?.tenantId || tenantId,
    id: applicationDetails?.applicationData?.acknowldgementNumber,
    moduleCode: "PT",
    role: "PT_CEMP",
    // serviceData: applicationDetails,
  });
  const date=new Date();

  appDetailsToShow?.applicationDetails?.shift();
  appDetailsToShow?.applicationDetails?.unshift({
    title: "PT_ESTIMATE_DETAILS_HEADER",
    values: [ 
      {
        title: "PT_PROPERTY_PTUID",
        value: propertyId,  
      },
      {
        title: "ES_PT_TITLE_BILLING_PERIOD",
        value: location?.state?.Assessment?.financialYear,
      },
    ],
    additionalDetails: {
      taxHeadEstimatesCalculation: ptCalculationEstimateData?.Calculation[0],
    },
    }
  ); 
  
  const closeToast = () => {
    setShowToast(null);
  };

  const handleAssessment = () => {
    if (!queryClient.getQueryData(["PT_ASSESSMENT", propertyId, location?.state?.Assessment?.financialYear])) {
      assessmentMutate(
        { Assessment:AssessmentData},
        {
          onError: (error, variables) => {
            setShowToast({ key: "error", action: error?.response?.data?.Errors[0]?.message || error.message, error : {  message:error?.response?.data?.Errors[0]?.code || error.message } });
            setTimeout(closeToast, 5000);
          },
          onSuccess: (data, variables) => {
            sessionStorage.setItem("IsPTAccessDone", data?.Assessments?.[0]?.auditDetails?.lastModifiedTime);
            setShowToast({ key: "success", action: { action: "ASSESSMENT" } });
            setTimeout(closeToast, 5000);
            queryClient.clear();
            queryClient.setQueryData(["PT_ASSESSMENT", propertyId, location?.state?.Assessment?.financialYear], true);
          },
        }
      );
    }
  };

  const proceeedToPay = () => {
    history.push(`/digit-ui/employee/payment/collect/PT/${propertyId}`);
  };

  if (ptCalculationEstimateLoading || assessmentLoading||!applicationDetails?.applicationDetails) {
    return <Loader />;
  }


let address_to_display=applicationDetails?.applicationData?.address;
if(address_to_display?.doorNo){
    address_to_display=address_to_display?.doorNo+','+address_to_display?.locality?.area+','+address_to_display?.city;
}
else{
    address_to_display=address_to_display?.locality?.area+','+address_to_display?.city;
}


const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};
function change(){
  var total_amount=ptCalculationEstimateData?.Calculation[0]?.totalAmount
  const [first,second]=[parseInt(first_temp.current.value),parseInt(second_temp.current.value)];
    if((selectedPenalityReason && first>0)/* &&(!selectedRebateReason) */){
      if(selectPenalityReason.value!=='Others'){
        if(first<total_amount){
          var additionalPenality=first;
          ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]={
            "taxHeadCode": "PT_TIME_PENALTY",
            "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]?.estimateAmount+first,
            "category": "TAX"
        }
        AssessmentData.additionalDetails={
          "adhocPenalty":additionalPenality,
          "adhocPenaltyReason":selectedPenalityReason.value,
        }
        ptCalculationEstimateData.Calculation[0].totalAmount=ptCalculationEstimateData?.Calculation[0]?.totalAmount+first;
           }
           else{
             alert("Penality cannot exceed total amount");
           }
      }
      else{
        if(first<total_amount){
          var additionalPenality=first;
          ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]={
            "taxHeadCode": "PT_TIME_PENALTY",
            "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]?.estimateAmount+first,
            "category": "TAX"
        }
        AssessmentData.additionalDetails={
          "adhocPenalty":additionalPenality,
          "adhocPenaltyReason":fourth_temp.current.value,
        }
        ptCalculationEstimateData.Calculation[0].totalAmount=ptCalculationEstimateData?.Calculation[0]?.totalAmount+first;
           }
           else{
             alert("Penality cannot exceed total amount");
           }
      }
    } 

   if((selectedRebateReason && second) /* && (!selectedPenalityReason) */){
    if(selectedRebateReason.value!=="Others"){
      if(second>0){
        if(second<total_amount){
          ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]={
            "taxHeadCode": "PT_TIME_REBATE",
            "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]?.estimateAmount+second,
            "category": "TAX"
        }
        AssessmentData.additionalDetails={
          "adhocExemption":second,
          "adhocExemptionReason":selectedRebateReason.value,
        }
        ptCalculationEstimateData.Calculation[0].totalAmount=ptCalculationEstimateData?.Calculation[0]?.totalAmount-second;
           }
           else{
             alert( "Adhoc Exemption cannot be greater than the estimated tax for the given property");
           }
      }
    }
    else{
      if(second>0){
        if(second<total_amount){
          ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]={
            "taxHeadCode": "PT_TIME_REBATE",
            "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]?.estimateAmount-second,
            "category": "TAX"
        }
        AssessmentData.additionalDetails={
          "adhocExemption":second,
          "adhocExemptionReason":third_temp.current.value,
        }
        ptCalculationEstimateData.Calculation[0].totalAmount=ptCalculationEstimateData?.Calculation[0]?.totalAmount-second;
           }
           else{
             alert( "Adhoc Exemption cannot be greater than the estimated tax for the given property");
           }
      }
    }
  }
  setSelectedPenalityReason(null);
  setSelectedRebateReason(null);
  showPopUp(false);
}

const Penality_menu=[
  {
    title:"PT_PENDING_DUES_FROM_EARLIER",
    value:"Pending dues from earlier",
  },
  {
    title:"PT_MISCALCULATION_OF_EARLIER_ASSESSMENT",
    value:"Miscalculation of earlier Assessment",
  },
  {
    title:"PT_ONE_TIME_PENALITY",
    value:"One time penality",
  },
  {
    title:"PT_OTHERS",
    value:"Others",
  },
  ]
  const Rebate_menu=[
    {
      title:"PT_ADVANCED_PAID_BY_CITIZEN_EARLIER",
      value:"Advanced Paid By Citizen Earlier",
    },
    {
      title:"PT_REBATE_PROVIDED_BY_COMMISSIONER_EO",
      value:"Rebate provided by commissioner/EO",
    },
    {
      title:"PT_ADDITIONAL_AMOUNT_CHARGED_FROM_THE_CITIZEN",
      value:"Additional amount charged from the citizen",
    },
    {
      title:"PT_OTHERS",
      value:"Others",
    },
    ]
  const selectPenalityReason=(reason)=>{
    setSelectedPenalityReason(reason);
  }
  const selectRebateReason=(reason)=>{
    setSelectedRebateReason(reason);
  }
/* const RebatePenalityPoPup=() =>{
  return (
    <Modal
          headerBarMain={<Heading label={t("PT_ADD_REBATE_PENALITY")}/>}
          headerBarEnd={<CloseBtn onClick={()=>showPopUp(false)}/>}
          actionCancelLabel={t("PT_CANCEL")}
          actionCancelOnSubmit={()=>showPopUp(false)}
          actionSaveLabel={t("PT_ADD")}
          actionSaveOnSubmit={()=>(change())}
          hideSubmit={false}
          >
  {
      <div>
        <Card>
        <CardSectionHeader>{t("PT_AD_PENALTY")}</CardSectionHeader>
            <CardLabel>
            {t("PT_TX_HEADS")}
            </CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <Dropdown
                 isMandatory
                 option={Penality_menu}
                 optionKey="value"
                 select={selectPenalityReason}
                 selected={selectedPenalityReason}
                 isPropertyAssess={true}
                 t={t}
                 />
                </div>
              </div>
            </div>  
            {selectedPenalityReason && selectedPenalityReason.value==="Others" && <div className="field">
            <CardLabel>{t("PT_REASON")}</CardLabel>
              <div className="field-container">
                <div className="text-input field">
                <input type="type" className="employee-card-input false focus-visible undefined" ref={fourth_temp}/>
                </div>
              </div>
            </div>}      
            <CardLabel>{t("PT_HEAD_AMT")}</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <input key="firstTemp" type="number" className="employee-card-input false focus-visible undefined" ref={first_temp}/>
                </div>
              </div>
            </div>                  
        </Card>
        <Card>
        <CardSectionHeader>{t("PT_AD_REBATE")}</CardSectionHeader>
            <CardLabel>{t("PT_TX_HEADS")}</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <Dropdown
                 isMandatory
                 option={Rebate_menu}
                 optionKey="value"
                 select={selectRebateReason}
                 selected={selectedRebateReason}
                 isPropertyAssess={true}
                 t={t}
                 />
                </div>
              </div>
            </div>    
            {selectedRebateReason && selectedRebateReason.value==="Others" && <div className="field">
            <CardLabel>{t("PT_REASON")}</CardLabel>
              <div className="field-container">
                <div className="text-input field">
                <input type="type" className="employee-card-input false focus-visible undefined" ref={third_temp}/>
                </div>
              </div>
            </div>}  
            <CardLabel>{t("PT_HEAD_AMT")}</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <input type="number" className="employee-card-input false focus-visible undefined" ref={second_temp}/>
                </div>
              </div>
            </div> 
        </Card>
      </div>
    }
    </Modal>)
} */
  return (
    <div>
      <Header>{t("PT_TX_ASSESSMENT")}</Header>
      <ApplicationDetailsTemplate
        applicationDetails={
          {
            applicationDetails:[
            {
              title: "PT_ESTIMATE_DETAILS_HEADER",
              values: [ 
                {
                  title: "PT_PROPERTY_PTUID",
                  value: propertyId,  
                },
                {
                  title: "PT_ADDRESS",
                  value: address_to_display,
                },
                {
                  title: "ES_PT_TITLE_BILLING_PERIOD",
                  value: location?.state?.Assessment?.financialYear,
                },
                {
                  title:"PT_BILLING_DUE_DATE",
                  //value:date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear(),
                  value:convertEpochToDate(paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.expiryDate,"PT") || t("CS_NA"),
                },
              ],
              },
              {
                title:"PT_TAX_ESTIMATION_HEADER",
                additionalDetails: {
                  taxHeadEstimatesCalculation: ptCalculationEstimateData?.Calculation[0],
                },
              },
              {
                belowComponent:()=><LinkLabel onClick={()=>{showPopUp(true)}} style={isMobile ? {color:"#F47738",marginLeft:"0px"} : {color:"#F47738"}}>{t("PT_ADD_REBATE_PENALITY")}</LinkLabel>
              },
              {
                title: "PT_ASSESMENT_INFO_SUB_HEADER",
                values: [
                  { title: "PT_ASSESMENT_INFO_TYPE_OF_BUILDING", value: getPropertyTypeLocale(applicationDetails?.applicationData?.propertyType) },
                  { title: "PT_ASSESMENT_INFO_USAGE_TYPE", value: getPropertySubtypeLocale(applicationDetails?.applicationData?.usageCategory) },
                  { title: "PT_ASSESMENT_INFO_PLOT_SIZE", value: applicationDetails?.applicationData?.landArea },
                  { title: "PT_ASSESMENT_INFO_NO_OF_FLOOR", value: applicationDetails?.applicationData?.noOfFloors },
                ],
                additionalDetails: {
                  floors: applicationDetails?.applicationData?.units
                    ?.filter((e) => e.active)
                    ?.sort?.((a, b) => a.floorNo - b.floorNo)
                    ?.map((unit, index) => {
                      let floorName = `PROPERTYTAX_FLOOR_${unit.floorNo}`;
                      const values = [
                        {
                          title: `${t("ES_APPLICATION_DETAILS_UNIT")} ${index + 1}`,
                          value: "",
                        },
                        {
                          title: "Floor No",
                          value: unit?.floorNo,
                        },
                        {
                          title: "PT_ASSESSMENT_UNIT_USAGE_TYPE",
                          value: `PROPERTYTAX_BILLING_SLAB_${
                            unit?.usageCategory != "RESIDENTIAL" ? unit?.usageCategory?.split(".")[1] : unit?.usageCategory
                          }`,
                        },
                        {
                          title: "PT_ASSESMENT_INFO_OCCUPLANCY",
                          value: unit?.occupancyType,
                        },
                        {
                          title: "PT_FORM2_BUILT_AREA",
                          value: unit?.constructionDetail?.builtUpArea,
                        },
                      ];
        
                      if (unit.occupancyType === "RENTED") values.push({ title: "PT_FORM2_TOTAL_ANNUAL_RENT", value: unit.arv });
        
                      return {
                        //title: floorName,
                        title:"",
                        values: [
                          {
                            title: "",
                            values,
                          },
                        ],
                      };
                    }),
                },
              },
            {
              belowComponent:()=>{
                return (
                  <div style={{marginTop:"19px"}}>
                  <CardSubHeader style={{marginBottom:"8px",color:"#0B0C0C",fontSize:"24px"}}>
                  {t("PT_CALC_DETAILS")}<br/>
                  </CardSubHeader>
                  <CardSectionHeader style={{marginBottom:"16px",color:"#0B0C0C",fontSize:"16px",marginTop:"revert"}}>{t("PT_CALC_LOGIC_HEADER")}</CardSectionHeader>
                  <CardText style={{fontSize:"16px"}}>{t("PT_CALC_LOGIC")}</CardText>
                    {/* <div className="employee-data-table" style={{position:"relative",padding:"8px"}}>
                    <div style={{position:"absolute",maxWidth:"640px",border:"1px solid rgb(214,213,212)",inset:"0px",width:"auto"}}/> */}
                    <div style={{ border: "1px solid #D6D5D4", padding: "16px", marginTop: "8px", borderRadius: "4px", background: "#FAFAFA" }}>
                    <div className="row border-none"><h2>{t("PT_APPLICABLE_CHARGE_SLABS")}</h2></div>
                    {/* <div className="row border-none"><h2>{t("PT_GRND_FLOOR_UNIT-1")}</h2>
                    <div className="value">{t("PT_RATE")}</div>
                    </div> */}
                    <StatusTable>
                    {applicationDetails?.applicationData?.units
                    ?.filter((e) => e.active)
                    ?.sort?.((a, b) => a.floorNo - b.floorNo)
                    ?.map((unit, index) => (
                    <Row label={`${t(`PROPERTYTAX_FLOOR_${unit?.floorNo}`)} ${t(`PT_UNIT`)} - ${index+1}`} text={ChargeSlabsMenu?.PropertyTax && ChargeSlabsMenu?.PropertyTax?.ChargeSlabs?.filter((ob) => ob.floorNo == unit.floorNo)?.[0]?.name} />
                    ))}
                    </StatusTable>
                   </div>
                  </div>
                  
                )
              }
            }
          ]}
        }
        showTimeLine={false}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={appDetailsToShow?.applicationData}
        mutate={null}
        workflowDetails={
          queryClient.getQueryData(["PT_ASSESSMENT", propertyId, location?.state?.Assessment?.financialYear])
            ? { ...workflowDetails, data: { ...workflowDetails.data, nextActions: [] } }
            : workflowDetails
        }
        businessService="PT"
        assessmentMutate={assessmentMutate}
        ptCalculationEstimateMutate={ptCalculationEstimateMutate}
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        timelineStatusPrefix={"ES_PT_COMMON_STATUS_"}
        forcedActionPrefix={"WF_EMPLOYEE_PT.CREATE"}
      />
      {/* {popup && (<RebatePenalityPoPup/>)} */}
      {  popup && <Modal
          headerBarMain={<Heading label={t("PT_ADD_REBATE_PENALITY")}/>}
          headerBarEnd={<CloseBtn onClick={()=> {showPopUp(false), ptCalculationEstimateData.Calculation[0] = ptCalculationEstimateDataCopy; setSelectedPenalityReason(null); setSelectedRebateReason(null);}}/>}
          actionCancelLabel={t("PT_CANCEL")}
          actionCancelOnSubmit={()=>{ptCalculationEstimateData.Calculation[0] = ptCalculationEstimateDataCopy; setSelectedPenalityReason(null);setSelectedRebateReason(null); showPopUp(false)}}
          actionSaveLabel={t("PT_ADD")}
          actionSaveOnSubmit={()=>(change())}
          hideSubmit={false}
          >
      {
      <div>
        <Card>
        <CardSectionHeader>{t("PT_AD_PENALTY")}</CardSectionHeader>
            <CardLabel>
            {t("PT_TX_HEADS")}
            </CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <Dropdown
                 isMandatory
                 option={Penality_menu}
                 optionKey="value"
                 select={selectPenalityReason}
                 selected={selectedPenalityReason}
                 isPropertyAssess={true}
                 t={t}
                 />
                </div>
              </div>
            </div>  
            {selectedPenalityReason && selectedPenalityReason.value==="Others" && <div className="field">
            <CardLabel>{t("PT_REASON")}</CardLabel>
              <div className="field-container">
                <div className="text-input field">
                <input type="type" className="employee-card-input false focus-visible undefined" ref={fourth_temp}/>
                </div>
              </div>
            </div>}      
            <CardLabel>{t("PT_HEAD_AMT")}</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <input key="firstTemp" type="number" className="employee-card-input false focus-visible undefined" ref={first_temp}/>
                </div>
                {/* <TextInput
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="first_temp"
                value={first_temp}
                onChange={setFirstTemp}
                />  */}
              </div>
            </div>                  
        </Card>
        <Card>
        <CardSectionHeader>{t("PT_AD_REBATE")}</CardSectionHeader>
            <CardLabel>{t("PT_TX_HEADS")}</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <Dropdown
                 isMandatory
                 option={Rebate_menu}
                 optionKey="value"
                 select={selectRebateReason}
                 selected={selectedRebateReason}
                 isPropertyAssess={true}
                 t={t}
                 />
                </div>
              </div>
            </div>    
            {selectedRebateReason && selectedRebateReason.value==="Others" && <div className="field">
            <CardLabel>{t("PT_REASON")}</CardLabel>
              <div className="field-container">
                <div className="text-input field">
                <input type="type" className="employee-card-input false focus-visible undefined" ref={third_temp}/>
                </div>
              </div>
            </div>}  
            <CardLabel>{t("PT_HEAD_AMT")}</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <input type="number" className="employee-card-input false focus-visible undefined" ref={second_temp}/>
                </div>
              </div>
            </div> 
        </Card>
      </div>
    }
    </Modal>}
      {!queryClient.getQueryData(["PT_ASSESSMENT", propertyId, location?.state?.Assessment?.financialYear]) ? (
        <ActionBar>
          <SubmitBar label={t("PT_ASSESS_PROPERTY_BUTTON")} onSubmit={handleAssessment} />
        </ActionBar>
      ) : (
        <ActionBar>
          <SubmitBar label={t("PT_PROCEED_PAYMENT")} onSubmit={proceeedToPay} />
        </ActionBar>
      )}
    </div>
  );
};

export default AssessmentDetails;