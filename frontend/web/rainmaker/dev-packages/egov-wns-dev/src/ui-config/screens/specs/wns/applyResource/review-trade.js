import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { propertyOwnerDetails } from "../applyResource/task-owner-details";

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
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

export const propertyDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_DETAIL"
});

export const propertyLocationDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_LOC_DETAIL_HEADER"
});

export const propertyOwnerDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_OWN_DETAIL"
});

export const connectionDetailsHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_DETAILS"
});

export const getReviewConnectionDetails = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Connection Details",
            labelKey: "WS_COMMON_CONNECTION_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: { color: "primary" },
          visible: isEditable,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: { iconName: "edit" }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "WS_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            // callBack: (state, dispatch) => {
            //   changeStep(state, dispatch, "", 0);
            // }
          }
        }
      }
    },
    viewOne: getPropertyDetails,
    viewTwo: propertyLocationDetails,
    viewThree: propertyOwnerDetails(),
    viewFour: connectionDetails,
  });
};

const propertyLocationDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div1: propertyLocationDetailsHeader,
      propertyLocationDetailsContainer: getCommonContainer({
        reviewCity: getLabelWithValue(
          {
            labelName: "City",
            labelKey: "WS_PROP_DETAIL_CITY"
          },
          {
            jsonPath:
              "WaterConnection[0].property.address.city"
          }
        ),
        reviewDoorOrHouseNumber: getLabelWithValue(
          {
            labelName: "Door/House No.",
            labelKey: "WS_PROP_DETAIL_DHNO"
          },
          { jsonPath: "WaterConnection[0].property.address.doorNo" }
        ),
        reviewBuildingOrColonyName: getLabelWithValue(
          {
            labelName: "Building/Colony Name",
            labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
          },
          { jsonPath: "WaterConnection[0].property.address.buildingName" }
        ),
        reviewStreetName: getLabelWithValue(
          {
            labelName: "Street Name",
            labelKey: "WS_PROP_DETAIL_STREET_NAME"
          },
          { jsonPath: "WaterConnection[0].property.address.street" }
        ),
        reviewLocalityOrMohalla: getLabelWithValue(
          {
            labelName: "Locality/Mohalla",
            labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL"
          },
          { jsonPath: "WaterConnection[0].property.address.locality.name" }
        ),
        reviewPincode: getLabelWithValue(
          {
            labelName: "Pincode",
            labelKey: "WS_PROP_DETAIL_PINCODE"
          },
          { jsonPath: "WaterConnection[0].property.address.pincode" }
        ),
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "WaterConnection[0].property.address",
    prefixSourceJsonPath:
      "children.cardContent.children.propertyLocationDetailsContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const getPropertyDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div2: propertyDetailsHeader,
      getPropertyDetailsContainer: getCommonContainer({
        reviewPropertyId: getLabelWithValue(
          {
            labelName: "Property Id",
            labelKey: "WS_PROPERTY_ID_LABEL"
          },
          {
            jsonPath: "WaterConnection[0].property.propertyId",
            // callBack: value => {
            //   return value.split(".")[0];
            // }
          }
        ),
        reviewPropertyType: getLabelWithValue(
          {
            labelName: "Property Type",
            labelKey: "WS_PROPERTY_TYPE_LABEL"
          },
          {
            jsonPath: "WaterConnection[0].property.propertyType",
            // callBack: value => {
            //   return value.split(".")[1];
            // }
          }
        ),
        reviewPropertyUsageType: getLabelWithValue(
          {
            labelName: "Property Usage Type",
            labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
          },
          {
            jsonPath: "WaterConnection[0].property.usageCategory"
          }
        ),

        reviewPropertySubUsageType: getLabelWithValue(
          {
            labelName: "Property Sub usage type",
            labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uom" }
        ),
        reviewPlotSize: getLabelWithValue(
          {
            labelName: "Plot Size (in sq metres)",
            labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
          },
          { jsonPath: "WaterConnection[0].property.landArea" }
        ),
        reviewNumberOfFloors: getLabelWithValue(
          {
            labelName: "Number Of Floors",
            labelKey: "WS_PROPERTY_NO_OF_FLOOR_LABEL"
          },
          { jsonPath: "WaterConnection[0].property.noOfFloors" }
        ),
        rainwaterHarvestingFacility: getLabelWithValue(
          {
            labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC",
            labelName: "Rain Water Harvesting Facility"
          },
          { jsonPath: "WaterConnection[0].rainWaterHarvesting" }
        )
      })
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.getPropertyDetailsContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const connectionDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div4: connectionDetailsHeader,
      connectionDetailsFeilds: getCommonContainer({
        taskApplicationType: getLabelWithValue(
          {
            labelKey: "WS_APPLY_FOR"
          },
          {
            jsonPath: "WaterConnection[0].service",
          }
        ),
        taskOldConsumerNumber: getLabelWithValue(
          {
            labelKey: "WS_TASK_DETAILS_OLD_CONSUMER_NO"
          },
          { jsonPath: "WaterConnection[0].oldConnectionNo" }
        ),
        taskNumberOfTapsPropsed: getLabelWithValue(
          {
            labelKey: "WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TAPS_PROPOSED"
          },
          {
            jsonPath: "WaterConnection[0].proposedTaps",
          }
        ),
        taskPipeSizeProposed: getLabelWithValue(
          {
            labelKey: "WS_TASK_DETAILS_CONN_DETAIL_PIPE_SIZE_PROPOSED"
          },
          { jsonPath: "WaterConnection[0].proposedPipeSize" }
        ),
        // taskNoOfClosets: getLabelWithValue(
        //   {
        //     labelName: "No. of water closets proposed",
        //     labelKey: "WS_TASK_DETAILS_CONN_DETAIL_NO_OF_CLOSETS"
        //   },
        //   { jsonPath: "WaterConnection[0].pipeSize" }
        // ),
      })
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "WaterConnection[0]",
    prefixSourceJsonPath:
      "children.cardContent.children.getConnectionContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};