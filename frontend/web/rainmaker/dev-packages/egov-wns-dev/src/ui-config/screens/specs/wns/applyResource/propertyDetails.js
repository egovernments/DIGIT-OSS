import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getTextField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { changeStep } from "../viewBillResource/footer";

// const getHeader = label => {
//   return {
//     uiFramework: "custom-molecules-local",
//     moduleName: "egov-wns",
//     componentPath: "DividerWithLabel",
//     props: {
//       className: "hr-generic-divider-label",
//       labelProps: {},
//       dividerProps: {},
//       label
//     },
//     type: "array"
//   };
// };

// const properyDetailsHeader = getCommonSubHeader({
//   labelKey: "WS_COMMON_PROP_DETAIL_HEADER"
// });
export const propertyHeader = getCommonSubHeader({
  labelKey: "WS_COMMON_PROP_DETAIL",
  labelName: "Property Details"
})

export const propertyID = getCommonContainer({
  propertyID: getTextField({
    label: { labelKey: "WS_PROPERTY_ID_LABEL" },
    placeholder: { labelKey: "WS_PROPERTY_ID_PLACEHOLDER" },
    gridDefination: { xs: 12, sm: 6, md: 6 },
    required: true,
    title: {
      value: "Fill the form by searching your old approved trade license",
      // key: "TL_OLD_TL_NO"
    },
    pattern: /^[a-zA-Z0-9-]*$/i,
    errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    jsonPath: "searchScreen.oldConnectionNumber",
  }),
  searchButton: {
    componentPath: "Button",
    gridDefination: { xs: 12, sm: 6, md: 6 },
    props: {
      variant: "contained",
    style: {
        color: "white",
        margin: "8px",
        backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
        borderRadius: "2px",
        width: "30%",
        height: "32px"
      }
    },
    children: {
      buttonLabel: getLabel({
        labelKey: "WS_SEARCH_CONNECTION_SEARCH_BUTTON"
      })
    },
    // onClickDefination: {
    //   action: "condition",
    //   callBack: searchApiCall
    // }
  }
})

const propertyDetails = getCommonContainer({
  propertyType: getLabelWithValue(
    {
      labelKey: "WS_PROPERTY_TYPE_LABEL"
    },
    {
      jsonPath:
        "WaterConnection[0].property.propertyTypeData"
    }
  ),
  propertyUsageType: getLabelWithValue(
    {
      labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.usageCategory" }
  ),
  propertySubUsageType: getLabelWithValue(
    {
      labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL",
      labelName: "Property Sub Usage Type"
    },
    { jsonPath: "WaterConnection[0].property.usageCategory" }
  ),
  plotSize: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.landArea"
    }
  ),
  numberOfFloors: getLabelWithValue(
    {
      labelKey: "WS_PROPERTY_NO_OF_FLOOR_LABEL",
      labelName: "Number Of Floors"
    },
    { jsonPath: "WaterConnection[0].property.usageCategory" }
  ),
})



export const getPropertyIDDetails = (isEditable = true) => {
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
        },
        // editSection: {
        //   componentPath: "Button",
        //   props: {
        //     color: "primary"
        //   },
        //   visible: isEditable,
        //   gridDefination: {
        //     xs: 12,
        //     sm: 2,
        //     align: "right"
        //   },
        //   children: {
        //     editIcon: {
        //       uiFramework: "custom-atoms",
        //       componentPath: "Icon",
        //       props: {
        //         iconName: "edit"
        //       }
        //     },
        //     buttonLabel: getLabel({
        //       labelName: "Edit",
        //       labelKey: "TL_SUMMARY_EDIT"
        //     })
        //   },
        //   onClickDefination: {
        //     action: "condition",
        //     callBack: (state, dispatch) => {
        //       changeStep(state, dispatch, "", 1);
        //     }
        //   }
        // }
      }
    },
    // viewOne: properyDetailsHeader,
    viewTwo: propertyDetails,
    // viewThree: propertyLocationDetailsHeader,
    // viewFour: propertyLocationDetails
  });
};


