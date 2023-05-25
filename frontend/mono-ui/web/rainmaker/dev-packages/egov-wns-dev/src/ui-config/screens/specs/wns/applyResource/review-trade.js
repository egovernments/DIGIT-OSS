import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabelWithValueForModifiedLabel,
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
    viewFour: getConnectionDetails(),
    viewFive:taskConnHolderDetailsSummary(),
    viewSix:connHolderDetailsSameAsOwnerSummary()

  });
};

export const locationDetails={
  reviewCity: getLabelWithValueForModifiedLabel(
    {
      labelName: "City",
      labelKey: "WS_PROP_DETAIL_CITY"
    },
    {
      jsonPath:
        "WaterConnection[0].property.address.city",
        callBack: handleNA
    },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].property.address.city", callBack: handleNA },
  ),
  reviewDoorOrHouseNumber: getLabelWithValueForModifiedLabel(
    {
      labelName: "Door/House No.",
      labelKey: "WS_PROP_DETAIL_DHNO"
    },
    { jsonPath: "WaterConnection[0].property.address.doorNo",
    callBack: handleNA },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].property.address.doorNo", callBack: handleNA },
  ),
  reviewBuildingOrColonyName: getLabelWithValueForModifiedLabel(
    {
      labelName: "Building/Colony Name",
      labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.address.buildingName",
    callBack: handleNA },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].property.address.buildingName", callBack: handleNA },
  ),
  reviewStreetName: getLabelWithValueForModifiedLabel(
    {
      labelName: "Street Name",
      labelKey: "WS_PROP_DETAIL_STREET_NAME"
    },
    { jsonPath: "WaterConnection[0].property.address.street",
    callBack: handleNA },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].property.address.street", callBack: handleNA },
  ),
  reviewLocalityOrMohalla: getLabelWithValueForModifiedLabel(
    {
      labelName: "Locality/Mohalla",
      labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.address.locality.name",
    callBack: handleNA },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].property.locality.name", callBack: handleNA },
  ),
  reviewPincode: getLabelWithValueForModifiedLabel(
    {
      labelName: "Pincode",
      labelKey: "WS_PROP_DETAIL_PINCODE"
    },
    { jsonPath: "WaterConnection[0].property.address.pincode",
    callBack: handleNA },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].property.address.pincode", callBack: handleNA },
  ),
}

const propertyLocationDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div1: propertyLocationDetailsHeader,
      propertyLocationDetailsContainer: getCommonContainer(locationDetails)
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

export const propertyDetails={
  reviewPropertyId: getLabelWithValueForModifiedLabel(
    {
      labelName: "Property Id",
      labelKey: "WS_PROPERTY_ID_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.propertyId",
      callBack: handleNA
    },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].property.propertyId", callBack: handleNA },
  ),
  reviewPropertyType: getLabelWithValueForModifiedLabel(
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
      
    },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.propertyType",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPTYPE"
      }
      
    },
  ),
  reviewPropertyUsageType: getLabelWithValueForModifiedLabel(
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
    },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.usageCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPUSGTYPE"
      }
      
    }
  ),

  reviewPropertySubUsageType: getLabelWithValueForModifiedLabel(
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
    },{
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.units[0].usageCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPSUBUSGTYPE"
      }
      
    }
  ),
  reviewPlotSize: getLabelWithValueForModifiedLabel(
    {
      labelName: "Plot Size (in sq metres)",
      labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.landArea",
    callBack: handleNA },{
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.landArea",
      callBack: handleNA      
    }
  ),
  reviewNumberOfFloors: getLabelWithValueForModifiedLabel(
    {
      labelName: "Number Of Floors",
      labelKey: "WS_PROPERTY_NO_OF_FLOOR_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.noOfFloors",
    callBack: handleNA },{
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.noOfFloors",
      callBack: handleNA      
    }
  ),
  rainwaterHarvestingFacility: getLabelWithValueForModifiedLabel(
    {
      labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC",
      labelName: "Rain Water Harvesting Facility"
    },
    { jsonPath: "WaterConnection[0].property.additionalDetails.isRainwaterHarvesting",
    callBack: handleNA },{
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.additionalDetails.isRainwaterHarvesting",
      callBack: handleNA      
    }
  )
}

