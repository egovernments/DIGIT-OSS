import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
  getTextField ,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import {showHideAddHospitalDialog } from "./newRegistration";
import {prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {patterns} from "../utils/constants";

const addHospitalDataToDropDown = (state,dispatch) =>{
  
  let newHospitalName = get(state.screenConfiguration.preparedFinalObject,"bnd.newHospitalName");
  let existingHospitals = get(state.screenConfiguration.preparedFinalObject,"bnd.allHospitals") || [];

  if(!newHospitalName || !(new RegExp(patterns["hospitalName"])).test(newHospitalName))
  {
    dispatch(toggleSnackbar(
      true,
      {
        labelName: "Invalid value",
        labelKey: "CORE_COMMON_INVALID"
      },
      "info"
    ));
    return;
  }

  let hospitalExists = false;
  for(var hospital in existingHospitals)
  {
    if(existingHospitals[hospital].name == newHospitalName)
    {
      dispatch(toggleSnackbar(
        true,
        {
          labelName: "Please fill the required fields.",
          labelKey: "BND_HOSPITAL_NAME_EXISTS"
        },
        "info"
      ));
      hospitalExists = true;
      break;
    }
  }
  
  if(!hospitalExists){
    existingHospitals.unshift({code:newHospitalName,name:newHospitalName});
    dispatch(toggleSnackbar(
      true,
      {
        labelName: "Please fill the required fields.",
        labelKey: "BND_NEW_HOSPITAL_ADDED"
      },
      "success"
    ));
    dispatch(prepareFinalObject("bnd.allHospitals", existingHospitals));
  }
}

export const addHospitalDialog = getCommonContainer({
  header: getCommonHeader({
      labelName: "Confirm Add",
      labelKey: "BND_CONFIRM_ADD"
    },
    {
      style: {
        fontSize: "20px"
      }
    }),
  confirmationContents: getCommonContainer({
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "90%",
          textAlign: "center"
        }
      },
      children: {

          hospitalName: getTextField({
            label: {
              labelName: "",
              labelKey: "BND_HOSPITALNAME_LABEL"
            },
            placeholder: {
              labelName: "",
              labelKey: "BND_HOSPITALNAME_LABEL"
            },
            required:false,
            visible: true,
            jsonPath: `bnd.newHospitalName`,
            gridDefination: {
              xs: 12,
              sm: 12
            }
          }),

        yesButton: {
          componentPath: "Button",
          props: {
            variant: "contained",
            color: "primary",
            style: {
              minWidth: "100px",
              height: "20px",
              marginRight: "20px",
              marginTop: "16px"
            }
          },
          children: {
            previousButtonLabel: getLabel({
              labelName: "YES",
              labelKey: "BND_DOWNLOAD_PROCEED"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              addHospitalDataToDropDown(state,dispatch);
              showHideAddHospitalDialog(state, dispatch)
            }
          }
        },
        cancelButton: {
          componentPath: "Button",
          props: {
            variant: "outlined",
            color: "primary",
            style: {
              minWidth: "100px",
              height: "20px",
              marginRight: "4px",
              marginTop: "16px"
            }
          },
          children: {
            previousButtonLabel: getLabel({
              labelName: "NO",
              labelKey: "CORE_COMMON_CANCEL"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              showHideAddHospitalDialog(state, dispatch)
            }
          }
        }
      }
    }
  })
});
