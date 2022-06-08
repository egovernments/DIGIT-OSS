import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getLabel,
  getPattern,
  getSelectField,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall } from "./functions";

const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.department",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.designation",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.employeeID",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.employeeName",
      "props.value",
      ""
    )
  );
};

export const searchForm = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Employee",
    labelKey: "HR_HOME_SEARCH_RESULTS_HEADING"
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "HR_HOME_SEARCH_RESULTS_DESC"
  }),
  searchFormContainer: getCommonContainer({
    ulb: getSelectField({
      label: { labelName: "ULB", labelKey: "HR_ULB_LABEL" },
      placeholder: {
        labelName: "Select ULB",
        labelKey: "HR_SELECT_ULB_PLACEHOLDER"
      },
      required: true,
      jsonPath: "searchScreen.ulb",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
      props: {
        optionLabel: "name",
        optionValue: "code"
        // hasLocalization: false
      },
      localePrefix: {
        moduleName: "TENANT",
        masterName: "TENANTS"
      },
      roleDefination: {
        rolePath: "user-info.roles",
        roles: []
      }
    }),

    employeeName: getTextField({
      label: {
        labelName: "Employee Name",
        labelKey: "HR_EMP_NAME_LABEL"
      },
      placeholder: {
        labelName: "Enter Employee Name",
        labelKey: "HR_EMP_NAME_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: getPattern("Name") || null,
      errorMessage: "HR_EMP_NAME_ERR_MSG",
      jsonPath: "searchScreen.names"
    }),

    employeeID: getTextField({
      label: {
        labelName: "Employee ID",
        labelKey: "HR_EMP_ID_LABEL"
      },
      placeholder: {
        labelName: "Enter Employee ID",
        labelKey: "HR_EMP_ID_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z0-9-_]*$/i,
      errorMessage: "HR_EMP_ID_ERR_MSG",
      jsonPath: "searchScreen.codes"
    }),

    department: getSelectField({
      label: { labelName: "Department", labelKey: "HR_DEPT_LABEL" },
      placeholder: {
        labelName: "Select Department",
        labelKey: "HR_DEPT_PLACEHOLDER"
      },
      required: false,
      jsonPath: "searchScreen.departments",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      sourceJsonPath: "searchScreenMdmsData.common-masters.Department",
      props: {
        optionLabel: "name",
        optionValue: "code"
        // hasLocalization: false
      },
      localePrefix: {
        moduleName: "common-masters",
        masterName: "Department"
      }
    }),
    designation: getSelectField({
      label: { labelName: "Designation", labelKey: "HR_DESG_LABEL" },
      placeholder: {
        labelName: "Select Designation",
        labelKey: "HR_DESIGNATION_PLACEHOLDER"
      },
      required: false,
      jsonPath: "searchScreen.designations",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      sourceJsonPath: "searchScreenMdmsData.common-masters.Designation",
      props: {
        optionValue: "code",
        optionLabel: "name"
        // hasLocalization: false
      },
      localePrefix: {
        moduleName: "common-masters",
        masterName: "Designation"
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
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            //   borderRadius: "2px",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "HRMS_SEARCH_RESET_BUTTON"
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
          // align: "center"
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
            labelKey: "TL_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
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
