import {
  getCommonCardWithHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

const screenConfig = {
  uiFramework: "material-ui",
  name: "mihyRegisterScreen",
  components: {
    mihyRegisterGrid: {
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
        mihyRegisterItem: {
          uiFramework: "custom-atoms",
          componentPath: "Item",
          props: {
            sm: 4,
            xs: 12
          },
          children: {
            mihyRegisterCard: getCommonCardWithHeader(
              {
                mihyloginDiv: {
                  uiFramework: "custom-atoms",
                  componentPath: "Div",
                  props: {
                    className: "text-center"
                  },
                  children: {
                    mihyRegisterUsername: {
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
                    mihyRegisterPassword: {
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
                    mihyRegisterConfirmPassword: {
                      uiFramework: "custom-molecules",
                      componentPath: "TextfieldWithIcon",
                      props: {
                        label: "Confirm password",
                        type: "password",
                        margin: "normal",
                        fullWidth: true,
                        required: true,
                        iconObj: { position: "end", iconName: "confirmation_number" }
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
                    mihyRegisterButton: {
                      componentPath: "Button",
                      props: {
                        color: "primary",
                        fullWidth: true
                      },
                      children: {
                        mihyRegisterButtonText: getLabel({label:"Let's go"})
                      }
                      // onClickDefination:{
                      //   action:"submit",
                      //   method:"get",
                      //   endPoint:"afbc.com",
                      //   purpose:"authRegister",
                      //   redirectionUrl:"/"
                      // }
                    }
                  }
                }
              },
              {
                mihyRegisterHeader: {
                  componentPath: "Typography",
                  children: {
                    mihyRegisterHeaderText: getLabel({label:"Register"})
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
