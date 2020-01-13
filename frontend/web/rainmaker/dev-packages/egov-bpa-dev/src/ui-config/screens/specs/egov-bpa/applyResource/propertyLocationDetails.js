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
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";

export const bpaLocationDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "BPA Location Details",
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
            labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
          },
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS"
          },
          optionLabel: "name",
          placeholder: { labelName: "Select City", labelKey: "TL_SELECT_CITY" },
          sourceJsonPath: "citiesByModule.TL.tenants",
          jsonPath: "BPA.address.city",
          required: true,
          props: {
            required: true,
            disabled: true
          }
        }),
        beforeFieldChange: async (action, state, dispatch) => {
          dispatch(
            prepareFinalObject(
              "BPA.address.city",
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
            dispatch(
              fetchLocalizationLabel(getLocale(), action.value, action.value)
            );
          } catch (e) {
            console.log(e);
          }
        }
      },
      // tradeLocPropertyID: getTextField({
      //   label: {
      //     labelName: "Property ID",
      //     labelKey: "TL_NEW_TRADE_DETAILS_PT_ID_LABEL"
      //   },
      //   placeholder: {
      //     labelName: "Enter Property ID",
      //     labelKey: "TL_NEW_TRADE_DETAILS_PT_ID_PLACEHOLDER"
      //   },
      //   props: {
      //     className: "textfield-enterable-selection",
      //     hide: true
      //   },
      //   iconObj: {
      //     iconName: "search",
      //     position: "end",
      //     color: "#FE7A51",
      //     onClickDefination: {
      //       action: "condition",
      //       callBack: (state, dispatch) => {
      //         geBpatDetailsFromProperty(state, dispatch);
      //       }
      //     }
      //   },
      //   title: {
      //     value:
      //       "If you have already assessed your property, then please search your property by your PAID",
      //     key: "TL_PROPERTY_ID_TOOLTIP_MESSAGE"
      //   },
      //   infoIcon: "info_circle",
      //   jsonPath: "BPA.propertyId"
      // }),

      tradeLocDoorHouseNo: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
        },
        props: {
          className: "applicant-details-error textfield-enterable-selection"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "BPA.address.doorNo"
      }),
      tradeLocBuilidingName: getTextField({
        label: {
          labelName: "Building/Colony Name",
          labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_LABEL"
        },
        props: {
          className: "applicant-details-error textfield-enterable-selection"
        },
        placeholder: {
          labelName: "Enter Building/Colony Name",
          labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_PLACEHOLDER"
        },
        pattern: getPattern("BuildingStreet"),
        jsonPath: "BPA.address.buildingName"
      }),
      tradeLocStreetName: getTextField({
        label: {
          labelName: "Street Name",
          labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_LABEL"
        },
        props: {
          className: "applicant-details-error textfield-enterable-selection"
        },
        placeholder: {
          labelName: "Enter Street Name",
          labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_PLACEHOLDER"
        },
        pattern: getPattern("BuildingStreet"),
        jsonPath: "BPA.address.street"
      }),
      tradeLocMohalla: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-tradelicence",
        componentPath: "AutosuggestContainer",
        jsonPath: "BPA.address.locality.code",
        required: true,
        props: {
          style: {
            width: "100%",
            cursor: "pointer"
          },
          label: {
            labelName: "Mohalla",
            labelKey: "TL_NEW_TRADE_DETAILS_MOHALLA_LABEL"
          },
          placeholder: {
            labelName: "Select Mohalla",
            labelKey: "TL_NEW_TRADE_DETAILS_MOHALLA_PLACEHOLDER"
          },
          jsonPath: "BPA.address.locality.code",
          sourceJsonPath: "mohalla.tenant.localities",
          labelsFromLocalisation: true,
          suggestions: [],
          fullwidth: true,
          required: true,
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
          labelKey: "TL_NEW_TRADE_DETAILS_PIN_LABEL"
        },
        props: {
          className: "applicant-details-error textfield-enterable-selection"
        },
        placeholder: {
          labelName: "Enter Pincode",
          labelKey: "TL_NEW_TRADE_DETAILS_PIN_PLACEHOLDER"
        },
        pattern: getPattern("Pincode"),
        jsonPath: "BPA.address.pincode"
      }),
      tradeLocGISCoord: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "gis-div-css textfield-enterable-selection",
          style: {
            width: "100%",
            cursor: "pointer"
          }
        },
        jsonPath: "BPA.address.latitude",
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
                labelKey: "TL_NEW_TRADE_DETAILS_GIS_CORD_LABEL"
              },
              placeholder: {
                labelName: "Select your trade location on map",
                labelKey: "TL_NEW_TRADE_DETAILS_GIS_CORD_PLACEHOLDER"
              },
              jsonPath: "BPA.address.latitude",
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
                cursor: "pointer"
              }
            })
          }
        }
      },
      // tradeLocElectricity: getTextField({
      //   label: {
      //     labelName: "Electricity Connection No.",
      //     labelKey: "TL_NEW_TRADE_DETAILS_ELEC_CON_NO_LABEL"
      //   },
      //   placeholder: {
      //     labelName: "Enter Electricity Connection No. of Trade Loaction",
      //     labelKey: "TL_NEW_TRADE_DETAILS_ELEC_CON_NO_PLACEHOLDER"
      //   },
      //   props: {
      //     className: "textfield-enterable-selection"
      //   },
      //   jsonPath:
      //     "BPA.additionalDetail.electricityConnectionNo"
      // })
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