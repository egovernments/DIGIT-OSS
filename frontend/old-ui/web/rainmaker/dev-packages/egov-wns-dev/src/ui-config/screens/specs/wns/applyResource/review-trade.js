import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getConnectionDetails } from './../applyResource/task-connectiondetails';
import { propertyOwnerDetails } from "../applyResource/task-owner-details";
import { convertEpochToDateAndHandleNA, handlePropertySubUsageType, handleNA } from '../../utils';

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

export const connectionDetailsHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_DETAILS"
});

export const propertyOwnerDetailsHeader = getHeader({
  labelKey: "WS_TASK_PROP_OWN_HEADER"
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
    viewThree: ownerDetails,
    viewFour: getConnectionDetails()
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
              "WaterConnection[0].property.address.city",
              callBack: handleNA
          }
        ),
        reviewDoorOrHouseNumber: getLabelWithValue(
          {
            labelName: "Door/House No.",
            labelKey: "WS_PROP_DETAIL_DHNO"
          },
          { jsonPath: "WaterConnection[0].property.address.doorNo",
          callBack: handleNA }
        ),
        reviewBuildingOrColonyName: getLabelWithValue(
          {
            labelName: "Building/Colony Name",
            labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
          },
          { jsonPath: "WaterConnection[0].property.address.buildingName",
          callBack: handleNA }
        ),
        reviewStreetName: getLabelWithValue(
          {
            labelName: "Street Name",
            labelKey: "WS_PROP_DETAIL_STREET_NAME"
          },
          { jsonPath: "WaterConnection[0].property.address.street",
          callBack: handleNA }
        ),
        reviewLocalityOrMohalla: getLabelWithValue(
          {
            labelName: "Locality/Mohalla",
            labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL"
          },
          { jsonPath: "WaterConnection[0].property.address.locality.name",
          callBack: handleNA }
        ),
        reviewPincode: getLabelWithValue(
          {
            labelName: "Pincode",
            labelKey: "WS_PROP_DETAIL_PINCODE"
          },
          { jsonPath: "WaterConnection[0].property.address.pincode",
          callBack: handleNA }
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
            callBack: handleNA
          }
        ),
        reviewPropertyType: getLabelWithValue(
          {
            labelName: "Property Type",
            labelKey: "WS_PROPERTY_TYPE_LABEL"
          },
          {
            jsonPath: "WaterConnection[0].property.propertyType",
            callBack: handleNA,
            localePrefix: {
              moduleName: "WS",
              masterName: "PROPTYPE"
            }
            
          }
        ),
        reviewPropertyUsageType: getLabelWithValue(
          {
            labelName: "Property Usage Type",
            labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
          },
          {
            jsonPath: "WaterConnection[0].property.usageCategory",
            callBack: handleNA,
            localePrefix: {
              moduleName: "WS",
              masterName: "PROPUSGTYPE"
            }        
          }
        ),

        reviewPropertySubUsageType: getLabelWithValue(
          {
            labelName: "Property Sub usage type",
            labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL"
          },
          { jsonPath: "WaterConnection[0].property.units[0].usageCategory",
            callBack: handlePropertySubUsageType,
            localePrefix: {
              moduleName: "WS",
              masterName: "PROPSUBUSGTYPE"
            }
          }
        ),
        reviewPlotSize: getLabelWithValue(
          {
            labelName: "Plot Size (in sq metres)",
            labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
          },
          { jsonPath: "WaterConnection[0].property.landArea",
          callBack: handleNA }
        ),
        reviewNumberOfFloors: getLabelWithValue(
          {
            labelName: "Number Of Floors",
            labelKey: "WS_PROPERTY_NO_OF_FLOOR_LABEL"
          },
          { jsonPath: "WaterConnection[0].property.noOfFloors",
          callBack: handleNA }
        ),
        rainwaterHarvestingFacility: getLabelWithValue(
          {
            labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC",
            labelName: "Rain Water Harvesting Facility"
          },
          { jsonPath: "WaterConnection[0].property.rainWaterHarvesting",
          callBack: handleNA }
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

const ownerDetails = {
      uiFramework: "custom-containers",
      componentPath: "MultiItem",
      props: {
        className: "common-div-css search-preview",
        scheama: getCommonGrayCard({
          div3: propertyOwnerDetailsHeader,
          propertyLocationDetailsContainer: getCommonContainer({
             mobileNumber: getLabelWithValue(
              {
                labelName: "Mobile Number",
                  labelKey: "WS_OWN_DETAIL_MOBILE_NO_LABEL"
              },
              { jsonPath: "WaterConnection[0].property.owners[0].mobileNumber",
              callBack: handleNA }
          ),
            name: getLabelWithValue(
              {
                labelName: "Name",
                labelKey: "WS_OWN_DETAIL_OWN_NAME_LABEL"
              },
              {
                jsonPath: "WaterConnection[0].property.owners[0].name",
                callBack: handleNA
              }
            ),
            email: getLabelWithValue(
              {
                labelKey: "WS_OWN_DETAIL_OWN_EMAIL_LABEL"
              },
              {
                jsonPath: "WaterConnection[0].property.owners[0].emailId",
                callBack: handleNA
              }
            ),
            gender: getLabelWithValue(
              {
                labelKey: "WS_OWN_DETAIL_GENDER_LABEL"
              },
              {
                jsonPath: "WaterConnection[0].property.owners[0].gender",
                callBack: handleNA,
                localePrefix: {
                  moduleName: "COMMON",
                  masterName: "GENDER"
                }
              }
            ),
            dateOfBirth: getLabelWithValue(
              {
                labelName: "Date Of Birth",
                labelKey: "WS_OWN_DETAIL_DOB_LABEL"
              },
              {
                jsonPath: "WaterConnection[0].property.owners[0].dob",
                callBack: convertEpochToDateAndHandleNA
              }
            ),
            fatherName: getLabelWithValue(
              {
                labelKey: "WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"
              },
              { jsonPath: "WaterConnection[0].property.owners[0].fatherOrHusbandName",
              callBack: handleNA }
            ),
            relationship: getLabelWithValue(
              {
                labelKey: "WS_OWN_DETAIL_RELATION_LABEL"
              },
              { jsonPath: "WaterConnection[0].property.owners[0].relationship",
              callBack: handleNA }
            ),
            correspondenceAddress: getLabelWithValue(
              {
                labelKey: "WS_OWN_DETAIL_CROSADD"
              },
              { jsonPath: "WaterConnection[0].property.owners[0].correspondenceAddress",
              callBack: handleNA }
            ), specialApplicantCategory: getLabelWithValue(
              {
                labelKey: "WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
              },
              {
                jsonPath: "WaterConnection[0].property.owners[0].ownerType",
                callBack: handleNA
              })
          })
        }),

        items: [],
        hasAddItem: false,
        isReviewPage: true,
        sourceJsonPath: "WaterConnection[0].property.owners",
        prefixSourceJsonPath:
          "children.cardContent.children.propertyLocationDetailsContainer.children",
        afterPrefixJsonPath: "children.value.children.key"
      },
      type: "array"
}