const getPropertyDetails = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "common-div-css search-preview",
    scheama: getCommonGrayCard({
      div2: propertyDetailsHeader,
      getPropertyDetailsContainer: getCommonContainer(propertyDetails)
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

export const propertyOwnerDetail={
  mobileNumber: getLabelWithValue(
   {
     labelName: "Mobile Number",
       labelKey: "WS_OWN_DETAIL_MOBILE_NO_LABEL"
   },
   { jsonPath: "WaterConnection[0].property.owners[0].mobileNumber",
   callBack: handleNA },  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "WaterConnectionOld[0].property.owners[0].mobileNumber", callBack: handleNA },
),
 name: getLabelWithValue(
   {
     labelName: "Name",
     labelKey: "WS_OWN_DETAIL_OWN_NAME_LABEL"
   },
   {
     jsonPath: "WaterConnection[0].property.owners[0].name",
     callBack: handleNA
   },  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "WaterConnectionOld[0].property.owners[0].name", callBack: handleNA },
 ),
 email: getLabelWithValue(
   {
     labelKey: "WS_OWN_DETAIL_OWN_EMAIL_LABEL"
   },
   {
     jsonPath: "WaterConnection[0].property.owners[0].emailId",
     callBack: handleNA
   },  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "WaterConnectionOld[0].property.owners[0].emailId", callBack: handleNA },
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
   },  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "WaterConnectionOld[0].property.owners[0].gender", callBack: handleNA },
 ),
 dateOfBirth: getLabelWithValue(
   {
     labelName: "Date Of Birth",
     labelKey: "WS_OWN_DETAIL_DOB_LABEL"
   },
   {
     jsonPath: "WaterConnection[0].property.owners[0].dob",
     callBack: convertEpochToDateAndHandleNA
   },  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "WaterConnectionOld[0].property.owners[0].dob", callBack: handleNA },
 ),
 fatherName: getLabelWithValue(
   {
     labelKey: "WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME"
   },
   { jsonPath: "WaterConnection[0].property.owners[0].fatherOrHusbandName",
   callBack: handleNA },  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "WaterConnectionOld[0].property.owners[0].fatherOrHusbandName", callBack: handleNA },
 ),
 relationship: getLabelWithValue(
   {
     labelKey: "WS_OWN_DETAIL_RELATION_LABEL"
   },
   { jsonPath: "WaterConnection[0].property.owners[0].relationship",
   callBack: handleNA },  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "WaterConnectionOld[0].property.owners[0].relationship", callBack: handleNA },
 ),
 correspondenceAddress: getLabelWithValue(
   {
     labelKey: "WS_OWN_DETAIL_CROSADD"
   },
   { jsonPath: "WaterConnection[0].property.owners[0].correspondenceAddress",
   callBack: handleNA },  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "WaterConnectionOld[0].property.owners[0].correspondenceAddress", callBack: handleNA },
 ), specialApplicantCategory: getLabelWithValue(
   {
     labelKey: "WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
   },
   {
     jsonPath: "WaterConnection[0].property.owners[0].ownerType",
     localePrefix: {
      moduleName: "COMMON_MASTERS",
      masterName: "OWNERTYPE"
    },
     callBack: handleNA
   },  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  { jsonPath: "WaterConnectionOld[0].property.owners[0].ownerType",localePrefix: { moduleName: "COMMON_MASTERS",masterName: "OWNERTYPE"}, callBack: handleNA },)
}

const ownerDetails = {
      uiFramework: "custom-containers",
      componentPath: "MultiItem",
      props: {
        className: "common-div-css search-preview",
        scheama: getCommonGrayCard({
          div3: propertyOwnerDetailsHeader,
          propertyLocationDetailsContainer: getCommonContainer(propertyOwnerDetail)
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
const holderHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
  labelName: "Connection Holder Details"
})

export const connectionHolderDetails={
  mobileNumber : getLabelWithValue(
     {
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_LABEL"
     },
     { jsonPath: "WaterConnection[0].connectionHolders[0].mobileNumber", callBack: handleNA },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].connectionHolders[0].mobileNumber", callBack: handleNA },
   ),
    name : getLabelWithValue(
     {
       labelName: "Name",
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_OWN_NAME_LABEL"
     },
     { jsonPath: "WaterConnection[0].connectionHolders[0].name", callBack: handleNA },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].connectionHolders[0].name", callBack: handleNA },
   ),
    gender : getLabelWithValue(
     {
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_GENDER_LABEL"
     },
     {
       jsonPath: "WaterConnection[0].connectionHolders[0].gender",
       callBack: handleNA
     },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].connectionHolders[0].gender", callBack: handleNA },
   ),
    fatherName : getLabelWithValue(
     {
       labelKey: "WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME"
     },
     { jsonPath: "WaterConnection[0].connectionHolders[0].fatherOrHusbandName", callBack: handleNA },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].connectionHolders[0].fatherOrHusbandName", callBack: handleNA },
   ),
    relationship : getLabelWithValue(
     {
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL"
     },
     { jsonPath: "WaterConnection[0].connectionHolders[0].relationship", callBack: handleNA },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].connectionHolders[0].relationship", callBack: handleNA },
   ),
    correspondenceAddress :getLabelWithValue(
     {
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_CROSADD"
     },
     {
       jsonPath: "WaterConnection[0].connectionHolders[0].correspondenceAddress",
       callBack: handleNA
     },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].connectionHolders[0].correspondenceAddress", callBack: handleNA },
   ),
    specialApplicantCategory : getLabelWithValue(
     {
       labelKey: "WS_CONN_HOLDER_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
     },
     {
       jsonPath: "WaterConnection[0].connectionHolders[0].ownerType",
       callBack: handleNA
     },  {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].connectionHolders[0].ownerType", callBack: handleNA },
   )
 };
const taskConnHolderDetailsSummary = () => {
  return ({
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "common-div-css search-preview",
      scheama: getCommonGrayCard({
        div4: holderHeader,
        connHoldDetail:getCommonContainer(connectionHolderDetails)
      }),
      items: [],
      hasAddItem: false,
      sourceJsonPath: "WaterConnection[0].connectionHolders",
      prefixSourceJsonPath: "children.cardContent.children.connHoldDetail.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  })
}


export const connectionHolderSameAsOwnerDetails={
 sameAsOwnerDetails : getLabelWithValue(
    {
      labelKey: "WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS"
    },
    { jsonPath: "WaterConnection[0].connectionHolders[0].sameAsPropertyAddress" }
  )
} 

const connHolderDetailsSameAsOwnerSummary = () => {
  return ({
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "common-div-css search-preview",
      scheama: getCommonGrayCard({
        div4: holderHeader,
        sameAsOwnerDetails:getCommonContainer(connectionHolderSameAsOwnerDetails),
      }),
      items: [],
      hasAddItem: false,
      sourceJsonPath: "WaterConnection[0].connectionHolders[0].sameAsPropertyAddress",
      prefixSourceJsonPath: "children.cardContent.children.sameAsOwnerDetails.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  })
}

