
import {
  getCommonCard, getCommonContainer, getCommonParagraph, getCommonTitle, getLabel, getPattern, getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getMohallaData } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";
import { applicationSearch, propertySearch } from "./functions";


export const ComponentJsonPath = {
  ulbCity:
    "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
  locality:
    "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.locality",
  ownerName:
    "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerName",
  ownerMobNo:
    "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerMobNo",
  propertyID:
    "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.propertyID",
  ownerName:
  "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ownerName",
  doorNo:
  "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.doorNo",
  };

const applyMohallaData = (mohallaData, tenantId, dispatch) => {
  dispatch(
    prepareFinalObject("searchScreenMdmsData.tenant.localities", mohallaData)
  );
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.locality,
      "props.data",
      mohallaData
      // payload.TenantBoundary && payload.TenantBoundary[0].boundary
    )
  );
  dispatch(
    handleField("propertySearch", ComponentJsonPath.locality, "props.value", "")
  );
  dispatch(
    handleField("propertySearch", ComponentJsonPath.locality, "props.error", false)
  );
  dispatch(
    handleField("propertySearch", ComponentJsonPath.locality, "isFieldValid", true)
  );
  dispatch(
    handleField("propertySearch", ComponentJsonPath.locality, "props.errorMessage", "")
  );
  dispatch(
    handleField("propertySearch", ComponentJsonPath.locality, "props.helperText", "")
  );
  dispatch(
    handleField("propertySearch", ComponentJsonPath.ulbCity, "props.helperText", "")
  );
  dispatch(
    handleField("propertySearch", ComponentJsonPath.ulbCity, "props.error", false)
  );
  dispatch(
    handleField("propertySearch", ComponentJsonPath.ulbCity, "props.isFieldValid", true)
  );
  dispatch(prepareFinalObject("ptSearchScreen.locality", ""));
  const mohallaLocalePrefix = {
    moduleName: tenantId,
    masterName: "REVENUE",
  };
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.locality,
      "props.localePrefix",
      mohallaLocalePrefix
    )
  );
};

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
      "ptSearchScreen.tenantId",
      ''
    ))
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
        "props.isDisabled",
        false
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
        "isDisabled",
        false
      )
    );
  } else {
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
        "props.isDisabled",
        true
      )
    );
    dispatch(
      handleField(
        "propertySearch",
        "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[0].tabContent.searchPropertyDetails.children.cardContent.children.ulbCityContainer.children.ulbCity",
        "isDisabled",
        true
      )
    );
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
  dispatch(prepareFinalObject(
    "ptSearchScreen.acknowledgementIds",
    ''
  ))
  dispatch(
    handleField("propertySearch", ComponentJsonPath.ulbCity, "props.errorMessage", "")
  );

  dispatch(
    handleField("propertySearch", ComponentJsonPath.ulbCity, "props.helperText", "")
  );
  dispatch(
    handleField("propertySearch", ComponentJsonPath.ulbCity, "props.error", false)
  );
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.locality,
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.locality,
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.locality,
      "props.helperText",
      ""
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.locality,
      "props.errorMessage",
      ""
    )
  );
  dispatch(prepareFinalObject(
    "ptSearchScreen.locality",
    ''
  ))
  dispatch(prepareFinalObject(
    "ptSearchScreen.ids",
    ''
  ))
  dispatch(prepareFinalObject(
    "ptSearchScreen.mobileNumber",
    ''
  ))
  dispatch(prepareFinalObject(
    "ptSearchScreen.oldPropertyId",
    ''
  ))
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.ownerName,
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.ownerName,
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.ownerName,
      "props.helperText",
      ""
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.ownerName,
      "props.errorMessage",
      ""
    )
  );
  dispatch(prepareFinalObject(
    "ptSearchScreen.name",
    ''
  ))

  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.doorNo,
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.doorNo,
      "props.error",
      false
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.doorNo,
      "props.helperText",
      ""
    )
  );
  dispatch(
    handleField(
      "propertySearch",
      ComponentJsonPath.doorNo,
      "props.errorMessage",
      ""
    )
  );
  dispatch(prepareFinalObject(
    "ptSearchScreen.doorNo",
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
  subHeader: getCommonTitle({
    labelName: "Search Property",
    labelKey: "SEARCH_PROPERTY"
  }),

  subParagraph: getCommonParagraph({
    labelName: "Provide at least one non-mandatory parameter to search for an application",
    labelKey: "PT_HOME_SEARCH_RESULTS_DESC"
  }),
  ulbCityContainer: getCommonContainer({
    ulbCity: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "AutosuggestContainer",
      props: {
        className: "autocomplete-dropdown",
        suggestions: [],
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
        jsonPath: "ptSearchScreen.tenantId",
        sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
        labelsFromLocalisation: true,
        required: true,
        disabled: process.env.REACT_APP_NAME === "Citizen" ? false : true,
        inputLabelProps: {
          shrink: true
        }
      },
      required: true,
      jsonPath: "ptSearchScreen.tenantId",
      sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      beforeFieldChange: async (action, state, dispatch) => {
        if (action.value) {
          cityChange(dispatch, action.value)
        }
      }
    },
    locality: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "AutosuggestContainer",
      props: {
        label: {
          labelName: "Locality",
          labelKey: "PT_SEARCH_LOCALITY"
        },
        placeholder: {
          labelName: "Select Locality",
          labelKey: "PT_SEARCH_LOCALITY_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        required: true,
        labelsFromLocalisation: true,
        jsonPath: "ptSearchScreen.locality",
        sourceJsonPath: "searchScreenMdmsData.tenant.localities",
        className: "locality-dropdown autocomplete-dropdown"
      },
      required: true,
      jsonPath: "ptSearchScreen.locality",
      gridDefination: {
        xs: 12,
        sm: 4
      }
    },

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
      jsonPath: "ptSearchScreen.mobileNumber",
      errorMessage: "ERR_INVALID_MOBILE_NUMBER"
    }),
    ownerName: getTextField({
      label: {
        labelName: "Owner Name",
        labelKey: "PT_SEARCHPROPERTY_TABEL_OWNERNAME"
      },
      placeholder: {
        labelName: "Enter Property Owner Name",
        labelKey: "PT_SEARCH_OWNER_NAME_PLACEHOLDER"
      },
      pattern: getPattern("SearchOwnerName"),
      errorMessage: "Invalid Name",
      helperText:"PT_MIN_3CHAR",
      jsonPath: "ptSearchScreen.name",
      props: {
        className: "applicant-details-error"
      },
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
      jsonPath: "ptSearchScreen.ids"
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
      jsonPath: "ptSearchScreen.oldPropertyId"
    }),
    doorNo: getTextField({
      label: {
        labelName: "Owner Name",
        labelKey: "PT_SEARCHPROPERTY_TABEL_DOOR_NO"
      },
      placeholder: {
        labelName: "Enter Property Owner Name",
        labelKey: "PT_SEARCH_DOOR_NO_PLACEHOLDER"
      },
      pattern: getPattern("DoorHouseNo"),
      errorMessage: "Invalid No",
      jsonPath: "ptSearchScreen.doorNo",
      props: {
        className: "applicant-details-error"
      },
      gridDefination: {
        xs: 12,
        sm: 4
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
      jsonPath: "ptSearchScreen.acknowledgementIds"
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
      jsonPath: "ptSearchScreen.mobileNumber",
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
      jsonPath: "ptSearchScreen.ids"
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
