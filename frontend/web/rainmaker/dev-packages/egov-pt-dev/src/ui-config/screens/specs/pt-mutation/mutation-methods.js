
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
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { propertySearch,applicationSearch } from "./functions";
  
  export const resetFields = (state, dispatch) => {
    // dispatch(
    //   handleField(
    //     "propertySearch",
    //     "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
    //     "props.value",
    //     ""
    //   )
    // );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.existingPropertyId",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.propertyTaxApplicationNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.ownerMobNoProp",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.applicationPropertyTaxUniqueId",
        "props.value",
        ""
      )
    );
  };

  
  export const searchPropertyDetails = getCommonCard({
    subHeader: getCommonTitle({
      labelName: "Search Property",
      labelKey: "SEARCH_PROPERTY"
    }),
  
    subParagraph: getCommonParagraph({
      labelName: "Provide at least one non-mandatory parameter to search for an application",
      labelKey: "PT_HOME_SEARCH_RESULTS_DESC"
    }),
    ulbCityContainer: getCommonContainer({
        ulbCity: getSelectField({
            label: {
              labelName: "ULB",
              labelKey: "PT_ULB_CITY"
            },
            placeholder: {
              labelName: "Select ULB",
              labelKey: "PT_ULB_CITY_PLACEHOLDER"
            },
      
            localePrefix: {
              moduleName: "TENANT",
              masterName: "TENANTS"
            },
            jsonPath: "searchScreen.tenantId",
            sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
            required: true,
            props:{
              required: true,
            disabled: true
            },
            gridDefination: {
              xs: 12,
              sm: 4
            }
          }),
      ownerMobNo: getTextField({
        label: {
          labelName: "Owner Mobile No.",
          labelKey: "PT_HOME_SEARCH_RESULTS_OWN_MOB_LABEL"
        },
        placeholder: {
          labelName: "Enter your mobile No.",
          labelKey: "PT_HOME_SEARCH_RESULTS_OWN_MOB_PLACEHOLDER"
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
      propertyTaxUniqueId: getTextField({
        label: {
          labelName: "Property Tax Unique Id",
          labelKey: "PT_PROPERTY_UNIQUE_ID"
        },
        placeholder: {
          labelName: "Enter Property Tax Unique Id",
          labelKey: "PT_PROPERTY_UNIQUE_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4,
          
        },
        required: false,
        pattern: /^[a-zA-Z0-9-]*$/i,
        errorMessage: "ERR_INVALID_PROPERTY_ID",
        jsonPath: "searchScreen.ids"
      }),
      existingPropertyId: getTextField({
        label: {
          labelName: "Existing Property ID",
          labelKey: "PT_EXISTING_PROPERTY_ID"
        },
        placeholder: {
          labelName: "Enter Existing Property ID",
          labelKey: "PT_EXISTING_PROPERTY_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4,
          
        },
        required: false,
        pattern: /^[a-zA-Z0-9-]*$/i,
        errorMessage: "ERR_INVALID_PROPERTY_ID",
        jsonPath: "searchScreen.oldpropertyids"
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
                color: "black",
                borderColor: "black",
                width: "220px",
                height: "48px",
                margin: "8px",
                float: "right"
              }
            },
            children: {
              buttonLabel: getLabel({
                labelName: "Reset",
                labelKey: "PT_HOME_RESET_BUTTON"
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
                labelKey: "PT_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
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
  
  
  export const searchApplicationDetails = getCommonCard({
    subHeader: getCommonTitle({
      labelName: "Search Application",
      labelKey: "SEARCH_APPLICATION"
    }),
    
    subParagraph: getCommonParagraph({
      labelName: "Provide at least one non-mandatory parameter to search for an application",
      labelKey: "PT_HOME_SEARCH_RESULTS_DESC"
    }),
    appNumberContainer: getCommonContainer({
        propertyTaxApplicationNo: getTextField({
            label: {
              labelName: "Application No",
              labelKey: "PT_PROPERTY_APPLICATION_NO"
            },
            placeholder: {
              labelName: "Enter Application No",
              labelKey: "PT_PROPERTY_APPLICATION_NO_PLACEHOLDER"
            },
            gridDefination: {
              xs: 12,
              sm: 4,
              
            },
            required: false,
            pattern: /^[a-zA-Z0-9-]*$/i,
            errorMessage: "ERR_INVALID_APPLICATION_NO",
            jsonPath: "searchScreen.ptApplicationNumber"
          }), 
      ownerMobNoProp: getTextField({
        label: {
          labelName: "Owner Mobile No.",
          labelKey: "PT_HOME_SEARCH_APP_OWN_MOB_LABEL"
        },
        placeholder: {
          labelName: "Enter your mobile No.",
          labelKey: "PT_HOME_SEARCH_RESULTS_OWN_MOB_PLACEHOLDER"
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
      applicationPropertyTaxUniqueId: getTextField({
        label: {
          labelName: "Property Tax Unique Id",
          labelKey: "PT_PROPERTY_UNIQUE_ID"
        },
        placeholder: {
          labelName: "Enter Property Tax Unique Id",
          labelKey: "PT_PROPERTY_UNIQUE_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 4,
          
        },
        required: false,
        pattern: /^[a-zA-Z0-9-]*$/i,
        errorMessage: "ERR_INVALID_PROPERTY_ID",
        jsonPath: "searchScreen.ids"
      }),
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
                color: "black",
                borderColor: "black",
                width: "220px",
                height: "48px",
                margin: "8px",
                float: "right"
              }
            },
            children: {
              buttonLabel: getLabel({
                labelName: "Reset",
                labelKey: "PT_HOME_RESET_BUTTON"
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
                labelKey: "PT_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: applicationSearch
            }
          }
        })
      })
  });
  
  export const searchProperty = getCommonContainer({
    searchPropertyDetails,
    
  });
  
  export const searchApplication = getCommonContainer({
    searchApplicationDetails
  });
  