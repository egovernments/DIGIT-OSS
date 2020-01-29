import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel,
  getDivider
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

const connectionDetailsHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_DETAILS"
});

const connectionChargeDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_LOC_DETAIL_HEADER"
});

const roadCuttingChargesHeader = getHeader({
  labelKey: "WS_COMMON_PROP_DETAIL_HEADER"
});

const activationDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_LOC_DETAIL_HEADER"
});

export const reviewConnectionType = getLabelWithValue(
  {
    labelName: "Connection Type",
    labelKey: "WS_TASK_DETAILS_CONNECTION_TYPE"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
    // callBack: value => {
    //   return value.split(".")[0];
    // }
  }
);
export const reviewNumberOfTaps = getLabelWithValue(
  {
    labelName: "No. of Taps",
    labelKey: "WS_TASK_DETAILS_NO_OF_TAPS"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.subOwnerShipCategory",
  }
);
export const reviewWaterSource = getLabelWithValue(
  {
    labelName: "Water Source",
    labelKey: "WS_TASK_DETAILS_WATER_SOURCE"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].fatherOrHusbandName"
  }
);
export const reviewWaterSubSource = getLabelWithValue(
  {
    labelName: "Water Sub Source",
    labelKey: "WS_TASK_DETAILS_WATER_SUB_SOURCE"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].relationship",
  }
);
export const reviewPipeSize = getLabelWithValue(
  {
    labelName: "Pipe Size (in inches)",
    labelKey: "WS_TASK_DETAILS_PIPE_SIZE"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
  }
);

export const reviewBillingType = getLabelWithValue(
  {
    labelName: "Billing Type",
    labelKey: "WS_TASK_DETAILS_BILLING_TYPE"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
    // callBack: convertEpochToDate
  }
);

export const reviewPlumberProvidedBy = getLabelWithValue(
  {
    labelName: "Plumber Provided By",
    labelKey: "WS_TASK_DETAILS_PLUMBER_PROVIDED_BY"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].mobileNumber"
  }
);
export const reviewPlumberLicenseNo = getLabelWithValue(
  {
    labelName: "Plumber License No.",
    labelKey: "WS_TASK_DETAILS_PLUMBER_LICENSE_NO"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].emailId"
  }
);
export const reviewPlumberName = getLabelWithValue(
  {
    labelName: "Plumber Name",
    labelKey: "WS_TASK_DETAILS_PLUMBER_NAME"
  },
  { jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].pan" }
);

export const reviewPlumberMobileNo = getLabelWithValue(
  {
    labelName: "Plumber Mobile No.",
    labelKey: "WS_TASK_DETAILS_PLUMBER_MOBILE_NO"
  },
  { jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].pan" }
);

export const reviewRoadType = getLabelWithValue(
  {
    labelName: "Road Type",
    labelKey: "WS_TASK_DETAILS_ROAD_TYPE"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
    // callBack: convertEpochToDate
  }
);

export const reviewArea = getLabelWithValue(
  {
    labelName: "Area (in sq ft)",
    labelKey: "WS_TASK_DETAILS_AREA"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].mobileNumber"
  }
);
export const reviewConnectionExecutionDate = getLabelWithValue(
  {
    labelName: "Connection Execution Date",
    labelKey: "WS_TASK_DETAILS_CONNECTION_EXC_DATE"
  },
  {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].emailId"
  }
);
export const reviewMeterId = getLabelWithValue(
  {
    labelName: "Meter ID",
    labelKey: "WS_TASK_DETAILS_METER_ID"
  },
  { jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].pan" }
);

export const reviewMeterInstallationDate = getLabelWithValue(
  {
    labelName: "Meter Installation Date",
    labelKey: "WS_TASK_DETAILS_METER_INST_DATE"
  },
  { jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].pan" }
);

export const getReviewOwner = (isEditable = true) => {
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
            labelName: "Additional Details ( To be filled by Municipal Employee)",
            labelKey: "WS_TASK_DETAILS_ADDITIONAL_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
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
              changeStep(state, dispatch, "", 1);
            }
          }
        }
      }
    },
    // viewOne: propertyDetails,
    // viewTwo: propertyLocationDetails
    viewFive: connectionDetailsHeader,
    viewSix: connectionDetails,
    viewSeven: connectionChargeDetailsHeader,
    viewEight: connectionChargeDetails,
    viewNine: roadCuttingChargesHeader,
    viewTen: roadCuttingCharges,
    viewEleven: activationDetailsHeader,
    viewTwelve: activationDetails
  })
};

const connectionDetails = getCommonContainer({
  reviewConnectionType,
  reviewNumberOfTaps,
  reviewWaterSource,
  reviewWaterSubSource,
  reviewPipeSize,
  reviewBillingType
});

const connectionChargeDetails = getCommonContainer({
  reviewPlumberProvidedBy,
  reviewPlumberLicenseNo,
  reviewPlumberName,
  reviewPlumberMobileNo
});

const roadCuttingCharges = getCommonContainer({
  reviewRoadType,
  reviewArea
});

const activationDetails = getCommonContainer({
  reviewConnectionExecutionDate,
  reviewMeterId,
  reviewMeterInstallationDate
});
