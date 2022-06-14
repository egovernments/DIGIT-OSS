import {
  getCommonContainer, getCommonHeader, getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { showHideConfirmationPopup } from "./newRegistration";
import { postData } from "./newRegistrationFooter";

export const confirmationDialog = getCommonContainer(
  {
    closeButton: {
      componentPath: "Button",
      props: {
        style: {
          float: "right",
          color: "rgba(0, 0, 0, 0.60)",
        },
      },
      children: {
        previousButtonIcon: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "close",
          },
        },
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) =>
          showHideConfirmationPopup(state, dispatch, "newRegistration"),
      },
    },
    header: getCommonHeader(
      {
        labelName: "Confirm Download",
        labelKey: "BND_CONFIRM_SUBMIT",
      },
      {
        style: {
          fontSize: "20px",
        },
      }
    ),
    confirmationContents: getCommonContainer(
      {
        div: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            style: {
              width: "100%",
              textAlign: "center",
              display: "flex",
              flexDirection: "row-reverse",
            },
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
                  marginTop: "16px",
                  boxShadow: "none",
                },
              },
              children: {
                previousButtonLabel: getLabel({
                  labelName: "YES",
                  labelKey: "BND_DOWNLOAD_PROCEED",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  postData(state, dispatch);
                  showHideConfirmationPopup(state, dispatch, "newRegistration");
                },
              },
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
                  marginTop: "16px",
                  color: "gray",
                  border: "none",
                },
              },
              children: {
                previousButtonLabel: getLabel({
                  labelName: "NO",
                  labelKey: "CORE_COMMON_CANCEL",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  showHideConfirmationPopup(state, dispatch, "newRegistration");
                },
              },
            },
          },
        },
      },
      { className: "confirm-bnd-popup" }
    ),
  },
  { className: "confirm-bnd-popup" }
);
