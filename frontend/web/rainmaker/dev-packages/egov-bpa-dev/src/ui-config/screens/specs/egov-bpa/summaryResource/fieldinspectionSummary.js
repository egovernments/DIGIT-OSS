import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getBreak,
  getDateField,
  getTimeField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { getTranslatedLabel, transformById, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { getLocalization, getLocale } from "egov-ui-kit/utils/localStorageUtils";

const localizationLabels = JSON.parse(getLocalization(`localization_${getLocale()}`));
let transfomedKeys = transformById(localizationLabels, "code");

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
          header:   getCommonContainer({
              statictitle: getLabel("Field Inspection","BPA_FI_REPORT",{labelKey:"BPA_FI_REPORT"}),
              dynamicTitle: getLabel("Test","abc",{labelName:"UYT"})
          })
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
        required : true,
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
          jsonPath: "BPA.additionalDetails.fieldinspection_pending[0].time",
          defaultValue: "00:00",
          style: { marginBottom: 10, paddingRight: 80 },
        },
        required : true,
        defaultValue: "00:00",
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
            labelKey: "BPA_DOC_DET_BTN_UPLOAD_FILE"
          },
          inputProps: {
            accept: "image/*, .pdf, .png, .jpeg"
          },
          maxFileSize: 5000,
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
            labelKey: "BPA_DOC_DET_BTN_UPLOAD_FILE"
          },
          inputProps: {
            accept: "image/*, .pdf, .png, .jpeg",
            multiple: false
          },
          maxFileSize: 5000
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
        labelKey: "BPA_ADD_ANOTHER_FI_REPORT_LABEL"
      },
      prefixSourceJsonPath: "children.cardContent.children.fiCard.children",
      sourceJsonPath: "BPA.additionalDetails.fieldinspection_pending",
      headerJsonPath : "children.cardContent.children.fiCard.children.header.children.header.children.dynamicTitle.props.labelName",
      headerName : " "
    }, 
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    type: "array"
  }
});
