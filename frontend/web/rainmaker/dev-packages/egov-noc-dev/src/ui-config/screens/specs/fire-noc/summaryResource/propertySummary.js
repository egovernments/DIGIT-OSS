import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hrms",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

const propertyDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "noc-summary",
    scheama: getCommonGrayCard({
      propertyContainer: getCommonContainer({
        propertyType: getLabelWithValue(
          {
            labelName: "Property Type",
            labelKey: "NOC_PROPERTY_TYPE_LABEL"
          },
          { jsonPath: "noc.buildingDetails.buildingType" }
        ),
        buildingName: getLabelWithValue(
          {
            labelName: "Name Of Building",
            labelKey: "NOC_BUILDING_NAME_LABEL"
          },
          { jsonPath: "noc.buildingDetails.building[0].buildingName" }
        ),
        buildingUsageType: getLabelWithValue(
          {
            labelName: "Building Usage Type",
            labelKey: "NOC_BUILDING_USAGE_TYPE_LABEL"
          },
          { jsonPath: "noc.buildingDetails.building[0].buildingUsageType" }
        ),
        buildingUsageSubType: getLabelWithValue(
          {
            labelName: "Building Usage Subtype",
            labelKey: "NOC_BUILDING_USAGE_SUBTYPE_LABEL"
          },
          { jsonPath: "noc.buildingDetails.building[0].buildingUsageSubType" }
        ),
        noOfFloors: getLabelWithValue(
          { labelName: "No. of Floors", labelKey: "NOC_NO_OF_FLOORS_LABEL" },
          { jsonPath: "noc.buildingDetails.building[0].noOfFloors" }
        ),
        noOfBasements: getLabelWithValue(
          {
            labelName: "No. of Basement",
            labelKey: "NOC_NO_OF_BASEMENT_LABEL"
          },
          { jsonPath: "noc.buildingDetails.building[0].noOfBasements" }
        ),
        plotSize: getLabelWithValue(
          {
            labelName: "Plot Size (in sq meters)",
            labelKey: "NOC_PLOT_SIZE_LABEL"
          },
          { jsonPath: "noc.buildingDetails.building[0].plotSize" }
        ),
        groundBuiltupArea: getLabelWithValue(
          {
            labelName: "Ground Builtup Area (sq meters)",
            labelKey: "NOC_GROUND_BUILTUP_AREA_LABEL"
          },
          { jsonPath: "noc.buildingDetails.building[0].builtupArea" }
        ),
        heightOfBuilding: getLabelWithValue(
          {
            labelName: "Height of Building (in meters)",
            labelKey: "NOC_BUILDING_HEIGHT_LABEL"
          },
          { jsonPath: "noc.buildingDetails.building[0].heightOfBuilding" }
        )
      })
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "noc.buildingDetails.building",
    prefixSourceJsonPath:
      "children.cardContent.children.propertyContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const propertyLocationDetails = getCommonGrayCard({
  propertyLocationContainer: getCommonContainer({
    propertyId: getLabelWithValue(
      {
        labelName: "Property ID",
        labelKey: "NOC_PROPERTY_ID_LABEL"
      },
      { jsonPath: "noc.address.propertyId" }
    ),
    city: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "NOC_CITY_LABEL"
      },
      { jsonPath: "noc.address.city" }
    ),
    doorHouseNo: getLabelWithValue(
      {
        labelName: "Door/House No.",
        labelKey: "NOC_DOOR_HOUSE_NO_LABEL"
      },
      { jsonPath: "noc.address.doorHouseNo" }
    ),
    buildingCompanyName: getLabelWithValue(
      {
        labelName: "Building/Company Name",
        labelKey: "NOC_BUILDING_COMPANY_NAME_LABEL"
      },
      { jsonPath: "noc.address.buildingName" }
    ),
    streetName: getLabelWithValue(
      { labelName: "Street Name", labelKey: "NOC_STREET_NAME_LABEL" },
      { jsonPath: "noc.address.street" }
    ),
    mohalla: getLabelWithValue(
      {
        labelName: "Mohalla",
        labelKey: "NOC_MOHALLA_LABEL"
      },
      { jsonPath: "noc.address.mohalla" }
    ),
    pincode: getLabelWithValue(
      {
        labelName: "Pincode",
        labelKey: "NOC_PINCODE_LABEL"
      },
      { jsonPath: "noc.address.pincode" }
    ),
    locationOnMap: getLabelWithValue(
      {
        labelName: "Location On Map",
        labelKey: "NOC_LOCATION_ON_MAP_LABEL"
      },
      { jsonPath: "noc.address.latitude" }
    ),
    applicableFireStation: getLabelWithValue(
      {
        labelName: "Applicable Fire Station",
        labelKey: "NOC_APPLICABLE_FIRE_STATION_LABEL"
      },
      { jsonPath: "noc.address.additionalDetail.fireStation" }
    )
  })
});

export const propertySummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Property Details",
          labelKey: "NOC_PROPERTY_DETAILS_HEADER"
        })
      },
      editSection: {
        componentPath: "Button",
        props: {
          color: "primary",
          style: {
            marginTop: "-10px",
            marginRight: "-18px"
          }
        },
        gridDefination: {
          xs: 4,
          align: "right"
        },
        children: {
          editIcon: {
            uiFramework: "custom-atoms",
            componentPath: "Icon",
            props: {
              iconName: "edit"
            }
          },
          buttonLabel: getLabel({
            labelName: "Edit",
            labelKey: "TL_SUMMARY_EDIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            gotoApplyWithStep(state, dispatch, 1);
          }
        }
      }
    }
  },
  propertyDetailsHeader: getHeader("Property Details"),
  break: getBreak(),
  cardOne: propertyDetails,
  propertyLocationDetailsHeader: getHeader("Property Location Details"),
  cardTwo: propertyLocationDetails
});
