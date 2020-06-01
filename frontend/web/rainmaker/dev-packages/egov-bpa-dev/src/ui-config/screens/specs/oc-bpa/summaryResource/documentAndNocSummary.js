import {
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
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

export const documentAndNocSummary = getCommonGrayCard({
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
          labelName: "Documents",
          labelKey: "BPA_DOCUMENT_AND_NOC_DETAILS_HEADER"
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
            changeStep(state, dispatch, "", 3);            
          }
        }
      }
    }
  },
  documentDetailsCard:{
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
        className: "applicant-summary",
        scheama: getCommonGrayCard({
          body: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-bpa",
            componentPath: "PreviewContainer",
            props: {
              sourceJsonPath: "documentDetailsPreview",
              className: "noc-review-documents",
              buttonLabel: {
                labelName: "UPLOAD FILE",
                labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
              },
              inputProps: {
                accept: "image/*, .pdf, .png, .jpeg",
                multiple: false
              },
              maxFileSize: 6000
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
  }
});
