import React, { useEffect, useState,useRef } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";

import { useParams, useLocation, useHistory } from "react-router-dom";
import { ActionBar, Header, Loader, SubmitBar,Card,CardSubHeader,CardSectionHeader,LinkLabel, CardLabel, CardHeader} from "@egovernments/digit-ui-react-components";
import { useQueryClient } from "react-query";
import _, { first, update } from "lodash";
import { Modal,Dropdown } from "@egovernments/digit-ui-react-components";
import { First } from "react-bootstrap/esm/PageItem";

const AssessmentDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id: propertyId } = useParams();
  const location = useLocation();
  const AssessmentData = location?.state?.Assessment;
  const [showToast, setShowToast] = useState(null);
  const queryClient = useQueryClient();
  const history = useHistory();
  const [appDetailsToShow, setAppDetailsToShow] = useState({});
  
  const [popup,showPopUp]=useState(false);
  const [selectedPenalityReason,setSelectedPenalityReason]=useState(null);
  const [selectedRebateReason,setSelectedRebateReason]=useState(null);


  const first_temp=useRef();
  const second_temp=useRef();
  

  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.pt.useApplicationDetail(t, tenantId, propertyId);
  const { isLoading: assessmentLoading, mutate: assessmentMutate } = Digit.Hooks.pt.usePropertyAssessment(tenantId);
  const {
    isLoading: ptCalculationEstimateLoading,
    data: ptCalculationEstimateData,
    mutate: ptCalculationEstimateMutate,
  } = Digit.Hooks.pt.usePtCalculationEstimate(tenantId);

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
        title: "Property Address",
        value: "Amristar",
      },
      {
        title: "ES_PT_TITLE_BILLING_PERIOD",
        value: location?.state?.Assessment?.financialYear,
      },
      {
        title:"Billing Due Date",
        value:date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear(),
      },
    ],
    additionalDetails: {
      taxHeadEstimatesCalculation: ptCalculationEstimateData?.Calculation[0],
    },
    }
  );

  const requiredDetails=applicationDetails?.applicationDetails?.filter((e)=>e.title=="PT_ASSESMENT_INFO_SUB_HEADER");
 
  
  const closeToast = () => {
    setShowToast(null);
  };

  const handleAssessment = () => {
    if (!queryClient.getQueryData(["PT_ASSESSMENT", propertyId, location?.state?.Assessment?.financialYear])) {
      assessmentMutate(
        { Assessment:AssessmentData},
        {
          onError: (error, variables) => {
            setShowToast({ key: "error", action: error?.response?.data?.Errors[0]?.message || error.message });
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
  var existing_penality=0;
  var existing_rebate=0;
  var total_amount=ptCalculationEstimateData?.Calculation[0]?.totalAmount
  const [first,second]=[parseInt(first_temp.current.value),parseInt(second_temp.current.value)];
    if((selectedPenalityReason && first>0)&&(!selectedRebateReason)){
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

  else if((selectedRebateReason && second) && (!selectedPenalityReason)){
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
      ptCalculationEstimateData.Calculation[0].totalAmount=ptCalculationEstimateData?.Calculation[0]?.totalAmount+second;
         }
         else{
           alert( "Adhoc Exemption cannot be greater than the estimated tax for the given property");
         }
    }


  }
  else if((selectedPenalityReason && first>0)&&(selectedRebateReason && second>0)){
      if(first<total_amount){
        ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]={
          "taxHeadCode": "PT_TIME_PENALTY",
          "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]?.estimateAmount+first,
          "category": "TAX"
      }
      ptCalculationEstimateData.Calculation[0].totalAmount=ptCalculationEstimateData?.Calculation[0]?.totalAmount+first;

         }
         else{
           alert("Penality cannot exceed total amount");
         }
      if(second<total_amount){
        ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]={
          "taxHeadCode": "PT_TIME_REBATE",
          "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]?.estimateAmount+second,
          "category": "TAX"
      }
      ptCalculationEstimateData.Calculation[0].totalAmount=ptCalculationEstimateData?.Calculation[0]?.totalAmount+first;
         }
         else{
           alert("Adhoc Exemption cannot be greater than the estimated tax for the given property");
         }
    AssessmentData.additionalDetails={
      "adhocPenalty":first,
      "adhocPenaltyReason":selectedPenalityReason.value,
      "adhocExemption":second,
      "adhocExemptionReason":selectedRebateReason.value,
    }
  }
  setSelectedPenalityReason(null);
  setSelectedRebateReason(null);
  showPopUp(false);
}
const Penality_menu=[
  {
    title:"Pending_dues_from_earlier",
    value:"Pending dues from earlier",
  },
  {
    title:"Miscalculation_of_earlier_Assessment",
    value:"Miscalculation of earlier Assessment",
  },
  {
    title:"One_time_penality",
    value:"One time penality",
  },
  {
    title:"Others",
    value:"Others",
  },
  ]
  const Rebate_menu=[
    {
      title:"Advanced_Paid_By_Citizen_Earlier",
      value:"Advanced Paid By Citizen Earlier",
    },
    {
      title:"Rebate_provided_by_commissioner/EO",
      value:"Rebate provided by commissioner/EO",
    },
    {
      title:"Additional_amount_charged_from_the_citizen",
      value:"Additional amount charged from the citizen",
    },
    {
      title:"Others",
      value:"Others",
    },
    ]
  const selectPenalityReason=(reason)=>{
    setSelectedPenalityReason(reason);
  }
  const selectRebateReason=(reason)=>{
    setSelectedRebateReason(reason);
  }
const Add_Rebate_Penality=()=>{
  return (
    <Modal
          headerBarMain={<Heading label="Add Rebate/Penality"/>}
          headerBarEnd={<CloseBtn onClick={()=>showPopUp(false)}/>}
          actionCancelLabel="Cancel"
          actionCancelOnSubmit={()=>showPopUp(false)}
          actionSaveLabel="Add"
          actionSaveOnSubmit={()=>(change())}
          hideSubmit={false}
          >
  {
      <div>
        <Card>
        <CardSectionHeader>{t("Adhoc_Penality")}</CardSectionHeader>
            <CardLabel>
            {t("Tax_Heads")}
            </CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <Dropdown
                 isMandatory
                 option={Penality_menu}
                 optionKey="title"
                 select={selectPenalityReason}
                 selected={selectedPenalityReason}
                 />
                </div>
              </div>
            </div>      
            <CardLabel>{t("Head_Amount")}</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <input type="number" className="employee-card-input false focus-visible undefined" ref={first_temp}/>
                </div>
              </div>
            </div>                    
        </Card>
        <Card>
        <CardSectionHeader>{t("Adhoc_Rebate")}</CardSectionHeader>
            <CardLabel>{t("Tax_Heads")}</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <Dropdown
                 isMandatory
                 option={Rebate_menu}
                 optionKey="title"
                 select={selectRebateReason}
                 selected={selectedRebateReason}
                 />
                </div>
              </div>
            </div>    
            <CardLabel>{t("Head_Amount")}</CardLabel>
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
}
  return (
    <div>
      <Header>{t("PT_Tax_Assessment")}</Header>
      <ApplicationDetailsTemplate
        applicationDetails={
          {applicationDetails:[
            {
              title: "PT_ESTIMATE_DETAILS_HEADER",
              values: [ 
                {
                  title: "PT_PROPERTY_PTUID",
                  value: propertyId,  
                },
                // changed from here
                {
                  title: "PT_Address",
                  value: address_to_display,
                },
                {
                  title: "ES_PT_TITLE_BILLING_PERIOD",
                  value: location?.state?.Assessment?.financialYear,
                },
                {
                  title:"PT_Billing_Due_Date",
                  value:date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear(),
                },
              ],
              additionalDetails: {
                taxHeadEstimatesCalculation: ptCalculationEstimateData?.Calculation[0],
              },
              },
              {
                belowComponent:()=><LinkLabel onClick={()=>{showPopUp(true)}} style={{color:"red"}}>{t("Add_rebate_or_penality")}</LinkLabel>
              },
                  requiredDetails,
            {
              belowComponent:()=>{
                return (
                  <div style={{marginTop:"19px"}}>
                  <CardSubHeader style={{marginBottom:"8px",color:"rgb(80,90,95)",fontSize:"24px"}}>
                  {t("Calculation Details")}
                    <CardSectionHeader style={{marginBottom:"16px",color:"rgb(80,90,95)",fontSize:"16px",marginTop:"revert"}}>{t("Calculation_Logic")}
                    <br/>
                    {t("Calc_logic")}
                    </CardSectionHeader>
                  </CardSubHeader>
                    <div className="employee-data-table" style={{position:"relative",padding:"8px"}}>
                    <div style={{position:"absolute",maxWidth:"640px",border:"1px solid rgb(214,213,212)",inset:"0px",width:"auto"}}/>
                    <div className="row border-none"><h2>{t("Applicable_Charge_Slabs")}</h2></div>
                    <div className="row border-none"><h2>{t("Ground_Floor_Unit-1")}</h2>
                    <div className="value">{t("2_Sq/yards")}</div>
                    </div>
                   </div>
                  </div>
                  
                )
              }
            }
          ]}
        }
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
        showTimeline={false}
      />
      {popup && (<Add_Rebate_Penality/>)}
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