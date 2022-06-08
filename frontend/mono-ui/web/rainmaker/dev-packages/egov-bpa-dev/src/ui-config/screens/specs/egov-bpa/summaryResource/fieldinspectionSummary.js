import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { gotoApplyWithStep } from "../../utils/index";
  import { getTransformedLocale, getQueryArg } from "egov-ui-framework/ui-utils/commons";
  
  
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
  
  export const fieldinspectionSummary = getCommonGrayCard({
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
          maxFileSize: 6000
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
          buttonLabel: {
            labelName: "UPLOAD FILE",
            labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
          },
          inputProps: {
            accept: "image/*, .pdf, .png, .jpeg"
          },
          maxFileSize: 6000
        },
        type: "array"
      },
  });
  