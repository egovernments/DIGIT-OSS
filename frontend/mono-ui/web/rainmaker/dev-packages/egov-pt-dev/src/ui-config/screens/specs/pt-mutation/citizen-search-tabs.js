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
  import { propertyApplicationSearch, applicationSearch } from "./functions";
  import { citizenResetFields } from "./mutation-methods";
  import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

  import { getTenantId, getUserInfo,getLocale } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
  import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
 
  
  const citizenSearchTabs = 
      getCommonCard({
        subHeader: getCommonTitle({
          labelName: "Search Application",
          labelKey: "SEARCH_APPLICATION"
        }),
      
        subParagraph: getCommonParagraph({
          labelName: "Provide at least one non-mandatory parameter to search for an application",
          labelKey: "PT_HOME_SEARCH_RESULTS_DESC"
        }),
        appNumberContainer: getCommonContainer({
          ulbCity: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-pt",
            componentPath: "AutosuggestContainer",
            props: {
              label: {
                labelName: "ULB/City",
                labelKey: "PT_SEARCH_ULB_CITY"
              },
              placeholder: {
                labelName: "Select ULB/City",
                labelKey: "PT_SEARCH_ULB_CITY_PLACEHOLDER"
              },
              localePrefix: {
                moduleName: "TENANT",
                masterName: "TENANTS"
              },
              jsonPath: "pASearchScreen.tenantId",
              sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
              className: "autocomplete-dropdown",
              labelsFromLocalisation: true,
              //required: true,
              disabled: process.env.REACT_APP_NAME === "Citizen" ? false : true,
              isClearable: true
            },
            disabled: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          // required: true,
            jsonPath: "pASearchScreen.tenantId",
            gridDefination: {
              xs: 12,
              sm: 4
            },
          beforeFieldChange: async (action, state, dispatch) => {
            let tenant = action.value;
           /*  if (action.value) {
              cityChange(dispatch, action.value)
            } */
      
            dispatch(
              handleField(
                  "propertyApplicationSearch",
                  "components.div.children.citizenSearchTabs.children.cardContent.children.appNumberContainer.children.appNumberContainer.children.applicationPropertyTaxUniqueId.props.iconObj",
                  "label",
                  ""
              )
            ); 
            if(process.env.REACT_APP_NAME === "Citizen" && action.value){
              
              /* const tenantRequestBody = {
                MdmsCriteria: {
                  tenantId: action.value,
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
                  let enableButton = enabledCities && enabledCities.includes(action.value)?true:false;
                dispatch(
                    handleField(
                        "propertySearch",
                        "components.div.children.headerDiv.children.newApplicationButton",
                        "visible",
                        enableButton
                    )
                  );
                });
             */
      
              let tenants = state.common.cities && state.common.cities;
      
              let filterTenant = tenants && tenants.filter(m=>m.key===action.value);
      
              let tenantUniqueId = filterTenant && filterTenant[0] && filterTenant[0].city && filterTenant[0].city.code;
      
               tenantUniqueId = "PT-"+tenantUniqueId+"-";
      
               dispatch(
                handleField(
                    "propertyApplicationSearch",
                    "components.div.children.citizenSearchTabs.children.cardContent.children.appNumberContainer.children.appNumberContainer.children.applicationPropertyTaxUniqueId.props.iconObj",
                    "label",
                    tenantUniqueId
                )
              ); 
      
            }
           /*  else if(process.env.REACT_APP_NAME === "Employee"){
              let tenants = state.common.cities && state.common.cities;
      
              let filterTenant = tenants && tenants.filter(m=>m.key===getTenantId());
      
              let tenantUniqueId = filterTenant && filterTenant[0] && filterTenant[0].city && filterTenant[0].city.code;
      
              tenantUniqueId = "PT-"+tenantUniqueId+"-";
      
               dispatch(
                handleField(
                    "propertySearch",
                    "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.propertyTaxUniqueId.props.iconObj",
                    "label",
                    tenantUniqueId
                )
              );     
            } */
            dispatch(fetchLocalizationLabel(getLocale(), action.value, action.value));

          } 
          },
          
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
            jsonPath: "pASearchScreen.acknowledgementIds",
            afterFieldChange: async (action, state, dispatch) => {
              if(action.value)
              {
                dispatch(
                  handleField(
                    "propertyApplicationSearch",
                    "components.div.children.citizenSearchTabs.children.cardContent.children.appNumberContainer.children.appNumberContainer.children.applicationPropertyTaxUniqueId",
                    "props.value",
                    ""
                  )
                );
              }
              }
          }),
          ORButton: getLabel({
            labelName: "ORButton",
            labelKey: "OR"
          }), 
          applicationPropertyTaxUniqueId: getTextField({
            label: {
              labelName: "Property Tax Unique Id",
              labelKey: "PT_PROPERTY_UNIQUE_ID"
            },
            placeholder: {
              labelName: "Enter Property Tax Unique Id",
              labelKey: "PT_PROPERTY_XXXX_ID_PLACEHOLDER"
            },
            gridDefination: {
              xs: 12,
              sm: 4,
      
            },
            required: false,
            pattern: /^[a-zA-Z0-9-]*$/i,
            errorMessage: "ERR_INVALID_PROPERTY_ID",
            jsonPath: "pASearchScreen.ids",
            afterFieldChange: async (action, state, dispatch) => {
              if(action.value)
              {
                dispatch(
                  handleField(
                    "propertyApplicationSearch",
                    "components.div.children.citizenSearchTabs.children.cardContent.children.appNumberContainer.children.appNumberContainer.children.propertyTaxApplicationNo",
                    "props.value",
                    ""
                  )
                );
              }
              }
          }),
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
                callBack: citizenResetFields
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
  
  export default citizenSearchTabs;
  