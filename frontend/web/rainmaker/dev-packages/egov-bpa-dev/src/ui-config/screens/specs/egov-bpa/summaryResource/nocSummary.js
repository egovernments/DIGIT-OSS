import {
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { statusOfNocDetails } from "../applyResource/updateNocDetails";


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

export const nocSummary = getCommonGrayCard({
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
          labelName: "NOC Details",
          labelKey: "BPA_NOC_DETAILS"
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
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "BPA_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 5);
          }
        }
      }
    }
  },
  nocDocumentDetailsCard:{
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
              sourceJsonPath: "nocDocumentsPreview",
              className: "noc-review-documents"
            }
          },
        }),
        items: [],
        hasAddItem: false,
        isReviewPage: true,
        // sourceJsonPath: "",
        prefixSourceJsonPath:
            "children.cardContent.children.totalBuildUpAreaDetailsContainer.children",
        afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  },
  uploadedNocDocumentDetailsCard:{
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
        className: "applicant-summary",
        scheama: getCommonGrayCard({
          statusOfNocDetails : statusOfNocDetails
        }),
        items: [],
        hasAddItem: false,
        isReviewPage: true,
        sourceJsonPath: "scrutinyDetails.planDetail.blocks[0].building",
        prefixSourceJsonPath:
            "children.cardContent.children.totalBuildUpAreaDetailsContainer.children",
        afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  },
});
