import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  export const propertyLocationDetails = getCommonContainer({
    city: getLabelWithValue(
      {
        labelKey: "WS_PROP_DETAIL_CITY"
      },
      {
        jsonPath: "applyScreen.property.address.city",
      }
    ),
    plotOrHouseOrSurveyNo: getLabelWithValue(
      {
        labelKey: "WS_PROP_DETAIL_DHNO",
        labelName:"Door/House No."
      },
      {
        jsonPath: "applyScreen.property.address.doorNo",
      }
    ),
    buildingOrColonyName: getLabelWithValue(
      {
        labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
      },
      {
        jsonPath: "applyScreen.property.address.buildingName"
      }
    ),
    streetName: getLabelWithValue(
      {
        labelKey: "WS_PROP_DETAIL_STREET_NAME"
      },
      {
        jsonPath: "applyScreen.property.address.street"
      }
    ),
    locality: getLabelWithValue(
      {
        labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL",
        labelName:"Locality/Mohalla"
      },
      {
        jsonPath: "applyScreen.property.address.locality.name",
      }
    ),
    pincode: getLabelWithValue(
      {
        labelKey: "WS_PROP_DETAIL_PINCODE"
      },
      { jsonPath: "applyScreen.property.address.pincode" }
    ),
   })
  
  export const getPropertyDetails = (isEditable = true) => {
    return getCommonContainer({
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
              labelKey: "WS_COMMON_PROP_LOC_DETAIL_HEADER",
              labelName:"Property Location Details"
            })
          },
        }
      },
      viewFour: propertyLocationDetails
    });
  };
  
  
  