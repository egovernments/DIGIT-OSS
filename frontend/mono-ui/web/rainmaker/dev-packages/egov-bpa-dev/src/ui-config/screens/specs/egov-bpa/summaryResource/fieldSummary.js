import {
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { documentDetails } from "../applyResource/documentDetails";
import { changeStep } from "../applyResource/footer";

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

export const fieldSummary = getCommonGrayCard({
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
  checkListDetailsContainer: getHeader({
    labelName: "Check List",
    labelKey: "BPA_CHECK_LIST_DETAILS"
  }),
  // break: getBreak(),
  fieldInspectionDetailsCard: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonGrayCard({
        body: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-bpa",
          componentPath: "FieldInspectionContainer",
          props: {
            sourceJsonPath: "fieldInspectionCheckListDetailsPreview",
            className: "noc-review-documents"
          }
        },
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      prefixSourceJsonPath:
        "children.cardContent.children.totalBuildUpAreaDetailsContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  },
  documentsDetailsContainer: getHeader({
    labelName: "Documents",
    labelKey: "BPA_FIELD_INSPECTION_DOCUMENTS"
  }),
  fiDocumentDetailsCard: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonGrayCard({
        body: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-bpa",
          componentPath: "DownloadFileContainer",
          props: {
            sourceJsonPath: "fieldInspectionDocumentsDetailsPreview",
            className: "noc-review-documents"
          }
        },
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      prefixSourceJsonPath:
        "children.cardContent.children.totalBuildUpAreaDetailsContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  },
});
