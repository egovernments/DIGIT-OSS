import {
  getCommonCardWithHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { getCommonCard, getCommonContainer, getCommonHeader, getCommonParagraph, getCommonTitle, getStepperObject } from "egov-ui-framework/ui-config/screens/specs/utils";


export const stepsData = [
  { labelName: "Trade Details", labelKey: "TL_COMMON_TR_DETAILS" },
  { labelName: "Owner Details", labelKey: "TL_COMMON_OWN_DETAILS" },
  { labelName: "Documents", labelKey: "TL_COMMON_DOCS" },
  { labelName: "Summary", labelKey: "TL_COMMON_SUMMARY" }
];

export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {

    }
  };
  
export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    
  },
  visible: false
};
  
export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    
  },
  visible: false
};
  
export const formwizardFourthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    
  },
  visible: false
};

export const header = getCommonContainer({
  header:
      getCommonHeader({
          labelName: 'Apply for New Trade License' ,
          labelKey: "APPLY"
      }),
  applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-tradelicence",
      componentPath: "ApplicationNoContainer",
      props: {
      number: "NA"
      },
      visible: false
  }
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "mihyLoginScreen",
  components: {
    mihyLoginGrid: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        mihyEmptyRow: {
          uiFramework: "custom-atoms",
          componentPath: "Item",
          props: {
            sm: 4
          }
        },
        mihyLoginItem: {
          uiFramework: "custom-atoms",
          componentPath: "Item",
          props: {
            sm: 4,
            xs: 12
          },
          children: {

              headerDiv: {
                uiFramework: "custom-atoms",
                componentPath: "Container",
                children: {
                  header: {
                    gridDefination: {
                      xs: 12,
                      sm: 10
                    },
                    ...header
                  }
                }
              },
              stepper,
              formwizardFirstStep,
              formwizardSecondStep,
              formwizardThirdStep,
              formwizardFourthStep,
              //footer,
          
            mihyLoginCard: getCommonCardWithHeader(
              {
                mihyloginDiv: {
                  uiFramework: "custom-atoms",
                  componentPath: "Div",
                  props: {
                    className: "text-center"
                  },
                  children: {
                    mihyLoginUsername: {
                      uiFramework: "custom-molecules",
                      componentPath: "TextfieldWithIcon",
                      props: {
                        label: "Email",
                        margin: "normal",
                        fullWidth: true,
                        autoFocus: true,
                        required: true,
                        iconObj: {
                          position: "end",
                          iconName: "email"
                        }
                      },
                      required: true,
                      jsonPath: "body.mihy.username",
                      pattern: "^([a-zA-Z0-9@.])+$"
                    },
                    mihyLoginPassword: {
                      uiFramework: "custom-molecules",
                      componentPath: "TextfieldWithIcon",
                      props: {
                        label: "Password",
                        type: "password",
                        margin: "normal",
                        fullWidth: true,
                        required: true,
                        iconObj: { position: "end", iconName: "lock" }
                      },
                      jsonPath: "body.mihy.password",
                      required: true,
                      pattern: "^([a-zA-Z0-9!])+$"
                    },
                    mihyBreakOne: {
                      uiFramework: "custom-atoms",
                      componentPath: "Break"
                    },
                    mihyBreakTwo: {
                      uiFramework: "custom-atoms",
                      componentPath: "Break"
                    },
                    mihyLoginButton: {
                      componentPath: "Button",
                      props: {
                        color: "primary",
                        fullWidth: true
                      },
                      children: {
                        mihyLoginButtonText: getLabel({label:"Let's go"})
                      }
                      // onClickDefination:{
                      //   action:"submit",
                      //   method:"get",
                      //   endPoint:"afbc.com",
                      //   purpose:"authLogin",
                      //   redirectionUrl:"/"
                      // }
                    }
                  }
                }
              },
              {
                mihyLoginHeader: {
                  componentPath: "Typography",
                  children: {
                    mihyLoginHeaderText: getLabel({label:"Login"})
                  },
                  props: {
                    align: "center",
                    variant: "title",
                    style: {
                      color: "white"
                    }
                  }
                }
              }
            )
          }
        }
      }
    }
  }
};

export default screenConfig;
