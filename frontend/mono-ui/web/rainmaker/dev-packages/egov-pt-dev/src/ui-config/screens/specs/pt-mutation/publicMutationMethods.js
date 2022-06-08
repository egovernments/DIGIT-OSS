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
  import { isPublicSearch } from "egov-ui-framework/ui-utils/commons";
  import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { iSearch, applicationSearch } from "./publicSearchFunctions";
  import { getTenantId, getUserInfo,getLocale } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
  import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
  import get from "lodash/get";
  import set from "lodash/set";
  // import "./index.css";
  import { getMohallaData } from "egov-ui-kit/utils/commons";
  
  export const ComponentJsonPath = {
    ulbCity:
      "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ulbCity",
    locality:
      "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.locality",
    ownerName:
      "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ownerName",
    ownerMobNo:
      "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ownerMobNo",
    propertyID:
      "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.propertyID",
      ownerName:
      "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ownerName",
      doorNo:
      "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.doorNo",
     
    };
  const applyMohallaData = (mohallaData, tenantId, dispatch) => {
    dispatch(
      prepareFinalObject("searchScreenMdmsData.tenant.localities", mohallaData)
    );
    dispatch(
      handleField(
        "public-search",
        ComponentJsonPath.locality,
        "props.data",
        mohallaData
        // payload.TenantBoundary && payload.TenantBoundary[0].boundary
      )
    );
    dispatch(
      handleField("public-search", ComponentJsonPath.locality, "props.value", "")
    );
    dispatch(
      handleField("public-search", ComponentJsonPath.locality, "props.error", false)
    );
    dispatch(
      handleField("public-search", ComponentJsonPath.locality, "isFieldValid", true)
    );
    dispatch(
      handleField("public-search", ComponentJsonPath.locality, "props.errorMessage", "")
    );
    dispatch(
      handleField("public-search", ComponentJsonPath.locality, "props.helperText", "")
    );
    dispatch(
      handleField("public-search", ComponentJsonPath.ulbCity, "props.helperText", "")
    );
    dispatch(
      handleField("public-search", ComponentJsonPath.ulbCity, "props.error", false)
    );
    dispatch(
      handleField("public-search", ComponentJsonPath.ulbCity, "props.isFieldValid", true)
    );
    dispatch(prepareFinalObject("publicSearchScreen.locality", ""));
    const mohallaLocalePrefix = {
      moduleName: tenantId,
      masterName: "REVENUE",
    };
    dispatch(
      handleField(
        "public-search",
        ComponentJsonPath.locality,
        "props.localePrefix",
        mohallaLocalePrefix
      )
    );
  };
  
  
  
  
  export const resetFields = (state, dispatch) => {
    if (process.env.REACT_APP_NAME == "Citizen" || isPublicSearch) {
      dispatch(
        handleField(
          "public-search",
          "components.div.children.searchPropertyDetails.children.cardContent.children.ulbTenantContainer.children.ulbCity",
          "props.value",
          ""
        )
      );
  
      dispatch(prepareFinalObject(
        "publicSearchScreen.tenantId",
        ''
      ))
    }
  
    dispatch(
      handleField(
        "public-search",
        "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ownerMobNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.propertyTaxUniqueId",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.existingPropertyId",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.propertyTaxApplicationNo",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.ownerMobNoProp",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        "components.div.children.iSearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.appNumberContainer.children.applicationPropertyTaxUniqueId",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.mohalla",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.houseNumber",
        "props.value",
        ""
      )
    );
    
    dispatch(prepareFinalObject(
      "publicSearchScreen.acknowledgementIds",
      ''
    ))
    dispatch(prepareFinalObject(
      "publicSearchScreen.ids",
      ''
    ))
    dispatch(prepareFinalObject(
      "publicSearchScreen.mobileNumber",
      ''
    ))
    dispatch(prepareFinalObject(
      "publicSearchScreen.oldPropertyId",
      ''
    ))
    dispatch(prepareFinalObject(
      "publicSearchScreen.locality",
      ''
    ))
    dispatch(prepareFinalObject(
      "publicSearchScreen.doorNo",
      ''
    ))
    dispatch(
      handleField(
        "public-search",
        ComponentJsonPath.ownerName,
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        ComponentJsonPath.ownerName,
        "props.error",
        false
      )
    );
    dispatch(
      handleField(
        "public-search",
        ComponentJsonPath.ownerName,
        "props.helperText",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        ComponentJsonPath.ownerName,
        "props.errorMessage",
        ""
      )
    );
    dispatch(prepareFinalObject(
      "publicSearchScreen.name",
      ''
    ))
  
    dispatch(
      handleField(
        "public-search",
        ComponentJsonPath.doorNo,
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        ComponentJsonPath.doorNo,
        "props.error",
        false
      )
    );
    dispatch(
      handleField(
        "public-search",
        ComponentJsonPath.doorNo,
        "props.helperText",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        ComponentJsonPath.doorNo,
        "props.errorMessage",
        ""
      )
    );
    dispatch(prepareFinalObject(
      "publicSearchScreen.doorNo",
      ''
    ))
  
  };
  
  
  export const citizenResetFields = (state, dispatch) => {
    
    dispatch(
      handleField(
        "public-search",
        "components.div.children.citizenSearchTabs.children.cardContent.children.appNumberContainer.children.applicationPropertyTaxUniqueId",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        "components.div.children.citizenSearchTabs.children.cardContent.children.appNumberContainer.children.ownerMobNoProp",
        "props.value",
        ""
      )
    );
    dispatch(
      handleField(
        "public-search",
        "components.div.children.citizenSearchTabs.children.cardContent.children.appNumberContainer.children.propertyTaxApplicationNo",
        "props.value",
        ""
      )
    );  
    
    dispatch(prepareFinalObject(
      "publicSearchScreen.acknowledgementIds",
      ''
    ))
    dispatch(prepareFinalObject(
      "publicSearchScreen.ids",
      ''
    ))
    dispatch(prepareFinalObject(
      "publicSearchScreen.mobileNumber",
      ''
    ))
  
  };
  export const cityChange = async (dispatch, value = "") => {
    try {
      dispatch(fetchLocalizationLabel(getLocale(), value, value));
      let payload = await httpRequest(
        "post",
        "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
        "_search",
        [{ key: "tenantId", value: value }],
        {}
      );
      const mohallaData = getMohallaData(payload, value);
      applyMohallaData(mohallaData, value, dispatch);
    } catch (e) {
      console.log(e);
    }
  }
  
  
  
  export const searchPropertyDetails = getCommonCard({
   /*  subHeader: getCommonTitle({
      labelName: "Search Property",
      labelKey: "SEARCH_PROPERTY"
    }),
  
    subParagraph: getCommonParagraph({
      labelName: "Provide at least one non-mandatory parameter to search for an application",
      labelKey: "PT_HOME_SEARCH_RESULTS_DESC"
    }), */
    selectionContainer: getCommonContainer({
      genderRadioGroup: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pt",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
     beforeFieldChange:(action, state, dispatch) => {
          dispatch(
            handleField(
              "public-search",
              "components.div.children.searchPropertyTable",
              "props.data",
              {}
            )
          );
          dispatch(
            handleField(
              "public-search",
              "components.div.children.searchPropertyTable",
              "props.rows",
              ""
            )
          );
          if(action.value==="OptionPID")
          {
            
            dispatch(
              handleField(
             "public-search",
             "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ORButton",
             "visible",
             true             
              ))
              dispatch(
              handleField(
             "public-search",
             "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.propertyTaxUniqueId",
             "visible",
             true
              ))
              dispatch(
                handleField(
               "public-search",
               "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.existingPropertyId",
               "visible",
               true
                ))
                dispatch(
                  handleField(
                 "public-search",
                 "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ownerName",
                 "props.value",
                 ""
                  ))
               dispatch(
                    handleField(
                   "public-search",
                   "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.mohalla",
                   "props.value",
                   ""
                    ))
             dispatch(
                      handleField(
                     "public-search",
                     "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.doorNo",
                     "props.value",
                     ""
                      )) 
            dispatch(
              handleField(
             "public-search",
             "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ownerName",
             "visible",
             false
              ))
           dispatch(
                handleField(
               "public-search",
               "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.mohalla",
               "visible",
             false
                ))
         dispatch(
                  handleField(
                 "public-search",
                 "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.doorNo",
                 "visible",
             false
                  ))                
           }

           if(action.value==="OptionPD")
          {

            dispatch(
              handleField(
             "public-search",
             "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ORButton",
             "visible",
             false             
              ))
            dispatch(
              handleField(
             "public-search",
             "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.propertyTaxUniqueId",
             "visible",
             false
              ))
              dispatch(
                handleField(
               "public-search",
               "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.existingPropertyId",
               "visible",
               false
                ))
              
                dispatch(
                  handleField(
                 "public-search",
                 "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.propertyTaxUniqueId",
                 "props.value",
                 ""
                  ))
                  dispatch(
                    handleField(
                   "public-search",
                   "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.existingPropertyId",
                   "props.value",
                   null
                    ))
            dispatch(
              handleField(
             "public-search",
             "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ownerName",
             "visible",
             true
              ))
            dispatch(
                handleField(
               "public-search",
               "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.mohalla",
               "visible",
               true
                ))
            dispatch(
                  handleField(
                 "public-search",
                 "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.doorNo",
                 "visible",
               true
              )) 

            }
            if(action.value==="OptionNOPID")
            {
              dispatch(
                handleField(
               "public-search",
               "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ORButton",
               "visible",
               false             
                ))
              dispatch(
                handleField(
               "public-search",
               "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.propertyTaxUniqueId",
               "visible",
               false
                ))
                dispatch(
                  handleField(
                 "public-search",
                 "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.existingPropertyId",
                 "visible",
                 false
                  ))                
               
              dispatch(
                handleField(
               "public-search",
               "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.ownerName",
               "visible",
               false
                ))
              dispatch(
                  handleField(
                 "public-search",
                 "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.mohalla",
                 "visible",
                 false
                  ))
              dispatch(
                    handleField(
                   "public-search",
                   "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.doorNo",
                   "visible",
                   false
                )) 
             
            }
        },
        jsonPath:
          "publicSearchScreen.selected",
        props: {
          label: { name: "Search Property ", key: "SEARCH_PROPERTY" },
          className: "SearchRadio",
          
          buttons: [
            {
              labelName: "I Know My Property ID",
              labelKey: "I_KNOW_MY_PROPERTYID",
              value: "OptionPID"
            },
            {
              labelName: "Property Search Using Property Details",
              labelKey: "PT_SEARCH_USING_PROPERTY_DETAILS",
              value: "OptionPD"
            },
          /*   {
              labelName: "Property Search Using Property Details",
              labelKey: "PT_SEARCH_ID_NOT_FOUND",
              value: "OptionNOPID"
            } */
         ],
         jsonPath:
              "publicSearchScreen.selected",          

          required: true,
          errorMessage: "Required",
        },
        required: true,
        type: "array"
      },
  }),
    ulbTenantContainer: getCommonContainer({      
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
          jsonPath: "publicSearchScreen.tenantId",
          sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
          className: "autocomplete-dropdown",
          labelsFromLocalisation: true,
          //required: true,
          disabled: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          isClearable: true
        },
       // required: true,
        jsonPath: "publicSearchScreen.tenantId",
        gridDefination: {
          xs: 12,
          sm: 4
        },
      beforeFieldChange: async (action, state, dispatch) => {
        let tenant = action.value;
        if (action.value) {
          cityChange(dispatch, action.value)
        }
  
        dispatch(
          handleField(
              "public-search",
              "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.propertyTaxUniqueId.props.iconObj",
              "label",
              ""
          )
        ); 
        if(process.env.REACT_APP_NAME === "Citizen" && action.value){
          
          const tenantRequestBody = {
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
                    "public-search",
                    "components.div.children.headerDiv.children.newApplicationButton",
                    "visible",
                    enableButton
                )
              );
            });
        
  
          let tenants = state.common.cities && state.common.cities;
  
          let filterTenant = tenants && tenants.filter(m=>m.key===action.value);
  
          let tenantUniqueId = filterTenant && filterTenant[0] && filterTenant[0].city && filterTenant[0].city.code;
  
           tenantUniqueId = "PT-"+tenantUniqueId+"-";
  
           dispatch(
            handleField(
                "public-search",
                "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.propertyTaxUniqueId.props.iconObj",
                "label",
                tenantUniqueId
            )
          ); 
  
        }
        else if(process.env.REACT_APP_NAME === "Employee"){
          let tenants = state.common.cities && state.common.cities;
  
          let filterTenant = tenants && tenants.filter(m=>m.key===getTenantId());
  
          let tenantUniqueId = filterTenant && filterTenant[0] && filterTenant[0].city && filterTenant[0].city.code;
  
          tenantUniqueId = "PT-"+tenantUniqueId+"-";
  
           dispatch(
            handleField(
                "public-search",
                "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.propertyTaxUniqueId.props.iconObj",
                "label",
                tenantUniqueId
            )
          );     
        }
        dispatch(fetchLocalizationLabel(getLocale(), action.value, action.value));
        if (action.value)
        {
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
                "public-search",
                "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.mohalla",
                "props.localePrefix",
                mohallaLocalePrefix
              )
            );
              dispatch(prepareFinalObject("searchScreenMdmsData.tenant.localities", mohallaData))
          }
        }
      }
      },
    }),
   iulbCityContainer: getCommonContainer({
  
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
      visible:false,
      pattern: getPattern("MobileNo"),
      jsonPath: "publicSearchScreen.mobileNumber",
      errorMessage: "ERR_INVALID_MOBILE_NUMBER"
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
      title: {
        value: "Fill the form by searching your old approved trade license",
        key: "EXISTING_PID_INFO"
      },
      infoIcon: "info_circle",
      gridDefination: {
        xs: 12,
        sm: 4,

      },
      required: false,
      pattern: /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,64}$/i,
      errorMessage: "ERR_INVALID_PROPERTY_ID",
      jsonPath: "publicSearchScreen.oldPropertyId",
      afterFieldChange: async (action, state, dispatch) => {
      if(action.value)
      {
        dispatch(
          handleField(
            "public-search",
            "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.propertyTaxUniqueId",
            "props.value",
            ""
          )
        );
      }
      }
    }),
    ORButton: getLabel({
      labelName: "Edit",
      labelKey: "OR"
    }), 
    /* message: 


    getCommonParagraph({
      labelName: 'Provide at least one non-mandatory parameter to search for property<',
      dynamicArray: ["getCurrentFinancialYear()"],
      labelKey:'PT_PID_NOT_FOUND_MESSAGE'
        
    }), */
    propertyTaxUniqueId: getTextField({
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
      iconObj: {
       // label: "PT-",
        position: "start"
      },
      afterFieldChange: async (action, state, dispatch) => {
        if(action.value)
        {
          dispatch(
            handleField(
              "public-search",
              "components.div.children.searchPropertyDetails.children.cardContent.children.iulbCityContainer.children.existingPropertyId",
              "props.value",
              ""
            )
          );
        }
        },
      required: false,
      //pattern: /^[0-9]*$/i,
      pattern: getPattern("NewPropertyID"),
      errorMessage: "ERR_SIX_INVALID_PROPERTY_ID",
      jsonPath: "publicSearchScreen.ids"  
    }),
    mohalla: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "AutosuggestContainer",
      props: {
        label: {
          labelName: "Mohalla",
          labelKey: "PT_PROPERTY_DETAILS_MOHALLA"
        },
        placeholder: {
          labelName: "Select mohalla",
          labelKey: "PT_COMMONS_SELECT_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        jsonPath: "publicSearchScreen.locality",
        sourceJsonPath: "searchScreenMdmsData.tenant.localities",
        className: "autocomplete-dropdown",
        labelsFromLocalisation: true,
        //required: true,
        isClearable: true,
        required: false,
      },
      required: false,      
      visible:false,
      jsonPath: "publicSearchScreen.locality",
      gridDefination: {
        xs: 12,
        sm: 4
      }
    },
        doorNo: getTextField({
          label: {
            labelName: "Owner Name",
            labelKey: "PT_PROPERTY_DETAILS_DOOR_NUMBER"
          },
          placeholder: {
            labelName: "Enter Property Owner Name",
            labelKey: "PT_PROPERTY_DETAILS_DOOR_NUMBER"
          },
          pattern: getPattern("DoorHouseNo"),
          errorMessage: "Invalid No",
          jsonPath: "publicSearchScreen.doorNo",
          props: {
            className: "applicant-details-error"
          },
          visible:false,   
          gridDefination: {
            xs: 12,
            sm: 4
          }
        }),           

        ownerName: getTextField({
          label: {
            labelName: "Owner Name",
            labelKey: "PT_SEARCHPROPERTY_TABEL_OWNERNAME"
          },
          visible:false,
          placeholder: {
            labelName: "Enter Property Owner Name",
            labelKey: "PT_SEARCH_OWNER_NAME_PLACEHOLDER"
          },
          pattern: getPattern("SearchOwnerName"),
          errorMessage: "Invalid Name",
          helperText:"PT_MIN_3CHAR",
          jsonPath: "publicSearchScreen.name",
          props: {
            className: "applicant-details-error"
          },
          title: {
            value: "If you are not able to find your property in English, please type in Hindi",
            key: "PT_SEACH_IN_HINDI"
          },
          infoIcon: "info_circle",
          gridDefination: {
            xs: 12,
            sm: 4
          },          

          afterFieldChange: async (action, state, dispatch) => {
            if (action.value.match(/^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{3,50}$/i)||action.value.length==0) {
              dispatch(
                handleField("propertySearch", ComponentJsonPath.ownerName, "props.error", false)
              );
              dispatch(
                handleField("propertySearch", ComponentJsonPath.ownerName, "isFieldValid", true)
              );
              dispatch(
                handleField("propertySearch", ComponentJsonPath.ownerName, "props.errorMessage", "")
              );
              }else{
              dispatch(
                handleField("propertySearch", ComponentJsonPath.ownerName, "props.error", true)
              );
              dispatch(
                handleField("propertySearch", ComponentJsonPath.ownerName, "isFieldValid", false)
              );
              dispatch(
                handleField("propertySearch", ComponentJsonPath.ownerName, "props.errorMessage",action.value.length<3? getLocaleLabels("PT_ERR_MIN3CHAR","PT_ERR_MIN3CHAR"):getLocaleLabels("PT_ERR_INVALID_TEXT","PT_ERR_INVALID_TEXT"))
              );
            }
          }
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
         callBack: iSearch
       }
     }
    })
   }),   
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
        jsonPath: "publicSearchScreen.acknowledgementIds"
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
        jsonPath: "publicSearchScreen.mobileNumber",
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
        jsonPath: "publicSearchScreen.ids"
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
  
