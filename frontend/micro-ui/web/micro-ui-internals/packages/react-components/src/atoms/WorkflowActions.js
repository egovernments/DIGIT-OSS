import React, { useEffect, useRef,useState } from "react";
import { useTranslation } from "react-i18next";
import SubmitBar from "./SubmitBar";
import ActionBar from "./ActionBar";
import Menu from "./Menu";
import ActionModal from "./Modals";
import { Loader } from "./Loader";
import Toast from "./Toast";
import { useHistory } from "react-router-dom";
const WorkflowActions = ({ businessService, tenantId, applicationNo, forcedActionPrefix, ActionBarStyle = {}, MenuStyle = {}, applicationDetails, url, setStateChanged, moduleCode,editApplicationNumber,editCallback ,callback}) => {
  
  const history = useHistory()
  const { estimateNumber } = Digit.Hooks.useQueryParams();
  applicationNo = applicationNo ? applicationNo : estimateNumber 

  const { mutate } = Digit.Hooks.useUpdateCustom(url)

  const [displayMenu,setDisplayMenu] = useState(false)
  const [showModal,setShowModal] = useState(false)
  const [selectedAction,setSelectedAction] = useState(null)
  const [isEnableLoader, setIsEnableLoader] = useState(false);
  const [showToast,setShowToast] = useState(null)

  

  const { t } = useTranslation();
  let user = Digit.UserService.getUser();

  let workflowDetails = Digit.Hooks.useWorkflowDetailsV2(
    {
      tenantId: tenantId,
      id: applicationNo,
      moduleCode: businessService,
      config: {
        enabled: true,
        cacheTime: 0
      }
    }
  );

  

  const menuRef = useRef();

  const userRoles = user?.info?.roles?.map((e) => e.code);
  let isSingleButton = false;
  let isMenuBotton = false;
  let actions = workflowDetails?.data?.actionState?.nextActions?.filter((e) => {
    return userRoles.some((role) => e.roles?.includes(role)) || !e.roles;
  }) || workflowDetails?.data?.nextActions?.filter((e) => {
    return userRoles.some((role) => e.roles?.includes(role)) || !e.roles;
  });

  const closeMenu = () => {
    setDisplayMenu(false);
  }
  
  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null)
    }, 5000);
  }
 
  setTimeout(() => {
    setShowToast(null);
  }, 20000);
    
  
  
  Digit.Hooks.useClickOutside(menuRef, closeMenu, displayMenu);

  if (actions?.length > 0) {
    isMenuBotton = true;
    isSingleButton = false;
  }

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
    setShowToast({ warning:true,label:`WF_ACTION_CANCELLED`})
    closeToast()
  };

  const onActionSelect = (action) => {
    
    const bsContract = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("contract");
    const bsEstimate = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("estimate")
    const bsAttendance = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("muster roll")
    const bsPurchaseBill = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("works.purchase")
    
    
    setDisplayMenu(false)
    setSelectedAction(action)

    //here check if actin is edit then do a history.push acc to the businessServ and action
    //send appropriate states over
    
    if(bsEstimate === businessService && action?.action === "RE-SUBMIT"){
        history.push(`/${window?.contextPath}/employee/estimate/create-estimate?tenantId=${tenantId}&projectNumber=${editApplicationNumber}&estimateNumber=${applicationDetails?.estimateNumber}&isEdit=true`);
        return 
    }

    if(bsContract === businessService && action?.action === "EDIT"){
      history.push(`/${window?.contextPath}/employee/contracts/create-contract?tenantId=${tenantId}&workOrderNumber=${applicationNo}`);
      return 
  }
    if(bsAttendance === businessService && action?.action === "RE-SUBMIT"){
        editCallback()
        return 
    }

    if(bsPurchaseBill === businessService && action?.action==="RE-SUBMIT"){
      history.push(`/${window?.contextPath}/employee/expenditure/create-purchase-bill?tenantId=${tenantId}&billNumber=${editApplicationNumber}`);
      return 
    }
    //here we can add cases of toast messages,edit application and more...
    // the default result is setting the modal to show
    setShowModal(true)
    
  }

  const submitAction = (data,selectAction) => {
    setShowModal(false)
    setIsEnableLoader(true)
    const mutateObj = {...data}
    
    mutate(mutateObj,{
      onError:(error,variables)=>{
        setIsEnableLoader(false)
        //show error toast acc to selectAction
        setShowToast({ error: true, label: Digit.Utils.locale.getTransformedLocale(`WF_UPDATE_ERROR_${businessService}_${selectAction.action}`), isDleteBtn:true })
        
        callback?.onError?.();

        
        
      },
      onSuccess:(data,variables) => {
        setIsEnableLoader(false)
        //show success toast acc to selectAction
        setShowToast({ label: Digit.Utils.locale.getTransformedLocale(`WF_UPDATE_SUCCESS_${businessService}_${selectAction.action}`) })
        
        callback?.onSuccess?.();
        // to refetch updated workflowData and re-render timeline and actions
        workflowDetails.revalidate()

        
        //COMMENTING THIS FOR NOW BECAUSE DUE TO THIS TOAST IS NOT SHOWING SINCE THE WHOLE PARENT COMP RE-RENDERS
        // setStateChanged(`WF_UPDATE_SUCCESS_${selectAction.action}`)
      }
    })
  }

  //if workflowDetails are loading then a loader is displayed in workflowTimeline comp anyway
  if(isEnableLoader){
    return <Loader />
  }
  return (
    <React.Fragment>
      {!workflowDetails?.isLoading && isMenuBotton && !isSingleButton && (
        <ActionBar style={{ ...ActionBarStyle }}>
          {displayMenu && (workflowDetails?.data?.actionState?.nextActions || workflowDetails?.data?.nextActions) ? (
            <Menu
              localeKeyPrefix={forcedActionPrefix || Digit.Utils.locale.getTransformedLocale(`WF_${businessService?.toUpperCase()}_ACTION`)}
              options={actions}
              optionKey={"action"}
              t={t}
              onSelect={onActionSelect}
              style={MenuStyle}
            />
          ) : null}
          <SubmitBar ref={menuRef} label={t("WORKS_ACTIONS")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
      )}
      {!workflowDetails?.isLoading && !isMenuBotton && isSingleButton && (
        <ActionBar style={{ ...ActionBarStyle }}>
          <button
            style={{ color: "#FFFFFF", fontSize: "18px" }}
            className={"submit-bar"}
            name={actions?.[0]?.action}
            value={actions?.[0]?.action}
            onClick={(e) => { onActionSelect(actions?.[0] || {}) }}>
            {t( Digit.Utils.locale.getTransformedLocale(`${forcedActionPrefix || `WF_${businessService?.toUpperCase()}_ACTION`}_${actions?.[0]?.action}`))}
          </button>
        </ActionBar>
      )}

      {showModal && <ActionModal
        t={t}
        action={selectedAction}
        tenantId={tenantId}
        id={applicationNo}
        closeModal={closeModal}
        submitAction={submitAction}
        businessService={businessService}
        applicationDetails={applicationDetails}
        moduleCode={moduleCode}
      />}
      {showToast && <Toast
        error={showToast?.error}
        warning={t(showToast?.warning)}
        label={t(showToast?.label)}
        onClose={() => {
          setShowToast(null);
        }}
        isDleteBtn={showToast?.isDleteBtn}
      />}
    </React.Fragment>
  );
}

export default WorkflowActions