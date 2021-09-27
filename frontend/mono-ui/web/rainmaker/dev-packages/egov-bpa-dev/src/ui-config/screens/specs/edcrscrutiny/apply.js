import {
  getCommonCard,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonHeader,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { documentList } from "./documentList";
import { resetFields, submitFields } from "./functions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {fetchMDMSData} from "./functions";

const header = getCommonHeader({
  labelName: "New Building Plan Scrutiny",
  labelKey: "BPA_SCRUTINY_TITLE"
});

export const dropdown = {
  uiFramework: "custom-containers",
  componentPath: "AutosuggestContainer",
  jsonPath:
    "Scrutiny[0].tenantId",
  required: true,
  props: {
    style: {
      width: "100%",
      cursor: "pointer"
    },
    label: {
      labelName: "CITY",
      labelKey: "EDCR_SCRUTINY_CITY"
    },
    placeholder: {
      labelName: "Select City",
      labelKey: "EDCR_SCRUTINY_CITY_PLACEHOLDER"
    },
    localePrefix: {
      moduleName: "TENANT",
      masterName: "TENANTS"
    },
    sourceJsonPath: "applyScreenMdmsData.tenantData",
    labelsFromLocalisation: true,
    errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    suggestions: [],
    fullwidth: true,
    required: true,
    isClearable: true,
    inputLabelProps: {
      shrink: true
    }
    // className: "tradelicense-mohalla-apply"
  },
  beforeFieldChange: async (action, state, dispatch) => {
    // dispatch(
    //   prepareFinalObject(
    //     "Licenses[0].tradeLicenseDetail.address.locality.name",
    //     action.value && action.value.label
    //   )
    // );
  },
  gridDefination: {
    xs: 12,
    sm: 6
  }
}

const buildingInfoCard = getCommonCard({
  buildingPlanCardContainer: getCommonContainer({
    inputdetails: getCommonContainer({
      dropdown,
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
      applicantName: getTextField({
        label: {
          labelName: "Applicant Name",
          labelKey: "EDCR_SCRUTINY_NAME_LABEL"
        },
        placeholder: {
          labelName: "Enter Applicant Name",
          labelKey: "EDCR_SCRUTINY_NAME_LABEL_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: true,
        pattern: getPattern("Name"),
        jsonPath: "Scrutiny[0].applicantName"
      }),
      // serviceType: {
      //   ...getSelectField({
      //     label: {
      //       labelName: "Service Type",
      //       labelKey: "BPA_SCRUTINY_SERVICETYPE_LABEL"
      //     },
      //     placeholder: {
      //       labelName: "Select Service Type",
      //       labelKey: "BPA_SCRUTINY_SERVICETYPE_PLACEHOLDER"
      //     },
      //     required: true,
      //     gridDefination: {
      //       xs: 12,
      //       sm: 6
      //     }
      //   })
      // },
      dummyDiv1: {
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
      }
    }),
    dummyDiv2: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 12
      },
      visible: true,
      props: {
        disabled: true
      },
      children: {
        documentList
      }
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
            backgroundColor: "#FE7A51",
            borderRadius: "2px",
            width: window.innerWidth > 480 ? "80%" : "100%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "SUBMIT",
            labelKey: "EDCR_SCRUTINY_SUBMIT_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            submitFields(state, dispatch);
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
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("Scrutiny[0]", {}));
    dispatch(prepareFinalObject("LicensesTemp[0]", {}));
    fetchMDMSData(action, state, dispatch);
    return action;
  },
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
