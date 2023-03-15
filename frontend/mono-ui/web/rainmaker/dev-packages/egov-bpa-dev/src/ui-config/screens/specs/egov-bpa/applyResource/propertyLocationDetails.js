import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "../../../../../ui-utils/api";
import { getBpaMapLocator } from "../../utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { showHideBpaMapPopup, geBpatDetailsFromProperty } from "../../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";

export const bpaLocationDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Location Details",
        labelKey: "BPA_NEW_TRADE_DETAILS_HEADER_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    bpaDetailsConatiner: getCommonContainer({
      tradeLocCity: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "BPA_CITY_LABEL"
          },
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS"
          },
          optionLabel: "name",
          placeholder: { labelName: "Select City", labelKey: "BPA_SELECT_CITY" },
          sourceJsonPath: "citiesByModule.TL.tenants",
          jsonPath: "BPA.landInfo.address.city",
          required: true,
          props: {
            required: true,
            disabled: true,
            className : "tl-trade-type"
          }
        }),
        beforeFieldChange: async (action, state, dispatch) => {
          dispatch(
            prepareFinalObject(
              "BPA.landInfo.address.city",
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
                "mohalla.tenant.localities",
                mohallaData
              )
            );
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.bpaLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
                "props.suggestions",
                mohallaData
                // payload.TenantBoundary && payload.TenantBoundary[0].boundary
              )
            );
            const mohallaLocalePrefix = {
              moduleName: action.value,
              masterName: "REVENUE"
            };
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.bpaLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
                "props.localePrefix",
                mohallaLocalePrefix
              )
            );
          } catch (e) {
          }
        }
      },
      tradeLocDoorHouseNo: getTextField({
        visible : false,
        label: {
          labelName: "Door/House No.",
          labelKey: "BPA_DETAILS_DOOR_NO_LABEL"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "BPA_DETAILS_DOOR_NO_PLACEHOLDER"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "BPA.landInfo.address.doorNo"
      }),
      tradeLocBuilidingName: getTextField({
        label: {
          labelName: "Building/Colony Name",
          labelKey: "BPA_DETAILS_BLDG_NAME_LABEL"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Building/Colony Name",
          labelKey: "BPA_DETAILS_BLDG_NAME_PLACEHOLDER"
        },
        pattern: getPattern("BuildingStreet"),
        jsonPath: "BPA.landInfo.address.buildingName"
      }),
      tradeLocStreetName: getTextField({
        label: {
          labelName: "Street Name",
          labelKey: "BPA_DETAILS_SRT_NAME_LABEL"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Street Name",
          labelKey: "BPA_DETAILS_SRT_NAME_PLACEHOLDER"
        },
        pattern: getPattern("BuildingStreet"),
        jsonPath: "BPA.landInfo.address.street"
      }),
      tradeLocMohalla: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-tradelicence",
        componentPath: "AutosuggestContainer",
        jsonPath: "BPA.landInfo.address.locality.code",
        required: true,
        props: {
          style: {
            width: "100%",
            cursor: "pointer"
          },
          label: {
            labelName: "Mohalla",
            labelKey: "BPA_DETAILS_MOHALLA_LABEL"
          },
          placeholder: {
            labelName: "Select Mohalla",
            labelKey: "BPA_DETAILS_MOHALLA_PLACEHOLDER"
          },
          jsonPath: "BPA.landInfo.address.locality.code",
          sourceJsonPath: "mohalla.tenant.localities",
          labelsFromLocalisation: true,
          suggestions: [],
          fullwidth: true,
          required: true,
          isClearable: true,
          inputLabelProps: {
            shrink: true
          }
        },
        gridDefination: {
          xs: 12,
          sm: 6
        }
      },
      tradeLocPincode: getTextField({
        label: {
          labelName: "Pincode",
          labelKey: "BPA_DETAILS_PIN_LABEL"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Pincode",
          labelKey: "BPA_DETAILS_PIN_PLACEHOLDER"
        },
        pattern: getPattern("Pincode"),
        jsonPath: "BPA.landInfo.address.pincode"
      }),
      tradeLocGISCoord: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "gis-div-css",
          style: {
            width: "100%",
            cursor: "pointer"
          }
        },
        jsonPath: "BPA.landInfo.address.geoLocation.latitude",
        onClickDefination: {
          action: "condition",
          callBack: showHideBpaMapPopup
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        children: {
          gisTextField: {
            ...getTextField({
              label: {
                labelName: "GIS Coordinates",
                labelKey: "BPA_DETAILS_GIS_CORD_LABEL"
              },
              placeholder: {
                labelName: "Select your trade location on map",
                labelKey: "BPA_DETAILS_GIS_CORD_PLACEHOLDER"
              },
              jsonPath: "BPA.landInfo.address.geoLocation.latitude",
              iconObj: {
                iconName: "gps_fixed",
                position: "end"
              },
              gridDefination: {
                xs: 12,
                sm: 12
              },
              props: {
                disabled: true,
                cursor: "pointer",
                className : "tl-trade-type"
              }
            })
          }
        }
      },

    }),
    mapsDialog: {
      componentPath: "Dialog",
      props: {
        open: false
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          children: {
            popup: getBpaMapLocator()
          }
        }
      }
    }
  },
  {
    style: { overflow: "visible" }
  }
);