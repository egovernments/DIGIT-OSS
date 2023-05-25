import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { convertDateToEpoch } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { ifUserRoleExists } from "../../utils";
import { validateFields } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import cloneDeep from "lodash/cloneDeep";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import "../../../../../index.css";

import { confirmationDialog } from "../confirmationDialog";
const tenantId = getTenantId();
export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("EMPLOYEE") ? "/uc/pay" : "/inbox";
  return redirectionURL;
};

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};
//to show up confirmation dialog on click of cancel button
export const showHideConfirmationPopup = (state, dispatch, screenKey) => {
   let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.div.children.newCollectionFooter.children.cancelConfirmationDialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.div.children.newCollectionFooter.children.cancelConfirmationDialog", "props.open", !toggle)
  );
};
export const newCollectionFooter = getCommonApplyFooter({
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      className:"gen-challan-btn",
    },
    children: {
      generateChallanButtonLabel: getLabel({
        labelName: "Generate Challan",
        labelKey: "UC_ECHALLAN"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {      
          processChallan(state, dispatch,"CREATE");
      }
    },
    visible: false
  },
  updateChallan: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      className: "gen-challan-btn", 
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Update RECEIPT",
        labelKey: "UC_UPDATE_CHALLAN"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {      
        processChallan(state, dispatch,"UPDATE");
      }
    },
    visible: false
  } 
});

const convertDateFieldToEpoch = (finalObj, jsonPath) => {
  const dateConvertedToEpoch = convertDateToEpoch(get(finalObj, jsonPath));
  set(finalObj, jsonPath, dateConvertedToEpoch);
};

const allDateToEpoch = (finalObj, jsonPaths) => {
  jsonPaths.forEach(jsonPath => {
    if (get(finalObj, jsonPath)) {
      convertDateFieldToEpoch(finalObj, jsonPath);
    }
  });
};


export const processChallan = async (state, dispatch,applicationStatus) => {
  let isFormValid = true;
  const ucConsumerValid = validateFields(
    "components.div.children.newCollectionConsumerDetailsCard.children.cardContent.children.ucConsumerContainer.children",
    state,
    dispatch,
    "newCollection"
  );  
  const ucServiceDetailValid = validateFields(
    "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "newCollection"
  );
 
  if (
    !ucConsumerValid ||
    !ucServiceDetailValid 
  ) {
    isFormValid = false;
  }

  if (isFormValid) {
    try {
      dispatch(toggleSpinner());
      let objToPush =prepareObj(state,dispatch);
      switch (applicationStatus) {
        case "CREATE": 
          await createChallan(state, dispatch,objToPush);       
          break;
        case "CANCELLED":
          objToPush.applicationStatus=applicationStatus;
          await cancelChallan(state, dispatch,objToPush);  
          break;
        case "UPDATE":
          await updateChallan(state, dispatch,objToPush);  
          break;
        
      }
      dispatch(toggleSpinner());
    } catch (error) {
      dispatch(toggleSpinner());
    }
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill the required fields.",
          labelKey: "UC_REQUIRED_FIELDS_ERROR_MSG"
        },
        "warning"
      )
    );
  }
};
 
const prepareObj =(state,dispatch) =>{
  dispatch(prepareFinalObject("ReceiptTemp[0].Bill", []));
  let eChallans =cloneDeep (get(state.screenConfiguration.preparedFinalObject, "Challan"));  
  eChallans[0].amount &&
    eChallans[0].amount.forEach(item => {
      if (!item.amount) {
        item.amount = 0;
      }
    });
    set(eChallans[0],"taxPeriodFrom", convertDateToEpoch(eChallans[0].taxPeriodFrom));
    set(eChallans[0], "taxPeriodTo", convertDateToEpoch(eChallans[0].taxPeriodTo));
    // set(eChallans[0], "payer.mobileNumber", eChallans[0].citizen.mobileNumber);
    // set(eChallans[0], "payer.name",  eChallans[0].citizen.name);

    //Check if tax period fall between the tax periods coming from MDMS -- Not required as of now
    const taxPeriodValid = isTaxPeriodValid(dispatch, eChallans[0], state);
    if (taxPeriodValid) {
      return eChallans[0];
    }
    return null;
  
};
 
