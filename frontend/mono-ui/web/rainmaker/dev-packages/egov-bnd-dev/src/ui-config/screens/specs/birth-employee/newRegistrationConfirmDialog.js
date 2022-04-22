import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import {showHideConfirmationPopup } from "./newRegistration";
import {postData} from "./newRegistrationFooter"; 


export const confirmationDialog = getCommonContainer({
  header: getCommonHeader({
      labelName: "Confirm Download",
      labelKey: "BND_CONFIRM_SUBMIT"
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
              postData(state,dispatch);
              showHideConfirmationPopup(state, dispatch, "newRegistration")
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
              showHideConfirmationPopup(state, dispatch, "newRegistration")
            }
          }
        }
      }
    }
  }, { className: "confirm-bnd-popup" })
}, { className: "confirm-bnd-popup" });
