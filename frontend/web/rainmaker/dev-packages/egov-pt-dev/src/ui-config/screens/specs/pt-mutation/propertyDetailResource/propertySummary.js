import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import {
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";

const test = value => {
  value = value ? value.split(".")[0] : "";
  return value;
};

const tenantId = getQueryArg(window.location.href, "tenantId");

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-firenoc",
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
          {
            jsonPath: "FireNOCs[0].fireNOCDetails.noOfBuildings"
          }
        ),
        buildingName: getLabelWithValue(
          {
            labelName: "Name Of Building",
            labelKey: "NOC_NAME_OF_BUILDING_LABEL"
          },
          {
            jsonPath: "FireNOCs[0].fireNOCDetails.buildings[0].name"
          }
        ),
        buildingUsageType: getLabelWithValue(
          {
            labelName: "Building Usage Type",
            labelKey: "NOC_PROPERTY_DETAILS_BUILDING_USAGE_TYPE_LABEL"
          },
          {
            jsonPath: "FireNOCs[0].fireNOCDetails.buildings[0].usageType",
            callBack: test,
            localePrefix: {
              moduleName: "firenoc",
              masterName: "BuildingType"
            }
          }
        ),
        buildingUsageSubType: getLabelWithValue(
          {
            labelName: "Building Usage Subtype",
            labelKey: "NOC_PROPERTY_DETAILS_BUILDING_USAGE_SUBTYPE_LABEL"
          },
          {
            jsonPath: "FireNOCs[0].fireNOCDetails.buildings[0].usageType",
            localePrefix: {
              moduleName: "firenoc",
              masterName: "BuildingType"
            }
          }
        )
      })
    }),
    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "FireNOCs[0].fireNOCDetails.buildings",
    prefixSourceJsonPath:
      "children.cardContent.children.propertyContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const propertyLocationDetails = getCommonGrayCard({
  propertyLocationContainer: getCommonContainer({
    city: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "NOC_PROPERTY_CITY_LABEL"
      },
      {
        jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.city",
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        }
      }
    ),
    doorHouseNo: getLabelWithValue(
      {
        labelName: "Door/House No.",
        labelKey: "NOC_SUMMARY_PROPERTY__LOCATION_DOOR_HOUSE_NO_LABEL"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.doorNo" }
    ),
    buildingCompanyName: getLabelWithValue(
      {
        labelName: "Building/Company Name",
        labelKey: "NOC_PROPERTY_DETAILS_BLDG_NAME_LABEL"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.propertyDetails.address.buildingName"
      }
    ),
    streetName: getLabelWithValue(
      {
        labelName: "Street Name",
        labelKey: "NOC_PROPERTY_DETAILS_SRT_NAME_LABEL"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.street" }
    ),
    mohalla: getLabelWithValue(
      {
        labelName: "Mohalla",
        labelKey: "NOC_PROPERTY_DETAILS_MOHALLA_LABEL"
      },
      {
        jsonPath:
          "FireNOCs[0].fireNOCDetails.propertyDetails.address.locality.code",
        callBack: value => {
          return `${getTransformedLocale(tenantId)}_REVENUE_${value}`;
        }
      }
    ),
    pincode: getLabelWithValue(
      {
        labelName: "Pincode",
        labelKey: "NOC_PROPERTY_DETAILS_PIN_LABEL"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.pincode" }
    ),
    oldPropertyId: getLabelWithValue(
      {
        labelName: "Existing Property ID",
        labelKey: "PT_PROPERTY_ADDRESS_EXISTING_PID"
      },
      { jsonPath: "FireNOCs[0].fireNOCDetails.propertyDetails.address.pincode" }
    ),
 
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
          labelKey: "NOC_COMMON_PROPERTY_DETAILS"
        })
      }
    }
  },
  cardOne: propertyLocationDetails,
});
