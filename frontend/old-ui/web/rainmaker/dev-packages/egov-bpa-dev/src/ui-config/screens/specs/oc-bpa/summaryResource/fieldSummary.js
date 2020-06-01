import {
  getCommonGrayCard,
  getCommonSubHeader,
  getBreak,
  getCommonContainer,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

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

const fieldSummaryContent = () => {
  return getCommonGrayCard({
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
            labelName: "Check List",
            labelKey: "BPA_CHECK_LIST_DETAILS"
          })
        }
      }
    },
    lableData : getCommonContainer({
      fieldSummaryDate: getLabelWithValue(
        {
          labelName: "BPA_FI_DATE_LABEL_NAME",
          labelKey: "BPA_FI_DATE_LABEL"
        },
        {
          jsonPath:
            "BPA.additionalDetails.fieldinspection_pending[0].date"
        }
      ),
      fieldSummaryTime: getLabelWithValue(
        {
          labelName: "BPA_FI_TIME_LABEL_NAME",
          labelKey: "BPA_FI_TIME_LABEL"
        },
        {
          jsonPath:
            "BPA.additionalDetails.fieldinspection_pending[0].time"
        }
      )
    }),
    checkListDetailsContainer: getHeader({
      labelName: "Check List",
      labelKey: "BPA_CHECK_LIST_DETAILS"
    }),
    fieldInspectionDetailsCard: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-bpa",
      componentPath: "FieldInspectionContainer",
      props: {
        jsonPath: "BPA.additionalDetails.fieldinspection_pending[0].questions",
        jsonPathUpdatePrefix: "BPA.additionalDetails.fieldinspection_pending",
        className: "noc-review-documents"
      }
    },
    break: getBreak(),
    documentsDetailsContainer: getHeader({
      labelName: "Documents",
      labelKey: "BPA_FIELD_INSPECTION_DOCUMENTS"
    }),
    fiDocumentDetailsCard: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-bpa",
      componentPath: "DownloadFileContainerForFI",
      props: {
        jsonPath: "BPA.additionalDetails.fieldinspection_pending[0].docs",
        jsonPathUpdatePrefix: "BPA.additionalDetails.fieldinspection_pending",
        className: "noc-review-documents"
      }
    }
  });
}

export const fieldSummary = getCommonContainer({
  summaryContent: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "filed-inspection-summary",
      scheama: fieldSummaryContent(),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      prefixSourceJsonPath: "children.cardContent.children",
      sourceJsonPath: "BPA.additionalDetails.fieldinspection_pending",
      headerJsonPath : "children.cardContent.children.header.children.header.children.key.props.label",
      headerName : getLocaleLabels( "FI Report", "BPA_FI_REPORT")
    },
    type: "array"
  }
});
