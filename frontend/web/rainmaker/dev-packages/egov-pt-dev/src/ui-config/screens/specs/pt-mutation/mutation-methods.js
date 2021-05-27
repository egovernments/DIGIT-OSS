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
import { propertySearch, applicationSearch } from "./functions";
import { getTenantId, getUserInfo,getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
// import "./index.css";


export const resetFields = (state, dispatch) => {
  if (process.env.REACT_APP_NAME == "Citizen") {
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
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
  dispatch(
    handleField(
      "propertySearch",
      "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.mohalla",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.houseNumber",
      "props.value",
      ""
    )
  );
  
  dispatch(prepareFinalObject(
    "searchScreen.acknowledgementIds",
    ''
  ))
  dispatch(prepareFinalObject(
    "searchScreen.ids",
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
  dispatch(prepareFinalObject(
    "searchScreen.locality",
    ''
  ))
  dispatch(prepareFinalObject(
    "searchScreen.doorNo",
    ''
  ))

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
        labelName: "City",
        labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_CITY"
      },
      placeholder: {
        labelName: "Select City",
        labelKey: "PT_COMMON_HOME_SEARCH_RESULTS_CITY_PLACEHOLDER"
      },
      localePrefix: {
        moduleName: "TENANT",
        masterName: "TENANTS"
      },
      jsonPath: "searchScreen.tenantId",
      sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
      required: true,
      props: {
        required: true,
        disabled: process.env.REACT_APP_NAME === "Citizen" ? false : true,
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
    beforeFieldChange: async (action, state, dispatch) => {
      let tenant = action.value;
      if(process.env.REACT_APP_NAME === "Citizen" && action.value){
        
        const tenantRequestBody = {
          MdmsCriteria: {
            tenantId: getTenantId(),
            moduleDetails: [
              {
                moduleName: "tenant",
                masterDetails: [
                  {
                    name: "citywiseconfig",
                    filter: "[?(@.config=='assessmentEnabledCities')]"
                  }
                ]
              }
            ]
          },
        };
        let citywiseconfig = httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            tenantRequestBody
        ).then(res => {         
            citywiseconfig:res.MdmsRes.tenant.citywiseconfig
            let enabledCities = res.MdmsRes && res.MdmsRes.tenant && res.MdmsRes.tenant.citywiseconfig && res.MdmsRes.tenant.citywiseconfig[0].enabledCities && res.MdmsRes.tenant.citywiseconfig[0].enabledCities;
            let enableButton = enabledCities && enabledCities.includes(action.value);
          dispatch(
              handleField(
                  "propertySearch",
                  "components.div.children.headerDiv.children.newApplicationButton",
                  "visible",
                  enableButton
              )
            );
          });
      

        let tenants = state.common.cities && state.common.cities;

        let filterTenant = tenants && tenants.filter(m=>m.key===action.value);

        let tenantUniqueId = filterTenant && filterTenant[0] && filterTenant[0].city && filterTenant[0].city.code;

         tenantUniqueId = "PT-"+tenantUniqueId;

         dispatch(
          handleField(
              "propertySearch",
              "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId.props.iconObj",
              "label",
              tenantUniqueId
          )
        ); 

      }
      else if(process.env.REACT_APP_NAME === "Employee"){
        let tenants = state.common.cities && state.common.cities;

        let filterTenant = tenants && tenants.filter(m=>m.key===getTenantId());

        let tenantUniqueId = filterTenant && filterTenant[0] && filterTenant[0].city && filterTenant[0].city.code;

         tenantUniqueId = "PT-"+tenantUniqueId;

         dispatch(
          handleField(
              "propertySearch",
              "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyTaxUniqueId.props.iconObj",
              "label",
              tenantUniqueId
          )
        );     
      }
      dispatch(fetchLocalizationLabel(getLocale(), action.value, action.value));
      let mohallaPayload = await httpRequest(
        "post",
        "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
        "_search",
        [{ key: "tenantId", value: tenant }],
        {}
      );
      if(mohallaPayload &&
        mohallaPayload.TenantBoundary[0] &&
        mohallaPayload.TenantBoundary[0].boundary){
          const mohallaData =
          mohallaPayload.TenantBoundary[0].boundary.reduce((result, item) => {
            result.push({
              ...item,
              code: item.code
            });
            return result;
          }, []);
          const mohallaLocalePrefix = {
            moduleName: action.value,
            masterName: "REVENUE"
          };
          dispatch(
            handleField(
              "propertySearch",
              "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.mohalla",
              "props.localePrefix",
              mohallaLocalePrefix
            )
          );
            dispatch(prepareFinalObject("searchScreenMdmsData.tenant.localities", mohallaData))
        }
      
    },
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
      iconObj: {
       // label: "PT-",
        position: "start"
      },
      required: false,
      //pattern: /^[0-9]*$/i,
      pattern: getPattern("NewPropertyID"),
      errorMessage: "ERR_SIX_INVALID_PROPERTY_ID",
      jsonPath: "searchScreen.ids"  
    }),
    mohalla: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "AutosuggestContainer",
      props: {
        className: "autocomplete-dropdown autocomplete-mohalla",
        suggestions: [],
        label: {
          labelName: "Mohalla",
          labelKey: "PT_PROPERTY_DETAILS_MOHALLA"
        },
        placeholder: {
          labelName: "Select mohala",
          labelKey: "PT_COMMONS_SELECT_PLACEHOLDER"
        },
        localePrefix: {
          moduleName:getTenantId(),
          masterName: "REVENUE"
        },
        jsonPath: "searchScreen.locality",
        sourceJsonPath: "searchScreenMdmsData.tenant.localities",
        labelsFromLocalisation: true,
        required: true,
        isClearable: true,
        disabled: process.env.REACT_APP_NAME === "Citizen" ? false : true,
        inputLabelProps: {
          shrink: true
        }
      },
      // required: true,
      jsonPath: "searchScreen.locality",
      sourceJsonPath: "searchScreenMdmsData.tenant.localities",
      gridDefination: {
        xs: 12,
        sm: 4
      }
    },
    houseNumber: getTextField({
      label: {
        labelName: "House/Shop No.",
        labelKey: "PT_PROPERTY_DETAILS_DOOR_NUMBER"
      },
      placeholder: {
        labelName: "Enter House no.",
        labelKey: "PT_PROPERTY_DETAILS_DOOR_NUMBER"
      },
      gridDefination: {
        xs: 12,
        sm: 4,
        
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_INVALID_PROPERTY_ID",
      jsonPath: "searchScreen.doorNo"
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
      pattern: /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,64}$/i,
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
      jsonPath: "searchScreen.acknowledgementIds"
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
        labelKey: "PT_APP_PROPERTY_UNIQUE_ID"
      },
      placeholder: {
        labelName: "Enter Property Tax Unique Id",
        labelKey: "PT_APP_PROPERTY_UNIQUE_ID_PLACEHOLDER"
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