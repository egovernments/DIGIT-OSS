import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getDateField,
  getLabel,
  getPattern,
  getSelectField,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall } from "./functions";

export const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "noc-search",
      "components.div.children.nocApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children.fromDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "noc-search",
      "components.div.children.nocApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children.toDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "noc-search",
      "components.div.children.nocApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children.nocNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "noc-search",
      "components.div.children.nocApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children.applicationType",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "noc-search",
      "components.div.children.nocApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children.nocType",
      "props.value",
      ""
    )
  );
};

export const nocApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Application for NOC",
    labelKey: "NOC_RESULTS_HEADER"
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "BPA_HOME_SEARCH_RESULTS_DESC"
  }),
  appBPAHomeSearchResultsContainer: getCommonContainer({
    nocNo: getTextField({
      label: {
        labelName: "Application number",
        labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Application number",
        labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "searchScreen.applicationNo"
    }),
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "BPA_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "From Date",
        labelKey: "BPA_FROM_DATE_PLACEHOLDER"
      },
      jsonPath: "searchScreen.fromDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: false
    }),
    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "BPA_TO_DATE_LABEL" },
      placeholder: {
        labelName: "To Date",
        labelKey: "BPA_TO_DATE_PLACEHOLDER"
      },
      jsonPath: "searchScreen.toDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: false
    }),
    applicationType: getSelectField({
      label: {
        labelName: "Application Type",
        labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select Application Type",
        labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_PLACEHOLDER"
      },
      jsonPath: "searchScreen.applicationType",
      required: false,
      gridDefination: {
        xs: 12,
        sm: 4
      },
      localePrefix: {
        moduleName: "NOC",
        masterName: "APP_TYPE"
      },
      data: [
        {
          code: "PROVISIONAL"
        },
        {
          code: "NEW"
        },
        {
          code: "RENEW"
        }
      ],
    }),
    nocType: getSelectField({
      label: {
        labelName: "NOC Type",
        labelKey: "NOC_SEARCH_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select NOC Type",
        labelKey: "NOC_SEARCH_TYPE_PLACEHOLDER"
      },
      localePrefix: {
        moduleName: "NOC",
        masterName: "NOC_TYPE"
      },
      jsonPath: "searchScreen.nocType",
      sourceJsonPath: "applyScreenMdmsData.NOC.NocType",
      required: false,
      gridDefination: {
        xs: 12,
        sm: 4
      }
    })
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "BPA_HOME_SEARCH_RESET_BUTTON"
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
          sm: 6
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "220px",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "BPA_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      }
    })
  })
});
