import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";

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

export const ownerDetailsInfo = getHeader({
  labelKey: "WS_OWN_DETAIL_HEADER_INFO"
})

export const propertyDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_DETAIL"
});

export const propertyLocationDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_LOC_DETAIL_HEADER"
});

export const reviewConnectionDetails = (isEditable = true) => {
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
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 0);
            }
          }
        }
      }
    },
    viewOne: getPropertyDetails,
    viewTwo: propertyLocationDetails,
    viewThree: propertyOwnerDetails(),
    viewFour: getConnectionDetails(),
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
              "applyScreen.property.address.city"
          }
        ),
        reviewDoorOrHouseNumber: getLabelWithValue(
          {
            labelName: "Door/House No.",
            labelKey: "WS_PROP_DETAIL_DHNO"
          },
          { jsonPath: "applyScreen.property.address.doorNo" }
        ),
        reviewBuildingOrColonyName: getLabelWithValue(
          {
            labelName: "Building/Colony Name",
            labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
          },
          { jsonPath: "applyScreen.property.address.buildingName" }
        ),
        reviewStreetName: getLabelWithValue(
          {
            labelName: "Street Name",
            labelKey: "WS_PROP_DETAIL_STREET_NAME"
          },
          { jsonPath: "applyScreen.property.address.street" }
        ),
        reviewLocalityOrMohalla: getLabelWithValue(
          {
            labelName: "Locality/Mohalla",
            labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL"
          },
          { jsonPath: "applyScreen.property.address.locality.name" }
        ),
        reviewPincode: getLabelWithValue(
          {
            labelName: "Pincode",
            labelKey: "WS_PROP_DETAIL_PINCODE"
          },
          { jsonPath: "applyScreen.property.address.pincode" }
        ),
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "applyScreen.property.address",
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
            jsonPath: "applyScreen.property.propertyId",
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
            jsonPath: "applyScreen.property.propertyType",
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
            jsonPath: "applyScreen.property.usageCategory"
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
          { jsonPath: "applyScreen.property.landArea" }
        ),
        reviewNumberOfFloors: getLabelWithValue(
          {
            labelName: "Number Of Floors",
            labelKey: "WS_PROPERTY_NO_OF_FLOOR_LABEL"
          },
          { jsonPath: "applyScreen.property.noOfFloors" }
        ),
        rainwaterHarvestingFacility: getLabelWithValue(
          {
            labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC",
            labelName: "Rain Water Harvesting Facility"
          },
          { jsonPath: "applyScreen.rainWaterHarvesting" }
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

export const propertyOwnerDetailsHeader = getHeader({
  labelKey: "WS_TASK_PROP_OWN_HEADER"
});

export const mobileNumber = getLabelWithValue(
  {
    labelKey: "WS_OWN_DETAIL_MOBILE_NO_LABEL"
  },
  { jsonPath: "applyScreen.property.owners[0].mobileNumber" }
)

export const name = getLabelWithValue(
  {
    labelName: "Name",
    labelKey: "WS_OWN_DETAIL_OWN_NAME_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].name"
  }
)

export const email = getLabelWithValue(
  {
    labelKey: "WS_OWN_DETAIL_OWN_EMAIL_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].emailId"
  }
)

export const gender = getLabelWithValue(
  {
    labelKey: "WS_OWN_DETAIL_GENDER_LABEL"
  },
  {
    jsonPath: "applyScreen.property.owners[0].gender",
    localePrefix: {
      moduleName: "COMMON",
      masterName: "GENDER"
    }
  }
)

export const dateOfBirth = getLabelWithValue(
  {
    labelKey: "WS_OWN_DETAIL_DOB_LABEL"
  },
  { jsonPath: "applyScreen.property.owners[0].dob" }
)

export const fatherName = getLabelWithValue(
  {
    labelKey: "WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"
  },
  { jsonPath: "applyScreen.property.owners[0].fatherOrHusbandName" }
)

export const relationship = getLabelWithValue(
  {
    labelKey: "WS_OWN_DETAIL_RELATION_LABEL"
  },
  { jsonPath: "applyScreen.property.owners[0].relationship" }
)

export const correspondenceAddress = getLabelWithValue(
  {
    labelKey: "WS_OWN_DETAIL_CROSADD"
  },
  { jsonPath: "applyScreen.property.owners[0].correspondenceAddress" }
)

export const specialApplicantCategory = getLabelWithValue(
  {
    labelKey: "WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
  },
  {
    jsonPath:
      "applyScreen.property.owners."
  }
)

const propertyOwnerDetails = () => {
  return ({
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "common-div-css search-preview",
      scheama: getCommonGrayCard({
        div3: ownerDetailsInfo,
        viewFive: getCommonContainer({
          mobileNumber,
          name,
          gender,
          dateOfBirth,
          email,
          fatherName,
          relationship,
          correspondenceAddress,
          specialApplicantCategory
        }),
      }),
      items: [],
      hasAddItem: false,
      sourceJsonPath: "applyScreen.property.owners",
      prefixSourceJsonPath: "children.cardContent.children.getpropertyOwnerDetailsContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  })
}

export const connectionDetailsHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_DETAILS"
});

export const taskApplicationType = getLabelWithValue(
  {
    labelKey: "WS_APPLY_FOR"
  },
  {
    jsonPath: "applyScreen.service",
  }
);

export const taskNumberOfTapsPropsed = getLabelWithValue(
  {
    labelKey: "WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TAPS_PROPOSED"
  },
  {
    jsonPath: "applyScreen.proposedTaps",
  })
export const taskPipeSizeProposed = getLabelWithValue(
  {
    labelKey: "WS_TASK_DETAILS_CONN_DETAIL_PIPE_SIZE_PROPOSED"
  },
  { jsonPath: "applyScreen.proposedPipeSize" })

export const taskNoOfClosets = getLabelWithValue(
  {
    labelKey: "WS_TASK_DETAILS_CONN_DETAIL_NO_OF_CLOSETS_PROPOSED"
  },
  { jsonPath: "applyScreen.proposedWaterClosets" }
);

export const taskNoOfToilets = getLabelWithValue(
  {
    labelKey: "WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TOILETS_PROPOSED"
  },
  {
    jsonPath: "applyScreen.proposedToilets"
  }
);


const getConnectionDetails = () => {
  return ({
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "common-div-css search-preview",
      scheama: getCommonGrayCard({
        div4: connectionDetailsHeader,
        serviceCardContainer: renderService()
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "applyScreen",
      prefixSourceJsonPath:
        "children.cardContent.children.getConnectionContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  });
}

export const renderService = () => {
  return getCommonContainer({
    taskApplicationType,
    taskNumberOfTapsPropsed,
    taskPipeSizeProposed,
    taskNoOfClosets,
    taskNoOfToilets
  });
}