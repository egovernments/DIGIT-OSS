import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";

import { useParams, useLocation, useHistory } from "react-router-dom";
import { ActionBar, Header, Loader, SubmitBar,Card,CardSubHeader,CardSectionHeader,LinkLabel,PopUp,BackButton} from "@egovernments/digit-ui-react-components";
import { useQueryClient } from "react-query";
import _ from "lodash";

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
      // changed from here
      {
        title: "Property Address",
        value: applicationDetails.applicationData.address.doorNo+','+applicationDetails.applicationData.address.locality.area+','+applicationDetails.applicationData.address.locality.name+','+applicationDetails.applicationData.address.city,
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
  console.log(applicationDetails);
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

  if (ptCalculationEstimateLoading || assessmentLoading) {
    return <Loader />;
  }


let address_to_display=applicationDetails.applicationData.address;
if(address_to_display.doorNo){
    address_to_display=address_to_display.doorNo+','+address_to_display.locality.area+','+address_to_display.city;
}
else{
    address_to_display=address_to_display.locality.area+','+address_to_display.city;
}

// {applicationDetails:[
//   {
//     title: "PT_ESTIMATE_DETAILS_HEADER",
//     values: [ 
//       {
//         title: "PT_PROPERTY_PTUID",
//         value: propertyId,  
//       },
//       // changed from here
//       {
//         title: "PT_Address",
//         value: address_to_display,
//       },
//       {
//         title: "ES_PT_TITLE_BILLING_PERIOD",
//         value: location?.state?.Assessment?.financialYear,
//       },
//       {
//         title:"PT_Billing_Due_Date",
//         value:date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear(),
//       },
//     ],
//     additionalDetails: {
//       taxHeadEstimatesCalculation: ptCalculationEstimateData?.Calculation[0],
//     },
//     },
//     {
//       belowComponent:()=>{return (
//         <LinkLabel onClick={()=>{return (<PopUp>{<div className="popup-module">popup opened</div>}</PopUp>)}} style={{color:"red"}}>Add Rebate/Penality</LinkLabel>)}
//     },
//       ...requiredDetails,
//   {
//     belowComponent:()=>{
//       return (
      
//         <div style={{marginTop:"19px"}}>
//         <CardSubHeader style={{marginBottom:"8px",color:"rgb(80,90,95)",fontSize:"24px"}}>
//           Calculation Details
//           <CardSectionHeader style={{marginBottom:"16px",color:"rgb(80,90,95)",fontSize:"16px",marginTop:"revert"}}>Calculation Logic
//           <br/>
//           Property Tax = Built up area on GF * Rates per unit of GF - built up empty land on GF * Rate per unit of GF - empty land 𝝨(built-up on nth floor*Rate per unit of nth floor-built up)
//           </CardSectionHeader>
//         </CardSubHeader>
//           <div className="employee-data-table" style={{position:"relative",padding:"8px"}}>
//           <div style={{position:"absolute",maxWidth:"640px",border:"1px solid rgb(214,213,212)",inset:"0px",width:"auto"}}/>
//           <div className="row border-none"><h2>Applicable Charge Slabs</h2></div>
//           <div className="row border-none"><h2>Ground Floor Unit-1</h2>
//           <div className="value">2 Sq/yards</div>
//           </div>
//          </div>
//         </div>
        
//       )
//     }
//   }
// ]}



  return (
    <div>
      {/* <Header>{t("PT_ASSESS_PROPERTY")}</Header> */}
      <Header>PT_Tax_Assessment</Header>
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
                belowComponent:()=>{return (
                  <LinkLabel onClick={()=>{showPopUp((prev)=>!prev)}} style={{color:"red"}}>Add Rebate/Penality<br/>{popup && (
                    <PopUp>
                    {
                      <div className="popup-module">
                        <input type={"text"} ></input>
                        <input type={"text"}></input>
                      </div>
                    }
                  </PopUp>
                  )}</LinkLabel>)}
              },
                ...requiredDetails,
            {
              belowComponent:()=>{
                return (
                
                  <div style={{marginTop:"19px"}}>
                  <CardSubHeader style={{marginBottom:"8px",color:"rgb(80,90,95)",fontSize:"24px"}}>
                    Calculation Details
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
