import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
  getTextField,
  getPattern,
  getCommonParagraph,
  getCommonGrayCard,
  getDivider,
  getCommonCaption ,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import {showHideConfirmationPopup } from "./deathSearchCard";
import {triggerDownload} from "../../utils"; 

const dSignAgreePath =  "bnd.death.iAgree"
export const disclaimerDialog = getCommonContainer({
  
  header: getCommonHeader({
      labelName: "Confirm Download",
      labelKey: "BND_IMPORTANT"
    },
    {
      style: {
        fontSize: "20px"
      }
    }),
  divider1: getDivider(),
  downloadNote: getCommonContainer({
    value0: getCommonCaption({
      labelName: "",
      labelKey: "BND_DOWNLOAD_NOTE"
      },
      {
        style: {
          fontSize: "14px"
      }
      }),
      break1 : getBreak()
  }),
  confirmationContents: getCommonContainer({
    header: getCommonHeader({
      labelName: "Confirm Download",
      labelKey: "BND_DOWNLOAD_TERMS"
    },
    {
      style: {
        fontSize: "20px"
      }
    }),
    //break0:getDivider(),
    termsContainer: getCommonGrayCard({
      value0: getCommonCaption({
        labelName:
          "Important : The application form is to be signed by the original lessee or his/her successors/heir. Otherwise considered invalid.",
        labelKey: "BND_DOWNLOAD_TERMS_CONTENT1"
      },
      {
        style: {
          fontSize: "14px"
      }
      }),  
      break2 : getBreak()
      }),
      // value1: getCommonParagraph({
      //   labelName:
      //     "You can digitally sign if you have your aadhar number linked with your mobile number. ",
      //   labelKey: "LAMS_DSIGN_TERMS_DESC1"
      // }),
      // value2: getCommonParagraph({
      //   labelName:
      //     "When you proceed, you will be asked to enter Aadhar Virtual ID. This is different from your Aadhar number."+
      //     " If you have not created virtual ID yet, click on 'Get Virtual ID' or visit https://resident.uidai.gov.in/vid-generation and follow the steps acordingly",
      //   labelKey: "LAMS_DSIGN_TERMS_DESC4"
      // }),
      // // info2: getCommonCaption({
      // //   labelName: "E Sign Terms",
      // //   labelKey: "LAMS_DSIGN_TERMS"
      // // }),
      // //divider2: getDivider(),
      // value3: getCommonParagraph({
      //   labelName:
      //     "You can digitally sign if you have your aadhar number linked with your mobile number. ",
      //   labelKey: "LAMS_DSIGN_TERMS_DESC2"
      // }),
      // //divider3: getDivider(),
      // value4: getCommonParagraph({
      //   labelName:
      //     "I hereby give my consent for usage of the mentioned details for the purpose of digitally signing and storing the application.",
      //   labelKey: "LAMS_DSIGN_TERMS_DESC3"
      // }),

    }),
    // checkBox: {
    //   uiFrameWork: "custom-atoms-local",
    //   componentPath: "CheckBox",
    //   moduleName: "egov-lams",
    //   props: {
    //     content: "Test"
    //   }
    // },
  break2: getBreak,
  checkBox:{
      required: true,
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bnd",
      componentPath: "Checkbox",
      props: {
        label:{
          labelKey:"BND_DOWNLOAD_IAGREE",
          labelName: "I agree and wish to continue"
        },
        jsonPath: dSignAgreePath,
      },
    },

    // termsContainer1: getCommonGrayCard({
      
    // }),
    
    
    // commentsField: getTextField({
    //   label: {
    //     labelName: "Enter Comments",
    //     labelKey: "CANCEL_COMMENT_LABEL"
    //   },
    //   placeholder: {
    //     labelName: "Enter Comments",
    //     labelKey: "CANCEL_COMMENT_LABEL"
    //   },
    //   gridDefination: {
    //     xs: 12,
    //     sm: 12
    //   },
    //   props: {
    //     style: {
    //       width: "90%"
    //     }
    //   },
    //   pattern: getPattern("cancelChallan"),
    //   required: true,
    //   visible: true,
    //   jsonPath: "Challan.additionalDetail.cancellComment"
    // }),
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
              let iAgree = get(state.screenConfiguration.preparedFinalObject , dSignAgreePath);
              if(iAgree)
              {
                triggerDownload("death");
                showHideConfirmationPopup(state, dispatch, "getCertificate");
                //prepareForDSign(state,dispatch)
              }
              else
              {
                dispatch(toggleSnackbar(true,{labelName: "You have to agree to terms and conditions before you proceed.",
                labelKey: "ERR_BND_DOWNLOAD_IAGREE"}, "error"));
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
              minWidth: "100px",
              height: "20px",
              marginRight: "4px",
              marginTop: "16px"
            }
          },
          children: {
            previousButtonLabel: getLabel({
              labelName: "NO",
              labelKey: "BND_CANCEL_DOWNLOAD_IAGREE"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              showHideConfirmationPopup(state, dispatch, "getCertificate")
            }
          }
        }
      }
    }
  
});
