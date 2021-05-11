import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
  getTextField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import {cancelChallan, showHideConfirmationPopup } from "./search-preview";
export const confirmationDialog = getCommonContainer({
  
  confirmationContents: getCommonContainer({
    header: getCommonHeader({
      labelName: "Do you really want to cancel challan",
      labelKey: "CANCEL_CHALLAN_HEADER"
    },
    {
      style: {
        fontSize: "20px"
      }
    }
    ),
    commentsField: getTextField({
      label: {
        labelName: "Enter Comments",
        labelKey: "CANCEL_COMMENT_LABEL"
      },
      placeholder: {
        labelName: "Enter Comments",
        labelKey: "CANCEL_COMMENT_LABEL"
      },
      gridDefination: {
        xs: 12,
        sm: 12
      },
      props: {
        style: {
          width: "90%"
        }
      },
      pattern: getPattern("cancelChallan"),
      required: true,
      visible: true,
      jsonPath: "Challan.additionalDetail.cancellComment"
    }),
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
              width: "40px",
              height: "20px",
              marginRight: "20px",
              marginTop: "16px"
            }
          },
          children: {
            previousButtonLabel: getLabel({
              labelName: "YES",
              labelKey: "CANCEL_YES"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              let cancelComment = get(state.screenConfiguration.preparedFinalObject , "Challan.additionalDetail.cancellComment");
              if(cancelComment && cancelComment.length<=100)
              {
                cancelChallan(state, dispatch, "CANCELLED");
              }
              else
              {
                dispatch(toggleSnackbar(true,{labelName: "Comment should be less then 100 characters",
                labelKey: "ERR_CANCEL_CHALLAN_INVALID_INPUT"}, "error"));
              }
            }
          }
        },
        cancelButton: {
          componentPath: "Button",
          props: {
            variant: "outlined",
            color: "primary",
            style: {
              width: "40px",
              height: "20px",
              marginRight: "4px",
              marginTop: "16px"
            }
          },
          children: {
            previousButtonLabel: getLabel({
              labelName: "NO",
              labelKey: "CANCEL_NO"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              showHideConfirmationPopup(state, dispatch, "newCollection")
            }
          }
        }
      }
    }
  })
});