const postUpdate=async(state,dispatch,payload,operation) =>{
  const consumerCode = get(payload, "challans[0].challanNo");
  const businessService = get(payload, "challans[0].businessService");
  set(payload, "challans[0].mobileNumber", get(payload, "challans[0].citizen.mobileNumber"));
  set(payload, "challans[0].consumerName", get(payload, "challans[0].citizen.name"));
  //set(payload,"challans[0].businessService",businessService.split(".")[0]);
  dispatch(prepareFinalObject("Challan", payload.challans[0]));         
  let tenant=getTenantId(); 
  await generateBill(consumerCode, tenant, businessService,operation, dispatch);
}

const createChallan = async(state,dispatch,challan) =>{
  var operation="challan";
  try{
    if(challan!=null){
      const payload = await httpRequest("post", "/echallan-services/eChallan/v1/_create", "", [], {
        Challan: challan
      });
      if (payload.challans.length > 0) {
        await postUpdate(state,dispatch,payload,operation);
      } else {
        console.info("some error  happened while generating challan");
        dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=failure`));
      }
    }
  }catch(e){
    console.info("error in challan creation==",e);
    if(e.message){
      dispatch(
        toggleSnackbar(
          true,
          { labelName: e.message },
          "error"
        )
      );
    }
    else{
      //Case some internal error happened, and not handled, then go to ackmt page
      dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=failure`));
    }
   
    
  }
}

const updateChallan = async(state,dispatch,challan) =>{
  var operation="update";
  try{
    if(challan!=null){
      const payload = await httpRequest("post", "/echallan-services/eChallan/v1/_update", "", [], {
        Challan: challan
      });
      if (payload.challans.length > 0) {
        await postUpdate(state,dispatch,payload,operation);
      } else {
        console.info("some error  happened while updating challan");
        dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=failure`));
      }
    }
  }catch(e){
    dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=failure`));
  }
}

const cancelChallan = async(state,dispatch,challan) =>{
  var operation="cancel";
  try{
    if(challan!=null){
      const payload = await httpRequest("post", "/echallan-services/eChallan/v1/_update", "", [], {
        Challan: challan
      });
      if (payload.challans.length > 0) {
        const consumerCode = get(payload, "challans[0].challanNo");
        const businessService = get(payload, "challans[0].businessService");
        dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=success&tenantId=${getTenantId()}&serviceCategory=${businessService}&challanNumber=${consumerCode}`));
      } else {
        console.info("some error  happened while cancelling challan");
        dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=failure`));
      }
    }
  }catch(e){
    dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=failure`));
  }
}
 

const generateBill = async (
  consumerCode,
  tenantId,
  businessService,
  operation,
  dispatch
  
) => {
  try {
    const payload = await httpRequest(
      "post",
      `/billing-service/bill/v2/_fetchbill?consumerCode=${consumerCode}&businessService=${businessService}&tenantId=${tenantId}`,
       "",
      [],
      {}
    );
    if (payload && payload.Bill[0]) {
      dispatch(prepareFinalObject("ReceiptTemp[0].Bill", payload.Bill));                
      dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=success&tenantId=${tenantId}&billNumber=${payload.Bill[0].billNumber}&serviceCategory=${businessService}&challanNumber=${consumerCode}`));
    }
    else{     
      dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=failure`));
    }
  } catch (e) {
    console.log(e);
    dispatch(setRoute(`/uc/acknowledgement?purpose=${operation}&status=failure`));
  }
};

const createEstimateData = billObject => {
  const billDetails = billObject && billObject.billDetails;
  let fees =
    billDetails &&
    billDetails[0].billAccountDetails &&
    billDetails[0].billAccountDetails.map(item => {
      return {
        name: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode },
        value: item.amount,
        info: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode }
      };
    });
  return fees;
};

const isTaxPeriodValid = (dispatch, challan, state) => {
  const taxPeriods = get(
    state.screenConfiguration,
    "preparedFinalObject.applyScreenMdmsData.BillingService.TaxPeriod",
    []
  );
  const selectedFrom = new Date(challan.taxPeriodFrom);
  const selectedTo = new Date(challan.taxPeriodTo);
  if (selectedFrom <= selectedTo) {
    return true;
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please select the right tax period",
          labelKey: "UC_NEW_COLLECTION_WRONG_TAX_PERIOD_MSG"
        },
        "warning"
      )
    );
    return false;
  }
 
};
