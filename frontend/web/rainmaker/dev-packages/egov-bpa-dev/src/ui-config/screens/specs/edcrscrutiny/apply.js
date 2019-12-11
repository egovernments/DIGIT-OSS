import {
  getCommonCard,
  getTextField,
  getCommonTitle,
  getSelectField,
  getCommonContainer,
  getCommonHeader,
  getCommonParagraph,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

const header = getCommonHeader({
  labelName: "New Building Plan Scrutiny",
  labelKey: "BPA_SCRUTINY_TITLE"
});

const buildingInfoCard = getCommonCard({
  buildingPlanCardContainer: getCommonContainer({
    licenseeType: {
      ...getSelectField({
        label: {
          labelName: "CITY",
          labelKey: "BPA_SCRUTINY_CITY"
        },
        placeholder: {
          labelName: "Select City",
          labelKey: "BPA_SCRUTINY_CITY_PLACEHOLDER"
        },
        required: true,
        gridDefination: {
          xs: 12,
          sm: 6
        }
      })
    },
    dummyDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6
      },
      visible: true,
      props: {
        disabled: true
      }
    },
    ownerName: getTextField({
      label: {
        labelName: "Applicant Name",
        labelKey: "BPA_SCRUTINY_NAME_LABEL"
      },
      placeholder: {
        labelName: "Enter Applicant Name",
        labelKey: "BPA_SCRUTINY_NAME_LABEL_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      required: true,
      pattern: getPattern("Name"),
    }),
    licenseeSubType: {
      ...getSelectField({
        label: {
          labelName: "Service Type",
          labelKey: "BPA_SCRUTINY_SERVICETYPE_LABEL"
        },
        placeholder: {
          labelName: "Select Service Type",
          labelKey: "BPA_SCRUTINY_SERVICETYPE_PLACEHOLDER"
        },
        required: true,
        gridDefination: {
          xs: 12,
          sm: 6
        }
      }),
    },
    buttonContainer: getCommonContainer({
      firstCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 3
        }
      },
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 3
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            // backgroundColor: "#FE7A51",
            border: "#FE7A51 solid 1px",
            borderRadius: "2px",
            width: window.innerWidth > 480 ? "80%" : "100%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "CLEAR FORM",
            labelKey: "BPA_SCRUTINY_CLEARFORM_BUTTON"
          })
        }
        // onClickDefination: {
        //   action: "condition",
        //   callBack: resetFields
        // }
      },
  
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 3
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            backgroundColor: "#FE7A51",
            borderRadius: "2px",
            width: window.innerWidth > 480 ? "80%" : "100%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "SUBMIT",
            labelKey: "BPA_SCRUTINY_SUBMIT_BUTTON"
          })
        }
        // onClickDefination: {
        //   action: "condition",
        //   callBack: (state, dispatch) => {
        //     searchApiCall(state, dispatch);
        //   }
        // }
      },
  
      lastCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 3
        }
      }
    })
  })
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            }
          }
        },
        buildingInfoCard
      }
    }
  }
};
export default screenConfig;