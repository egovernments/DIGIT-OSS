import {
  prepareFinalObject,  handleScreenConfigurationFieldChange as handleField 
} from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {newRegistrationForm} from "./newRegistrationCard";
import {footer} from "./newRegistrationFooter";
import {confirmationDialog} from "./newRegistrationConfirmDialog";
import {addHospitalDialog} from "./addHospitalDialog";
import get from "lodash/get";
import {loadHospitals, loadFullCertDetails} from "../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { convertEpochToDateCustom} from "../utils";



export const showHideConfirmationPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["newRegistration"],
   "components.confirmationDialog.props.open",
   false
 );
 dispatch(
   handleField("newRegistration", "components.confirmationDialog", "props.open", !toggle)
 );
};

export const showHideAddHospitalDialog = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["newRegistration"],
   "components.hospitalDialog.props.open",
   false
 );
 dispatch(
   handleField("newRegistration", "components.hospitalDialog", "props.open", !toggle)
 );
};

const prepareEditScreenData = (action,state,dispatch,response) => {
  setTimeout(() => {     
    if(response.BirthCertificate[0].dateofbirth)
    {  
      dispatch(
        handleField("newRegistration", "components.div2.children.details.children.cardContent.children.childInfo.children.cardContent.children.infoOfChild.children.dob", "props.value", 
        convertEpochToDateCustom(response.BirthCertificate[0].dateofbirth)
      ));
    }
    if(response.BirthCertificate[0].dateofreport)
    {  
      dispatch(
        handleField("newRegistration", "components.div2.children.details.children.cardContent.children.registrationInfo.children.cardContent.children.registrationInfoCont.children.dateOfReporting", "props.value", 
        convertEpochToDateCustom(response.BirthCertificate[0].dateofreport)
      ));
    }
    if(response.BirthCertificate[0].hospitalname)
    {  
      dispatch(
        handleField("newRegistration", "components.div2.children.details.children.cardContent.children.registrationInfo.children.cardContent.children.registrationInfoCont.children.hospitalName", "props.value", 
        response.BirthCertificate[0].hospitalname
      ));
    }
  }, 1); 
}

const newRegistration = {
  uiFramework: "material-ui",
  name: "newRegistration",
  beforeInitScreen:(action, state, dispatch) => {
    
    let userAction = getQueryArg(window.location.href, "action");
    let id = getQueryArg(window.location.href, "certificateId");
    let module = getQueryArg(window.location.href, "module");
    loadHospitals(action, state, dispatch, "birth",getTenantId()).then((response)=>{

      if(response && response.hospitalDtls)
      {
        for (let hospital of response.hospitalDtls) {
          hospital.code = hospital.name;
          hospital.name = hospital.name;
        }
        dispatch(prepareFinalObject("bnd.allHospitals", response.hospitalDtls));
      }

      if(userAction=="EDIT" && id && module)
      {
        loadFullCertDetails(action,state,dispatch, {tenantId:getTenantId(), id:id, module:module}).then((response)=>{
          if (response && response.BirthCertificate && response.BirthCertificate.length>0) {
            dispatch(prepareFinalObject("bnd.birth.newRegistration", response.BirthCertificate[0]));
            prepareEditScreenData(action,state, dispatch,response);
          }
        });
      }
      else
      {
        dispatch(prepareFinalObject("bnd.birth.newRegistration", {"birthFatherInfo":{},"birthMotherInfo":{},"birthPresentaddr":{},"birthPermaddr":{}}));
      }

    })

    return action;
  },
  components: {
    div2:{
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
      },
      children: {
        details: newRegistrationForm
      },
      //visible: process.env.REACT_APP_NAME === "Employee" ? true: false
    },
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        details: footer
      },
    },
    confirmationDialog: {
      componentPath: "Dialog",
      props: {
        open: false,
        maxWidth: "sm",
        disableValidation: true
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style"
            }
            // style: { minHeight: "180px", minWidth: "365px" }
          },
          children: {
            popup: confirmationDialog
          }
        }
      }
    },
    hospitalDialog: {
      componentPath: "Dialog",
      props: {
        open: false,
        maxWidth: "sm",
        disableValidation: true
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style"
            }
            // style: { minHeight: "180px", minWidth: "365px" }
          },
          children: {
            popup: addHospitalDialog
          }
        }
      }
    }
  }
};


export default newRegistration;