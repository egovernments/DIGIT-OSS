
import {
  getTextField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getCommonCard,
  getCommonTitle,
  getCommonParagraph,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { propertySearch} from "./searchResource/searchFunctions";


export const resetFields = (state, dispatch) => {
  if (process.env.REACT_APP_NAME == "Citizen") {
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
        "props.value",
        ""
      )
    );
    dispatch(prepareFinalObject(
      "searchScreen.tenantId",
      ''
    ))
  }

  dispatch(
    handleField(
      "propertySearch",
      "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.existingPropertyId",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      "components.div.children.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId",
      "props.value",
      ""
    )
  );
  dispatch(prepareFinalObject(
    "searchScreen.propertyIds",
    ''
  ))
  dispatch(prepareFinalObject(
    "searchScreen.mobileNumber",
    ''
  ))
  dispatch(prepareFinalObject(
    "searchScreen.oldpropertyids",
    ''
  ))

};


export const searchPropertyDetails = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Property",
    labelKey: "PT_COMMON_SEARCH_PROPERTY_SUB_HEADER"
  }),

  subParagraph: getCommonParagraph({
    labelName: "Provide at least one non-mandatory parameter to search for property",
    labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_DESC"
  }),
  ulbCityContainer: getCommonContainer({
    ulbCity: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "AutosuggestContainer",
      jsonPath: "searchScreen.tenantId",
      required: true,
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: {
          labelName: "City",
          labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_CITY"
        },
        placeholder: {
          labelName: "Select City",
          labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_CITY_PLACEHOLDER"
        },
        required: true,
        jsonPath: "searchScreen.tenantId",
        sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        labelsFromLocalisation: true,
        suggestions: [],
        fullwidth: true,
        isClearable: true,
        inputLabelProps: {
          shrink: true
        },
        isDisabled: process.env.REACT_APP_NAME === "Citizen" ? false : true,
      },
      isDisabled: process.env.REACT_APP_NAME === "Citizen" ? false : true,
      gridDefination: { xs: 12, sm: 4 }
    },
    ownerMobNo: getTextField({
      label: {
        labelName: "Owner Mobile No.",
        labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_OWN_MOB_LABEL"
      },
      placeholder: {
        labelName: "Enter your mobile No.",
        labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_OWN_MOB_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4,


      },
      iconObj: {
        label: "+91 |",
        position: "start"
      },
      required: false,
      pattern: getPattern("MobileNo"),
      jsonPath: "searchScreen.mobileNumber",
      errorMessage: "ERR_INVALID_MOBILE_NUMBER"
    }),
    existingPropertyId: getTextField({
      label: {
        labelName: "Existing Property ID",
        labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_EXISTING_PROPERTY_ID"
      },
      placeholder: {
        labelName: "Enter Existing Property ID",
        labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_EXISTING_PROPERTY_ID_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4,

      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_INVALID_PROPERTY_ID",
      jsonPath: "searchScreen.oldpropertyids"
    }),
    propertyTaxUniqueId: getTextField({
      label: {
        labelName: "Unique Property Id",
        labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_PROPERTY_UNIQUE_ID"
      },
      placeholder: {
        labelName: "Enter Property Tax Unique Id",
        labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_PROPERTY_UNIQUE_ID_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4,

      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_INVALID_PROPERTY_ID",
      jsonPath: "searchScreen.propertyIds"
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
            color: "rgba(0, 0, 0, 0.6000000238418579)",
            borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_RESET_BUTTON"
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
          sm: 6,
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
            labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: propertySearch
        }
      }
    })
  })
});
