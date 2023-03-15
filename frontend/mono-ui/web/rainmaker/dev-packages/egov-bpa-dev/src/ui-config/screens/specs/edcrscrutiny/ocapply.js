import {
  getCommonCard,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonHeader,
  getPattern,
  getLabel,
  getDateField,
  getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { documentList } from "./documentList";
import { fetchMDMSOCData, getBuildingDetails, resetOCFields, submitFields } from "./functions";
import set from "lodash/set";
import { getTodaysDateInYMD } from "../utils";
import { dropdown } from "./apply";

const header = getCommonHeader({
  labelName: "Occupancy Certificate eDCR Scrutiny",
  labelKey: "BPA_OC_SCRUTINY_TITLE"
});

export const ocScrutinyDetailsContainer = getCommonGrayCard({

  // buildingplanscrutinyapplicationnumber: getLabelWithValue(
  //   {
  //     labelName: "eDCR Number",
  //     labelKey: "BPA_EDCR_NO_LABEL"
  //   },
  //   {
  //     jsonPath: "scrutinyDetails.edcrNumber"
  //   }
  // ),
  gridDefination: {
    xs: 12,
    sm: 12,
    md: 12
  },
  scrutinyDetailsCard: getCommonContainer({
    eDCRNumber: getTextField({
      label: {
        labelName: "eDCR Number",
        labelKey: "BPA_EDCR_NO_LABEL"
      },
      gridDefination: {
        xs: 12,
        sm: 4,
        md: 4
      },
      props: {
        disabled: true,
        className: "tl-trade-type"
      },
      jsonPath: "bpaDetails.edcrNumber"
    }),
    uploadedfile: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "downloadFile",
      gridDefination: {
        xs: 12,
        sm: 4,
        md: 4
      },
      props: {
        label: {
          labelName: "Uploaded Diagram",
          labelKey: "BPA_BASIC_DETAILS_UPLOADED_DIAGRAM"
        },
        linkDetail: {
          labelName: "uploadedDiagram.dxf",
          labelKey: "BPA_BASIC_DETAILS_UPLOADED_DIAGRAM_DXF"
        },
        jsonPath: "scrutinyDetails.updatedDxfFile",
      },
      type: "array"
    },
    scrutinyreport: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "downloadFile",
      gridDefination: {
        xs: 12,
        sm: 4,
        md: 4
      },
      props: {
        label: {
          labelName: "Scrutiny Report",
          labelKey: "BPA_BASIC_DETAILS_SCRUTINY_REPORT"
        },
        linkDetail: {
          labelName: "ScrutinyReport.pdf",
          labelKey: "BPA_BASIC_DETAILS_SCRUTINY_REPORT_PDF"
        },
        jsonPath: "scrutinyDetails.planReport",
      },
      type: "array"
    }
  })
});

const buildingInfoCard = getCommonCard({
  buildingPlanCardContainer: getCommonContainer({
      dropdown,
      dummyDiv1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        visible: true,
        props: {
          disabled: true
        }
      },
      buildingPermitDate: getDateField({
        label: {
          labelName: "Building Permit Date",
          labelKey: "EDCR_BUILDING_PERMIT_DATE_LABEL"
        },
        jsonPath: "Scrutiny[0].permitDate",
        required: true,
        pattern: getPattern("Date"),
        props: {
          required: true,
          inputProps: {
            max: getTodaysDateInYMD()
          }
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      buildingPermitNum: getTextField({
        label: {
          labelName: "Building Permit Number",
          labelKey: "EDCR_BUILDING_PERMIT_NUM_LABEL"
        },
        placeholder: {
          labelName: "Enter Building Permit Number",
          labelKey: "EDCR_BUILDING_PERMIT_NUM_PLACEHOLDER"
        },
        required: true,
        title: {
          value: "Please search scrutiny details linked to the scrutiny number",
          key: "BPA_BASIC_DETAILS_SCRUTINY_NUMBER_SEARCH_TITLE"
        },
        infoIcon: "info_circle",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Scrutiny[0].permitNumber",
        props: {
          required: true,
        },
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch, fieldInfo) => {
              getBuildingDetails(state, dispatch, fieldInfo);
            }
          }
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      inputdetails: getCommonContainer({
      applicantName: getTextField({
        label: {
          labelName: "Applicant Name",
          labelKey: "EDCR_SCRUTINY_NAME_LABEL"
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          disabled: true,
          className: "tl-trade-type"
        },
        pattern: getPattern("Name"),
        jsonPath: "Scrutiny[0].applicantName"
      }),
      servicetype: {
        ...getSelectField({
          label: {
            labelName: "Service type",
            labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
          },
          localePrefix: {
            moduleName: "WF",
            masterName: "BPA"
          },
          props: {
            disabled: true,
            className: "tl-trade-type"
          },
          jsonPath: "bpaDetails.serviceType",
          sourceJsonPath: "applyScreenMdmsData.BPA.ServiceType",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          }
        })
      },
      buildUpArea: getTextField({
        label: {
          labelName: "Total Build Up Area",
          labelKey: "EDCR_TOTAL_BUILD_UP_AREA_LABEL"
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          disabled: true,
          className: "tl-trade-type"
        },
        pattern: getPattern("Name"),
        jsonPath: "scrutinyDetails.planDetail.virtualBuilding.totalBuitUpArea"
      }),
      buildingHeight: getTextField({
        label: {
          labelName: "Building Height",
          labelKey: "EDCR_BUILDING_HEIGHT_LABEL"
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          disabled: true,
          className: "tl-trade-type"
        },
        pattern: getPattern("Name"),
        jsonPath: "scrutinyDetails.planDetail.blocks[0].building.buildingHeight"
      }),
      stakeHolderName: getTextField({
        label: {
          labelName: "Stake Holder Name",
          labelKey: "EDCR_SH_NAME_LABEL"
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          disabled: true,
          className: "tl-trade-type"
        },
        pattern: getPattern("Name"),
        jsonPath: "bpaDetails.appliedBy"
      }),
    }),
    ocScrutinyDetailsContainer,
    dummyDiv2: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 12
      },
      visible: false,
      props: {
        disabled: true
      },
      children: {
        documentList
      }
    },
    dummyDiv3: {
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
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
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
          callBack: resetOCFields
        }
      },

      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 3
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
  name: "ocapply",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(
      handleField(
        "ocapply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.buildingPermitDate",
        "props.value",
        null
      )
    );
    dispatch(
      handleField(
        "ocapply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.buildingPermitNum",
        "props.value",
        null
      )
    );
    dispatch(
      handleField(
        "ocapply",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.dropdown",
        "props.value",
        null
      )
    );
    set(state, "screenConfiguration.moduleName", "ocScrutiny");
    fetchMDMSOCData(action, state, dispatch);
    set(
      action,
      "screenConfig.components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.buttonContainer.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.ocScrutinyDetailsContainer.visible",
      false
    );
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
