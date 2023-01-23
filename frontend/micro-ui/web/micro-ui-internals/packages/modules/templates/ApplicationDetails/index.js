import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { format } from "date-fns";

import { Loader } from "@egovernments/digit-ui-react-components";

import ActionModal from "./Modal";

import { useHistory, useParams } from "react-router-dom";
import ApplicationDetailsContent from "./components/ApplicationDetailsContent";
import ApplicationDetailsToast from "./components/ApplicationDetailsToast";
import ApplicationDetailsActionBar from "./components/ApplicationDetailsActionBar";
import ApplicationDetailsWarningPopup from "./components/ApplicationDetailsWarningPopup";

const ApplicationDetails = (props) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const { t } = useTranslation();
  const history = useHistory();
  let { id: applicationNumber } = useParams();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEnableLoader, setIsEnableLoader] = useState(false);
  const [isWarningPop, setWarningPopUp] = useState(false);
  const [modify, setModify] = useState(false);
  const [saveAttendanceState, setSaveAttendanceState] = useState({ displaySave : false, updatePayload: []})

  const {
    applicationDetails,
    showToast,
    setShowToast,
    isLoading,
    isDataLoading,
    applicationData,
    mutate,
    nocMutation,
    workflowDetails,
    businessService,
    closeToast,
    moduleCode,
    timelineStatusPrefix,
    forcedActionPrefix,
    statusAttribute,
    ActionBarStyle,
    MenuStyle,
    paymentsList,
    showTimeLine = true,
    oldValue,
    isInfoLabel = false,
    clearDataDetails,
    noBoxShadow,
    sectionHeadStyle,
    showActionBar = true
  } = props;
  
  useEffect(() => {
    if (showToast) {
      workflowDetails.revalidate();
    }
  }, [showToast]);

  function onActionSelect(action) {
    if (action) {
      if(action?.isToast){
        setShowToast({ key: "error", error: { message: action?.toastMessage } });
        setTimeout(closeToast, 5000);
      }
      else if (action?.isWarningPopUp) {
        setWarningPopUp(true);
      } else if (action?.redirectionUrll) {
        //here do the loi edit upon rejection
        if (action?.redirectionUrll?.action === "EDIT_LOI_APPLICATION") {
          history.push(`${action?.redirectionUrll?.pathname}`, { data: action?.redirectionUrll?.state });
        }
        if (action?.redirectionUrll?.action === "EDIT_ESTIMATE_APPLICATION") {
          history.push(`${action?.redirectionUrll?.pathname}`,{ data: action?.redirectionUrll?.state });
        }
        
      } else if (!action?.redirectionUrl) {
        if(action?.action === 'EDIT') setModify(true)
        else setShowModal(true);
      } else {
        history.push({
          pathname: action.redirectionUrl?.pathname,
          state: { ...action.redirectionUrl?.state },
        });
      }
    }
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  const queryClient = useQueryClient();

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  const closeWarningPopup = () => {
    setWarningPopUp(false);
  };

  const getResponseHeader = (action) => {

    if(action?.includes("CHECK")){
      return t("WORKS_LOI_RESPONSE_FORWARD_HEADER")
    } else if (action?.includes("APPROVE")){
     return  t("WORKS_LOI_RESPONSE_APPROVE_HEADER")
    }else if(action?.includes("REJECT")){
      return t("WORKS_LOI_RESPONSE_REJECT_HEADER")
    }
  }

  const getResponseMessage = (action,updatedLOI) => {
  
    if (action?.includes("CHECK")) {
      return t("WORKS_LOI_RESPONSE_MESSAGE_CHECK", { loiNumber: updatedLOI?.letterOfIndentNumber,name:"Nipun",designation:"SE" })
    } else if (action?.includes("APPROVE")) {
      return t("WORKS_LOI_RESPONSE_MESSAGE_APPROVE", { loiNumber: updatedLOI?.letterOfIndentNumber })
    } else if (action?.includes("REJECT")) {
      return t("WORKS_LOI_RESPONSE_MESSAGE_REJECT", { loiNumber: updatedLOI?.letterOfIndentNumber })
    }
  }

  const getEstimateResponseHeader = (action) => {

    if(action?.includes("CHECK")){
      return t("WORKS_ESTIMATE_RESPONSE_FORWARD_HEADER")
    } else if (action?.includes("TECHNICALSANCATION")){
     return  t("WORKS_ESTIMATE_RESPONSE_FORWARD_HEADER")
    }else if (action?.includes("ADMINSANCTION")){
      return  t("WORKS_ESTIMATE_RESPONSE_APPROVE_HEADER")
    }else if(action?.includes("REJECT")){
      return t("WORKS_ESTIMATE_RESPONSE_REJECT_HEADER")
    }
  }

  const getEstimateResponseMessage = (action,updatedEstimate) => {
  
    if (action?.includes("CHECK")) {
      return t("WORKS_ESTIMATE_RESPONSE_MESSAGE_CHECK", { estimateNumber: updatedEstimate?.estimateNumber,Name:"Super",Designation:"SE",Department:"Health" })
    } else if (action?.includes("TECHNICALSANCATION")) {
      return t("WORKS_ESTIMATE_RESPONSE_MESSAGE_CHECK", { estimateNumber: updatedEstimate?.estimateNumber,Name:"Super",Designation:"SE",Department:"Health" })
    } else if (action?.includes("ADMINSANCTION")) {
      return t("WORKS_ESTIMATE_RESPONSE_MESSAGE_APPROVE", { estimateNumber: updatedEstimate?.estimateNumber })
    } else if (action?.includes("REJECT")) {
      return t("WORKS_ESTIMATE_RESPONSE_MESSAGE_REJECT", { estimateNumber: updatedEstimate?.estimateNumber })
    }
  }

  const getAttendanceResponseHeaderAndMessage = (action) => {
    let response = {}
    if (action?.includes("VERIFY")) {
      response.header = t("ATM_ATTENDANCE_VERIFIED")
      response.message = t("ATM_ATTENDANCE_VERIFIED_SUCCESS")
    } else if (action?.includes("REJECT")) {
      response.header = t("ATM_ATTENDANCE_REJECTED")
      response.message = t("ATM_ATTENDANCE_REJECTED_SUCCESS")
    } else if (action?.includes("APPROVE")) {
      response.header = t("ATM_ATTENDANCE_APPROVED")
      response.message = t("ATM_ATTENDANCE_APPROVED_SUCCESS")
    } 
    return response
  }

  const submitAction = async (data, nocData = false, isOBPS = {}) => {
    const performedAction = data?.workflow?.action
    setIsEnableLoader(true);
    if (mutate) {
      setIsEnableLoader(true);
      mutate(data, {
        onError: (error, variables) => {
          setIsEnableLoader(false);
          setShowToast({ key: "error", error });
          setTimeout(closeToast, 5000);
        },
        onSuccess: (data, variables) => {
          setIsEnableLoader(false);
          //just history.push to the response component from here and show relevant details
          if(data?.letterOfIndents?.[0]){
            const updatedLOI = data?.letterOfIndents?.[0]
            const state = {
              header:getResponseHeader(performedAction,updatedLOI),
              id: updatedLOI?.letterOfIndentNumber,
              info: t("WORKS_LOI_ID"),
              message: getResponseMessage(performedAction,updatedLOI),
              links: [
                {
                  name: t("WORKS_CREATE_NEW_LOI"),
                  redirectUrl: `/${window.contextPath}/employee/works/create-loi`,
                  code: "",
                  svg: "CreateEstimateIcon",
                  isVisible:false,
                  type:"add"
                },
                {
                  name: t("WORKS_GOTO_LOI_INBOX"),
                  redirectUrl: `/${window.contextPath}/employee/works/LOIInbox`,
                  code: "",
                  svg: "CreateEstimateIcon",
                  isVisible:true,
                  type:"inbox"
                },
              ],
              responseData:data,
              requestData:variables
            }
            history.push(`/${window.contextPath}/employee/works/response`, state)
          }
          if(data?.estimates?.[0]){
            const updatedEstimate = data?.estimates?.[0]
            const state = {
              header:getEstimateResponseHeader(performedAction,updatedEstimate),
              id: updatedEstimate?.estimateNumber,
              info: t("WORKS_ESTIMATE_ID"),
              message: getEstimateResponseMessage(performedAction,updatedEstimate),
              links: [
                {
                  name: t("WORKS_CREATE_ESTIMATE"),
                  redirectUrl: `/${window.contextPath}/employee/works/create-estimate`,
                  code: "",
                  svg: "CreateEstimateIcon",
                  isVisible:false,
                  type:"add"
                },
                {
                  name: t("WORKS_GOTO_ESTIMATE_INBOX"),
                  redirectUrl: `/${window.contextPath}/employee/works/inbox`,
                  code: "",
                  svg: "RefreshIcon",
                  isVisible:true,
                  type:"inbox"
                },
              ],
              responseData:data,
              requestData:variables
            }
            history.push(`/${window.contextPath}/employee/works/response`, state)
          }
          if (isOBPS?.bpa) {
            data.selectedAction = selectedAction;
            history.replace(`/${window?.contextPath}/employee/obps/response`, { data: data });
          }
          if (isOBPS?.isStakeholder) {
            data.selectedAction = selectedAction;
            history.push(`/${window?.contextPath}/employee/obps/stakeholder-response`, { data: data });
          }
          if (isOBPS?.isNoc) {
            history.push(`/${window?.contextPath}/employee/noc/response`, { data: data });
          }
          if (data?.Amendments?.length > 0 ){
            //RAIN-6981 instead just show a toast here with appropriate message
          //show toast here and return 
            //history.push("/${window?.contextPath}/employee/ws/response-bill-amend", { status: true, state: data?.Amendments?.[0] })
            
            if(variables?.AmendmentUpdate?.workflow?.action.includes("SEND_BACK")){
              setShowToast({ key: "success", label: t("ES_MODIFYSWCONNECTION_SEND_BACK_UPDATE_SUCCESS")})
            } else if (variables?.AmendmentUpdate?.workflow?.action.includes("RE-SUBMIT")){
              setShowToast({ key: "success", label: t("ES_MODIFYSWCONNECTION_RE_SUBMIT_UPDATE_SUCCESS") })
            } else if (variables?.AmendmentUpdate?.workflow?.action.includes("APPROVE")){
              setShowToast({ key: "success", label: t("ES_MODIFYSWCONNECTION_APPROVE_UPDATE_SUCCESS") })
            }
            else if (variables?.AmendmentUpdate?.workflow?.action.includes("REJECT")){
              setShowToast({ key: "success", label: t("ES_MODIFYWSCONNECTION_REJECT_UPDATE_SUCCESS") })
            }            
            return
          }
          if(data?.musterRolls?.[0]) {
            const musterRoll = data?.musterRolls?.[0]
            const response = getAttendanceResponseHeaderAndMessage(performedAction)
            const state = {
              header: response?.header,
              message: response?.message,
              info: t("ATM_REGISTER_ID_WEEK"),
              id: `${musterRoll.registerId} | ${format(new Date(musterRoll.startDate), "dd/MM/yyyy")} - ${format(new Date(musterRoll.endDate), "dd/MM/yyyy")}`,
            }
            history.push(`/${window.contextPath}/employee/attendencemgmt/response`, state)
          }
          setShowToast({ key: "success", action: selectedAction });
          clearDataDetails && setTimeout(clearDataDetails, 3000);
          setTimeout(closeToast, 5000);
          queryClient.clear();
          queryClient.refetchQueries("APPLICATION_SEARCH");
          //push false status when reject
          
        },
      });
    }

    closeModal();
  };

  if (isLoading || isEnableLoader) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {!isLoading ? (
        <React.Fragment>
          <ApplicationDetailsContent
            applicationDetails={applicationDetails}
            workflowDetails={workflowDetails}
            isDataLoading={isDataLoading}
            applicationData={applicationData}
            businessService={businessService}
            timelineStatusPrefix={timelineStatusPrefix}
            statusAttribute={statusAttribute}
            paymentsList={paymentsList}
            showTimeLine={showTimeLine}
            oldValue={oldValue}
            isInfoLabel={isInfoLabel}
            noBoxShadow={noBoxShadow}
            sectionHeadStyle={sectionHeadStyle}
            modify={modify}
            setSaveAttendanceState={setSaveAttendanceState}
          />
          {showModal ? (
            <ActionModal
              t={t}
              action={selectedAction}
              tenantId={tenantId}
              state={state}
              id={applicationNumber}
              applicationDetails={applicationDetails}
              applicationData={applicationDetails?.applicationData}
              closeModal={closeModal}
              submitAction={submitAction}
              actionData={workflowDetails?.data?.timeline}
              businessService={businessService}
              workflowDetails={workflowDetails}
              moduleCode={moduleCode}
              saveAttendanceState={saveAttendanceState}
            />
          ) : null}
          {isWarningPop ? (
            <ApplicationDetailsWarningPopup
              action={selectedAction}
              workflowDetails={workflowDetails}
              businessService={businessService}
              isWarningPop={isWarningPop}
              closeWarningPopup={closeWarningPopup}
            />
          ) : null}
          <ApplicationDetailsToast t={t} showToast={showToast} closeToast={closeToast} businessService={businessService} />
          {showActionBar && <ApplicationDetailsActionBar
            workflowDetails={workflowDetails}
            displayMenu={displayMenu}
            onActionSelect={onActionSelect}
            setDisplayMenu={setDisplayMenu}
            businessService={businessService}
            forcedActionPrefix={forcedActionPrefix}
            ActionBarStyle={ActionBarStyle}
            MenuStyle={MenuStyle}
            saveAttendanceState={saveAttendanceState}
          />}
        </React.Fragment>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default ApplicationDetails;
