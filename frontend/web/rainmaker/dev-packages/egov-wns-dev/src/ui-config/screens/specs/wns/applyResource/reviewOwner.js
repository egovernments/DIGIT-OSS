import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel,
  getDivider
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDate } from '../../utils';
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

const connectionDetailsHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_DETAILS"
});

const connectionChargeDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PLUMBER_DETAILS"
});

const roadCuttingChargesHeader = getHeader({
  labelKey: "WS_ROAD_CUTTING_CHARGE_DETAILS"
});

const activationDetailsHeader = getHeader({
  labelKey: "WS_ACTIVATION_DETAILS"
});

export const reviewConnectionType = getLabelWithValue(
  {
    labelName: "Connection Type",
    labelKey: "WS_SERV_DETAIL_CONN_TYPE"
  },
  {
    jsonPath: "applyScreen.connectionType",
    // callBack: value => {
    //   return value.split(".")[0];
    // }
  }
);
export const reviewNumberOfTaps = getLabelWithValue(
  {
    labelName: "No. of Taps",
    labelKey: "WS_SERV_DETAIL_NO_OF_TAPS"
  },
  {
    jsonPath: "applyScreen.noOfTaps",
  }
);
export const reviewWaterSource = getLabelWithValue(
  {
    labelName: "Water Source",
    labelKey: "WS_SERV_DETAIL_WATER_SOURCE"
  },
  {
    jsonPath: "applyScreen.waterSource"
  }
);
export const reviewWaterSubSource = getLabelWithValue(
  {
    labelName: "Water Sub Source",
    labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE"
  },
  {
    jsonPath: "applyScreen.waterSubSource",
  }
);
export const reviewPipeSize = getLabelWithValue(
  {
    labelName: "Pipe Size (in inches)",
    labelKey: "WS_SERV_DETAIL_PIPE_SIZE"
  },
  {
    jsonPath: "applyScreen.pipeSize",
  }
);

export const reviewWaterClosets = getLabelWithValue(
  {
    labelName: "No. of Water Closets",
    labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS"
  },
  {
    jsonPath: "applyScreen.waterClosets",
  }
);

export const reviewNumberOfToilets = getLabelWithValue(
  {
    labelName: "No. of Water Closets",
    labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS"
  },
  {
    jsonPath: "applyScreen.noOfToilets",
  }
);

export const reviewPlumberProvidedBy = getLabelWithValue(
  {
    labelName: "Plumber Provided By",
    labelKey: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY"
  },
  {
    jsonPath: "applyScreen.plumberInfo[0].detailsProvidedBy"
  }
);
export const reviewPlumberLicenseNo = getLabelWithValue(
  {
    labelName: "Plumber License No.",
    labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"
  },
  {
    jsonPath: "applyScreen.plumberInfo[0].licenseNo"
  }
);
export const reviewPlumberName = getLabelWithValue(
  {
    labelName: "Plumber Name",
    labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"
  },
  { jsonPath: "applyScreen.plumberInfo[0].name" }
);

export const reviewPlumberMobileNo = getLabelWithValue(
  {
    labelName: "Plumber Mobile No.",
    labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"
  },
  {
    jsonPath: "applyScreen.plumberInfo[0].mobileNumber"
  }
);

export const reviewRoadType = getLabelWithValue(
  {
    labelName: "Road Type",
    labelKey: "WS_ADDN_DETAIL_ROAD_TYPE"
  },
  {
    jsonPath: "applyScreen.roadType",
    // callBack: convertEpochToDate
  }
);

export const reviewArea = getLabelWithValue(
  {
    labelName: "Area (in sq ft)",
    labelKey: "WS_ADDN_DETAILS_AREA_LABEL"
  },
  {
    jsonPath: "applyScreen.roadCuttingArea"
  }
);
export const reviewConnectionExecutionDate = getLabelWithValue(
  {
    labelName: "Connection Execution Date",
    labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE"
  },
  {
    jsonPath: "applyScreen.connectionExecutionDate",
    callBack: convertEpochToDate
  }
);
export const reviewMeterId = getLabelWithValue(
  {
    labelName: "Meter ID",
    labelKey: "WS_SERV_DETAIL_METER_ID"
  },
  { jsonPath: "applyScreen.meterId" }
);

export const reviewMeterInstallationDate = getLabelWithValue(
  {
    labelName: "Meter Installation Date",
    labelKey: "WS_ADDN_DETAIL_METER_INSTALL_DATE"
  },
  { jsonPath: "applyScreen.meterInstallationDate" }
);

export const reviewInitialMeterReading = getLabelWithValue(
  {
    labelName: "Initial Meter Reading",
    labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING"
  },
  { jsonPath: "applyScreen.initialMeterReading" }
);

export const reviewOwner = (isEditable = true) => {
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
            labelKey: "WS_COMMON_ADDN_DETAILS"
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
              changeStep(state, dispatch, "", 2);
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
  // reviewBillingType,
  reviewWaterClosets,
  reviewNumberOfToilets
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
  reviewMeterInstallationDate,
  reviewInitialMeterReading
});
