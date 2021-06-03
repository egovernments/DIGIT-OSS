import {
    getBreak,
    getCommonCard,
    getCommonParagraph,
    getCommonGrayCard,
    getCommonContainer,
    getCommonTitle,
    getCommonSubHeader,    
    getLabelWithValue,
    getLabel    
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { checkValueForNA } from "../utils/index";

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

  export const nocDetailsApply = getCommonGrayCard({
    header: getCommonTitle(
      {
        labelName: "NOC Details",
        labelKey: "BPA_NOC_DETAILS"
      },
      {
        style: {
        marginBottom: "10px"
        }
      }
    ),  
    // fireNocDetailsCard: getCommonCard({
        documentDetailsCard: {
            uiFramework: "custom-molecules-local",
            moduleName: "egov-bpa",
            componentPath: "NocDetailCard",
            props: {
              jsonPath: "nocForPreview",                  
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
        }
    // }),
})

export const nocDetailsSearch = getCommonGrayCard({
  header: getCommonTitle(
    {
      labelName: "NOC Details",
      labelKey: "BPA_NOC_DETAILS"
    },
    {
      style: {
        marginBottom: "10px"
      }
    }
  ),  
  // fireNocDetailsCard: getCommonCard({
      documentDetailsCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-bpa",
          componentPath: "NocDetailCard",
          props: {
            jsonPath: "nocForPreview",                  
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
      }
  // }),
})