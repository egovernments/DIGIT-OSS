import React, { useEffect, useState,useRef } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";

import { useParams, useLocation, useHistory } from "react-router-dom";
import { ActionBar, Header, Loader, SubmitBar,Card,CardSubHeader,CardSectionHeader,LinkLabel, CardLabel} from "@egovernments/digit-ui-react-components";
import { useQueryClient } from "react-query";
import _, { update } from "lodash";
import { Modal } from "@egovernments/digit-ui-react-components";



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
  const [rebatepenality,setRebateOrPenality]=useState('');
  
  
  const [popup,showPopUp]=useState(false);

  const first_temp=useRef();
  debugger
  const second_temp=useRef();
  const third_temp=useRef();
  const fourth_temp=useRef();

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

  // const requiredDetails=applicationDetails?.applicationDetails?.filter((e)=>e.title=="PT_ASSESMENT_INFO_SUB_HEADER");
 
  
  const closeToast = () => {
    setShowToast(null);
  };

  const handleAssessment = () => {
    if (!queryClient.getQueryData(["PT_ASSESSMENT", propertyId, location?.state?.Assessment?.financialYear])) {
      assessmentMutate(
        { Assessment: AssessmentData },
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

console.log(ptCalculationEstimateData?.Calculation[0]?.taxHeadEstimates[6]);

function change(){
  if(first_temp>0){
    if(second_temp>0){
      ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]={
        "taxHeadCode": "PT_TIME_PENALTY",
        "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]?.estimateAmount+(document.getElementById("first").value)*(document.getElementById("second").value),
        "category": "TAX"
    }
       }
  }
  if(third_temp>0){
    if(fourth_temp>0){
      ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]={
        "taxHeadCode": "PT_TIME_REBATE",
        "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]?.estimateAmount+(document.getElementById("third").value)*(document.getElementById("fourth").value),
        "category": "TAX"
    }
       }
  }
  showPopUp(false);
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
          isDisabled={false}
          >
  {
      <div>
        <Card>
          <CardSectionHeader>Adhoc Penality</CardSectionHeader>
            <CardLabel>
              Tax Heads
            </CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <input type="number" className="employee-card-input focus-visible" ref={first_temp} id="first"/>
                </div>
              </div>
            </div>      
            <CardLabel>
              Head Amount
            </CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <input type="number" className="employee-card-input false focus-visible undefined" ref={second_temp} id="second"/>
                </div>
              </div>
            </div>                    
        </Card>
        <Card>
          <CardSectionHeader>Adhoc Rebate</CardSectionHeader>
            <CardLabel>Tax Heads</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <input type="number" className="employee-card-input false focus-visible undefined" ref={third_temp} id="third"/>
                </div>
              </div>
            </div>    
            <CardLabel>Head Amount</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <input type="number" className="employee-card-input false focus-visible undefined" ref={fourth_temp} id="fourth"/>
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
      {/* <Header>{t("PT_ASSESS_PROPERTY")}</Header> */}
      <Header>{t(PT_Tax_Assessment)}</Header>
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
                belowComponent:()=><LinkLabel onClick={()=>{showPopUp(true)}} style={{color:"red"}}>Add Rebate/Penality</LinkLabel>
              },
                {
                  ...filtered_details,
                },
            {
              belowComponent:()=>{
                return (
                  <div style={{marginTop:"19px"}}>
                  <Heading>Calculation Details</Heading>
                  <CardSubHeader style={{marginBottom:"8px",color:"rgb(80,90,95)",fontSize:"24px"}}>
                    <CardSectionHeader style={{marginBottom:"16px",color:"rgb(80,90,95)",fontSize:"16px",marginTop:"revert"}}>Calculation Logic
                    <br/>
                    Property Tax = Built up area on GF * Rates per unit of GF - built up empty land on GF * Rate per unit of GF - empty land 𝝨(built-up on nth floor*Rate per unit of nth floor-built up)
                    </CardSectionHeader>
                  </CardSubHeader>
                    <div className="employee-data-table" style={{position:"relative",padding:"8px"}}>
                    <div style={{position:"absolute",maxWidth:"640px",border:"1px solid rgb(214,213,212)",inset:"0px",width:"auto"}}/>
                    <div className="row border-none"><h2>Applicable Charge Slabs</h2></div>
                    <div className="row border-none"><h2>Ground Floor Unit-1</h2>
                    <div className="value">2 Sq/yards</div>
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
