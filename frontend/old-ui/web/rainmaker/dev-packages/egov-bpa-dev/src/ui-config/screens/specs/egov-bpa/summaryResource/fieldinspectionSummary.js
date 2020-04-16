import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getBreak,
  getDateField,
  getTimeField
} from "egov-ui-framework/ui-config/screens/specs/utils";

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-bpa",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

const fieldInspectionMultiItem = () => {
  return getCommonGrayCard({
    fiCard: getCommonContainer({
      header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
          style: { marginBottom: "10px" }
        },
        children: {
          header: {
            gridDefination: {
              xs: 8
            },
            ...getCommonSubHeader({
              labelName: "Field Inspection",
              labelKey: "BPA_FIELD_INSPECTION_DETAILS_TITLE"
            })
          },
          editSection: {
            componentPath: "Button",
            props: {
              color: "primary",
              style: {
                marginTop: "-10px",
                marginRight: "-18px"
              }
            },
            gridDefination: {
              xs: 4,
              align: "right"
            }
          }
        }
      },
      applicationdate: getDateField({
        label: {
          labelName: "BPA_FI_DATE_LABEL_NAME",
          labelKey: "BPA_FI_DATE_LABEL"
        },
        props: {
          className: "tl-trade-type",
          jsonPathUpdatePrefix: "BPA.additionalDetails.fieldinspection_pending",
          jsonPath: "BPA.additionalDetails.fieldinspection_pending[0].date"
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      applicationtime: getTimeField({
        label: {
          labelName: "BPA_FI_TIME_LABEL_NAME",
          labelKey: "BPA_FI_TIME_LABEL"
        },
        props: {
          className: "tl-trade-type",
          jsonPathUpdatePrefix: "BPA.additionalDetails.fieldinspection_pending",
          jsonPath: "BPA.additionalDetails.fieldinspection_pending[0].time"
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      break3: getBreak(),
      bpaCheckListContainer: getHeader({
        labelName: "Check List",
        labelKey: "BPA_CHECK_LIST_DETAILS"
      }),
      break1: getBreak(),
      questions: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "CheckListContainer",
        props: {
          documents: [],
          buttonLabel: {
            labelName: "UPLOAD FILE",
            labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
          },
          inputProps: {
            accept: "image/*, .pdf, .png, .jpeg"
          },
          maxFileSize: 6000,
          jsonPath: "BPA.additionalDetails.fieldinspection_pending[0].questions",
          jsonPathUpdatePrefix: "BPA.additionalDetails.fieldinspection_pending",
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 12
        },
        type: "array"
      },
      BlockWiseOccupancyAndUsageDetails: getHeader({
        labelName: "Documents",
        labelKey: "BPA_FIELD_INSPECTION_DOCUMENTS"
      }),
      break2: getBreak(),
      documentList: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "NocListContainer",
        props: {
          documents: [],
          jsonPath: "BPA.additionalDetails.fieldinspection_pending[0].docs",
          jsonPathUpdatePrefix: "BPA.additionalDetails.fieldinspection_pending",
          buttonLabel: {
            labelName: "UPLOAD FILE",
            labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
          },
          inputProps: {
            accept: "image/*, .pdf, .png, .jpeg",
            multiple: false
          },
          maxFileSize: 6000
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 12
        },
        type: "array"
      }
    })
  })
};

export const fieldinspectionSummary = getCommonContainer({
  summaryContent: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "filed-inspection-summary",
      scheama: fieldInspectionMultiItem(),
      items: [],
      hasAddItem: true,
      isReviewPage: false,
      addItemLabel: {
        labelName: "Add Another Field Inspection Report",
        labelKey: ""
      },
      prefixSourceJsonPath: "children.cardContent.children.fiCard.children",
      sourceJsonPath: "BPA.additionalDetails.fieldinspection_pending",
      headerJsonPath : "children.cardContent.children.fiCard.children.header.children.header.children.key.props.label",
      headerName : "BPA_FI_REPORT",
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    type: "array"
  }
});
