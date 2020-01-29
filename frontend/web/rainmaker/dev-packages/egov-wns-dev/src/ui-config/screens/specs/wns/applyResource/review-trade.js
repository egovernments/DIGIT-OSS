import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

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
  labelKey: "WS_TASK_DETAILS_PROPERTY_DETAILS"
});

export const propertyLocationDetailsHeader = getHeader({
  labelKey: "WS_TASK_DETAILS_PROPERTY_LOCATION_DETAILS"
});

export const propertyOwnerDetailsHeader = getHeader({
  labelKey: "WS_TASK_DETAILS_PROPERTY_OWNER_DETAILS"
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
            labelKey: "WS_TASK_DETAILS_CONNECTION_DETAILS"
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
    viewOne: connectionDetails,
    viewTwo: getPropertyDetails,
    viewThree: propertyLocationDetails,
    viewFour: propertyOwnerDetails
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
            labelKey: "WS_TASK_DETAILS_CITY"
          },
          {
            jsonPath:
              "Licenses[0].tradeLicenseDetail.accessories[0].accessoryCategory"
          }
        ),
        reviewDoorOrHouseNumber: getLabelWithValue(
          {
            labelName: "Door/House No.",
            labelKey: "WS_TASK_DETAILS_DOOR_HOUSE_NO"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uom" }
        ),
        reviewBuildingOrColonyName: getLabelWithValue(
          {
            labelName: "Building/Colony Name",
            labelKey: "WS_TASK_DETAILS_BUILDING_COLONY_NAME"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uomValue" }
        ),
        reviewStreetName: getLabelWithValue(
          {
            labelName: "Street Name",
            labelKey: "WS_TASK_DETAILS_STREET_NAME"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].count" }
        ),
        reviewLocalityOrMohalla: getLabelWithValue(
          {
            labelName: "Locality/Mohalla",
            labelKey: "WS_TASK_DETAILS_LOCALITY_MOHALLA"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uom" }
        ),
        reviewPincode: getLabelWithValue(
          {
            labelName: "Pincode",
            labelKey: "WS_TASK_DETAILS_PINCODE"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uomValue" }
        ),
        reviewExistingPropertyId: getLabelWithValue(
          {
            labelName: "Street Name",
            labelKey: "WS_TASK_DETAILS_EXISTING_PROP_ID"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].count" }
        )
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.accessories",
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
            labelKey: "WS_PROPERTY_ID"
          },
          {
            jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
            // callBack: value => {
            //   return value.split(".")[0];
            // }
          }
        ),
        reviewPropertyType: getLabelWithValue(
          {
            labelName: "Property Type",
            labelKey: "WS_TASK_DETAILS_PROPERTY_TYPE"
          },
          {
            jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
            // callBack: value => {
            //   return value.split(".")[1];
            // }
          }
        ),
        reviewPropertyUsageType: getLabelWithValue(
          {
            labelName: "Property Usage Type",
            labelKey: "WS_TASK_DETAILS_PROPERTY_UT"
          },
          {
            jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType"
          }
        ),

        reviewPropertySubUsageType: getLabelWithValue(
          {
            labelName: "Property Sub usage type",
            labelKey: "WS_TASK_DETAILS_PROPERTY_SUT"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uom" }
        ),
        reviewPlotSize: getLabelWithValue(
          {
            labelName: "Plot Size (in sq metres)",
            labelKey: "WS_TASK_DETAILS_PLOT_SIZE"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uomValue" }
        ),
        reviewNumberOfFloors: getLabelWithValue(
          {
            labelName: "Number Of Floors",
            labelKey: "WS_TASK_DETAILS_NOF"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uomValue" }
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

const propertyOwnerDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div3: propertyOwnerDetailsHeader,
      propertyOwnerDetailsFeilds: getCommonContainer({
        reviewMobileNumber: getLabelWithValue(
          {
            labelName: "Mobile No.",
            labelKey: "WS_TASK_DETAILS_MOBILE_NO"
          },
          { jsonPath: "Licenses[0].propertyId" }
        ),
        reviewName: getLabelWithValue(
          {
            labelName: "Name",
            labelKey: "WS_TASK_DETAILS_NAME"
          },
          {
            jsonPath: "Licenses[0].tradeLicenseDetail.address.city"
          }
        ),
        reviewGender: getLabelWithValue(
          {
            labelName: "Gender",
            labelKey: "WS_TASK_DETAILS_GENDER"
          },
          {
            jsonPath: "Licenses[0].tradeLicenseDetail.address.doorNo",
            localePrefix: {
              moduleName: "COMMON",
              masterName: "GENDER"
            }
          }
        ),
        reviewDateOfBirth: getLabelWithValue(
          {
            labelName: "Date Of Birth",
            labelKey: "WS_TASK_DETAILS_DOB"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.address.buildingName" }
        ),
        reviewFatherOrHusbandName: getLabelWithValue(
          {
            labelName: "Father/Husband's Name",
            labelKey: "WS_TASK_DETAILS_FOH_NAME"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.address.street" }
        ),
        reviewRelationship: getLabelWithValue(
          {
            labelName: "Relationship",
            labelKey: "WS_TASK_DETAILS_RSHIP"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.address.locality.name" }
        ),
        reviewCorrespondenceAddress: getLabelWithValue(
          {
            labelName: "Correspondence Address",
            labelKey: "WS_TASK_DETAILS_CA"
          },
          { jsonPath: "Licenses[0].tradeLicenseDetail.address.pincode" }
        ),
        reviewSpecialApplicantCategory: getLabelWithValue(
          {
            labelName: "Special Applicant Category",
            labelKey: "WS_TASK_DETAILS_SAC"
          },
          {
            jsonPath:
              "Licenses[0].tradeLicenseDetail.additionalDetail.electricityConnectionNo"
          }
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
}

const connectionDetails = getCommonContainer({
  reviewApplicationType: getLabelWithValue(
    {
      labelName: "Apply For",
      labelKey: "WS_APPLY_FOR"
    },
    {
      jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.applicationType",
    }
  ),
  reviewOldConsumerNumber: getLabelWithValue(
    {
      labelName: "Old Consumer Number",
      labelKey: "WS_OLD_CONSUMER_NUMBER"
    },
    { jsonPath: "Licenses[0].oldConsumerNumber" }
  ),
  reviewNumberOfTaps: getLabelWithValue(
    {
      labelName: "Number Of Taps",
      labelKey: "WS_NUMBER_OF_TAPS"
    },
    {
      jsonPath: "Licenses[0].licenseType",
    }
  ),
  reviewPipeSize: getLabelWithValue(
    {
      labelName: "Pipe Size (In Inches)",
      labelKey: "WS_PIPE_SIZE"
    },
    { jsonPath: "Licenses[0].tradeName" }
  ),
  rainwaterHarvestingFacility: getLabelWithValue(
    {
      labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC",
      labelName: "Rain Water Harvesting Facility"
    },
    { jsonPath: "Licenses[0].rainWaterHarvesting" }
  )
})
