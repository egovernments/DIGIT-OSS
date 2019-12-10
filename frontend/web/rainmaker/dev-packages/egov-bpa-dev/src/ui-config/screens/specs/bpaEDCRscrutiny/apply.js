import {
  getCommonCard,
  getTextField,
  getCommonTitle,
  getSelectField,
  getCommonContainer,
  getCommonHeader,
  getCommonParagraph,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
// import { documentList } from "./applyResource/documentList";

const header = getCommonHeader({
  labelName: "New Building Plan Scrutiny",
  labelKey: "BPA_SCRUTINY_TITLE"
});

const tradeDocumentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "TL_NEW-UPLOAD-DOCS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  paragraph: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "TL_NEW-UPLOAD-DOCS_SUBHEADER"
  })
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
      pattern: getPattern("Name")
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
      })
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
            labelName: "RESET",
            labelKey: "ABG_RESET_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields
        }
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
            backgroundColor: "#696969",
            borderRadius: "2px",
            width: window.innerWidth > 480 ? "80%" : "100%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "SEARCH",
            labelKey: "ABG_SEARCH_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            searchApiCall(state, dispatch);
          }
        }
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
