import {
  getBreak,
  getCommonCaption,
  getCommonContainer,
  getCommonGrayCard,
  getCommonHeader,
  getCommonParagraph,
  getDivider,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { triggerDownload } from "../../utils";
import { showHideConfirmationPopup } from "./birthSearchCard";

const dSignAgreePath = "bnd.birth.iAgree";
export const disclaimerDialog = getCommonContainer({
  headerDiv: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        marginBottom: "10px",
      },
    },
    children: {
      header0: getCommonHeader(
        {
          labelName: "",
          labelKey: "BND_IMPORTANT",
        },
        {
          style: {
            fontSize: "20px",
            display: "inline",
          },
        }
      ),
      closeButton: {
        componentPath: "Button",
        props: {
          style: {
            margin: "-10px",
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
            showHideConfirmationPopup(state, dispatch, "getCertificate"),
        },
      },
    },
  },
  divider1: getDivider(),
  downloadNote: getCommonContainer({
    value0: getCommonCaption(
      {
        labelName: "",
        labelKey: "BND_DOWNLOAD_NOTE",
      },
      {
        style: {
          fontSize: "14px",
        },
      }
    ),
    break1: getBreak(),
  }),
  header: getCommonHeader(
    {
      labelName: "Confirm Download",
      labelKey: "BND_DOWNLOAD_TERMS",
    },
    {
      style: {
        fontSize: "20px",
      },
    }
  ),
  confirmationContents: getCommonContainer({
    termsContainer: getCommonGrayCard({
      value0: getCommonParagraph({
        labelName:
          "Important : The application form is to be signed by the original lessee or his/her successors/heir. Otherwise considered invalid.",
        labelKey: "BND_DOWNLOAD_TERMS_CONTENT1",
      }),
    }),

    break2: getBreak,
    checkBox: {
      required: true,
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bnd",
      componentPath: "Checkbox",
      props: {
        label: {
          labelKey: "BND_DOWNLOAD_IAGREE",
          labelName: "I agree and wish to continue",
        },
        jsonPath: dSignAgreePath,
      },
    },
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
              let iAgree = get(
                state.screenConfiguration.preparedFinalObject,
                dSignAgreePath
              );
              if (iAgree) {
                triggerDownload("birth");
                showHideConfirmationPopup(state, dispatch, "getCertificate");
              } else {
                dispatch(
                  toggleSnackbar(
                    true,
                    {
                      labelName:
                        "You have to agree to terms and conditions before you proceed.",
                      labelKey: "ERR_BND_DOWNLOAD_IAGREE",
                    },
                    "error"
                  )
                );
              }
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
              labelKey: "BND_CANCEL_DOWNLOAD_IAGREE",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              showHideConfirmationPopup(state, dispatch, "getCertificate");
            },
          },
        },
      },
    },
  }),
});
