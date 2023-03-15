import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getLabel,
  getPattern,

  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { searchApiCall } from "./functions";

const tenantId = process.env.REACT_APP_NAME === "Employee" ? getTenantId() : JSON.parse(getUserInfo()).permanentCity;
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
  dispatch(
    handleField(
      "search",
      "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.mobileNumber",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.ulb",
      "props.value",
      tenantId
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
    ulb: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-hrms",
      componentPath: "AutosuggestContainer",
      jsonPath: "hrmsSearchScreen.ulb",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      props: {
        optionLabel: "name",
        optionValue: "code",
        label: {
          labelName: "ULB",
          labelKey: "HR_ULB_LABEL"
        },
        placeholder: {
          labelName: "Select ULB",
          labelKey: "HR_SELECT_ULB_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        roleDefination: {
          rolePath: "user-info.roles",
          roles: []
        },
        value: tenantId,
        className: "autocomplete-dropdown",
        jsonPath: "hrmsSearchScreen.ulb",
        sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
        labelsFromLocalisation: true,
        required: true,
        disabled: true,
        isDisabled:true,
      },
      required: true,
      disabled: true,
      isDisabled:true,
    },

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
      pattern: /^[a-zA-Z0-9-!@#\$%\^\&*\)\(+=._]*$/i,
      errorMessage: "HR_EMP_ID_ERR_MSG",
      jsonPath: "hrmsSearchScreen.codes"
    }),
    mobileNumber: getTextField({
      label: {
        labelName: "Mobile No.",
        labelKey: "HR_EMP_MOBILE_LABEL"
      },
      placeholder: {
        labelName: "Enter Mobile No.",
        labelKey: "HR_EMP_MOBILE_PLACEHOLDER"
      },
      required: false,
      props: {
        className: "applicant-details-error"
      },
      pattern: /^[6789][0-9]{9}$/i,
      errorMessage: "HR_EMP_MOBILE_ERR_MSG",
      jsonPath: "hrmsSearchScreen.phone",
      gridDefination: {
        xs: 12,
        sm: 4
      },
    }),
    department: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-hrms",
      componentPath: "AutosuggestContainer",
      props: {
        optionLabel: "name",
        optionValue: "code",
        label: {
          labelName: "Department",
          labelKey: "HR_ROLE_LABEL"
        },
        placeholder: {
          labelName: "Select Department",
          labelKey: "HR_ROLE_PLACEHOLDER"
        },
        required: false,
        isClearable: true,
        labelsFromLocalisation: true,
        className: "autocomplete-dropdown",
        jsonPath: "hrmsSearchScreen.roles",
        sourceJsonPath: "searchScreenMdmsData.ACCESSCONTROL-ROLES.roles",
        localePrefix: {
          moduleName: "ACCESSCONTROL_ROLES",
          masterName: "ROLES"
        }
      },
      required: false,
      jsonPath: "hrmsSearchScreen.roles",
      gridDefination: {
        xs: 12,
        sm: 4
      },
    },
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
      jsonPath: "hrmsSearchScreen.names"
    }),
    designation: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-hrms",
      componentPath: "AutosuggestContainer",
      props: {
        label: { labelName: "Designation", labelKey: "HR_DESG_LABEL" },
        optionValue: "code",
        optionLabel: "name",
        placeholder: {
          labelName: "Select Designation",
          labelKey: "HR_DESIGNATION_PLACEHOLDER"
        },
        required: false,
        isClearable: true,
        labelsFromLocalisation: true,
        className: "autocomplete-dropdown",
        jsonPath: "hrmsSearchScreen.designations",
        sourceJsonPath: "searchScreenMdmsData.common-masters.Designation",
        localePrefix: {
          moduleName: "common-masters",
          masterName: "Designation"
        }
      },
      required: false,
      jsonPath: "hrmsSearchScreen.designations",
      gridDefination: {
        xs: 12,
        sm: 4
      },
    },

  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      hrmsResetButton: {
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
            // width: "220px",
            height: "48px",
            // margin: "8px",
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
      hrmsSearchButton: {
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
            // margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            // width: "220px",
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
}, {
  style: {
    overflow: "visible"
  }
});
