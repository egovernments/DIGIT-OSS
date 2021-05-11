import {
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getTextField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { httpRequest } from "../../../../../ui-utils/api";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";


export const propertyLocationDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Mutation Details",
      labelKey: "PT_COMMON_PROPERTY_LOCATION_DETAILS"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  propertyLocationDetailsContainer: getCommonContainer({
    city: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "AutosuggestContainer",
      jsonPath: "Property.address.city",
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        optionLabel: "name",
        optionValue: "code",
        className: "hr-generic-selectfield autocomplete-dropdown",
        label: {
          labelKey: "PT_COMMON_CITY",
          labelName: "City"
        },
        placeholder: {
          labelKey: "PT_COMMON_CITY_PLACEHOLDER",
          labelName: "Select City"
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        required: true,
        isClearable: true,
        labelsFromLocalisation: true,
        inputLabelProps: {
          shrink: true
        },
        sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
        jsonPath: "Property.address.city",//db sake
      },
      required: true,
      gridDefination: {
        xs: 12,
        sm: 6
      },
      beforeFieldChange: async (action, state, dispatch) => {
        //Below only runs for citizen - not required here in employee
        dispatch(fetchLocalizationLabel(getLocale(), action.value, action.value));

        dispatch(
          prepareFinalObject(
            "Property.address.city",
            action.value
          )
        );
        try {
          let payload = await httpRequest(
            "post",
            "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
            "_search",
            [{ key: "tenantId", value: action.value }],
            {}
          );
          const mohallaData =
            payload &&
            payload.TenantBoundary[0] &&
            payload.TenantBoundary[0].boundary &&
            payload.TenantBoundary[0].boundary.reduce((result, item) => {
              result.push({
                ...item,
                name: `${action.value
                  .toUpperCase()
                  .replace(
                    /[.]/g,
                    "_"
                  )}_REVENUE_${item.code
                    .toUpperCase()
                    .replace(/[._:-\s\/]/g, "_")}`
              });
              return result;
            }, []);
          dispatch(
            prepareFinalObject(
              "applyScreenMdmsData.tenant.localities",
              mohallaData
            )
          );
          dispatch(
            handleField(
              "register-property",
              "components.div.children.formwizardFirstStep.children.propertyLocationDetails.children.cardContent.children.propertyLocationDetailsContainer.children.localityOrMohalla",
              "props.suggestions",
              mohallaData
            )
          );
          const mohallaLocalePrefix = {
            moduleName: action.value,
            masterName: "REVENUE"
          };
          dispatch(
            handleField(
              "register-property",
              "components.div.children.formwizardFirstStep.children.propertyLocationDetails.children.cardContent.children.propertyLocationDetailsContainer.children.localityOrMohalla",
              "props.localePrefix",
              mohallaLocalePrefix
            )
          );
        } catch (e) {
          console.log(e);
        }
      }
    },
    localityOrMohalla: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "AutosuggestContainer",
      jsonPath: "Property.address.locality.code",//db sake
      required: true,
      props: {
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: {
          labelName: "Locality/Mohalla",
          labelKey: "PT_COMMON_LOCALITY_OR_MOHALLA"
        },
        placeholder: {
          labelName: "Enter Mohalla",
          labelKey: "PT_COMMON_LOCALITY_OR_MOHALLA_PLACEHOLDER"
        },
        jsonPath: "Property.address.locality.code",//db sake
        sourceJsonPath: "applyScreenMdmsData.tenant.localities",
        labelsFromLocalisation: true,
        suggestions: [],
        fullwidth: true,
        isClearable: true,
        inputLabelProps: {
          shrink: true
        },

      },
      gridDefination: {
        xs: 12,
        sm: 6,
      },
    },

    doorNo: getTextField({
      label: {
        labelKey: "PT_COMMON_DOOR_NO_LABEL"
      },
      placeholder: {
        labelKey: "PT_COMMON_SEARCH_DOOR_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      required: true,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "PT_COMMON_ERR_INVALID_DOOR_NO",
      jsonPath: "Property.address.doorNo"
    }),
    buildingOrColonyName: getTextField({
      label: {
        labelKey: "PT_COMMON_BUILDING_COLONY_LABEL"
      },
      placeholder: {
        labelKey: "PT_COMMON_SEARCH_BUILDING_COLONY_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      required: true,
      pattern: /^[a-zA-Z0-9-]*$/i,
      pattern: getPattern("BuildingStreet"),
      errorMessage: "PT_COMMON_ERR_INVALID_BUILDING_COLONY",
      jsonPath: "Property.address.buildingName"
    })
  })
}, {
  style: {
    overflow: "visible"
  }
});
