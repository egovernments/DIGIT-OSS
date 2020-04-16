import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { convertEpochToDateAndHandleNA, handleNA } from "../../utils";

const service = getQueryArg(window.location.href, "service")

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
    jsonPath: "WaterConnection[0].connectionType",
    callBack: handleNA
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
    jsonPath: "WaterConnection[0].noOfTaps",
    callBack: handleNA
  }
);
export const reviewWaterSource = getLabelWithValue(
  {
    labelName: "Water Source",
    labelKey: "WS_SERV_DETAIL_WATER_SOURCE"
  },
  {
    jsonPath: "WaterConnection[0].waterSource",
    callBack: handleNA
  }
);
export const reviewWaterSubSource = getLabelWithValue(
  {
    labelName: "Water Sub Source",
    labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE"
  },
  {
    jsonPath: "WaterConnection[0].waterSubSource",
    callBack: handleNA
  }
);
export const reviewPipeSize = getLabelWithValue(
  {
    labelName: "Pipe Size (in inches)",
    labelKey: "WS_SERV_DETAIL_PIPE_SIZE"
  },
  {
    jsonPath: "WaterConnection[0].pipeSize",
    callBack: handleNA
  }
);

export const reviewWaterClosets = getLabelWithValue(
  {
    labelName: "No. of Water Closets",
    labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS"
  },
  {
    jsonPath: "WaterConnection[0].noOfWaterClosets",
    callBack: handleNA
  }
);
export const reviewNoOfToilets = getLabelWithValue(
  {
    labelName: "No. of Toilets",
    labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS"
  },
  {
    jsonPath: "WaterConnection[0].noOfToilets",
    callBack: handleNA
  }
);

export const reviewPlumberProvidedBy = getLabelWithValue(
  {
    labelKey: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY"
  },
  {
    jsonPath: "WaterConnection[0].additionalDetails.detailsProvidedBy",
    callBack: handleNA
  }
);
export const reviewPlumberLicenseNo = getLabelWithValue(
  {
    labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"
  },
  {
    jsonPath: "WaterConnection[0].plumberInfo[0].licenseNo",
    callBack: handleNA
  }
);
export const reviewPlumberName = getLabelWithValue(
  {
    labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"
  },
  { jsonPath: "WaterConnection[0].plumberInfo[0].name",
    callBack: handleNA }
);

export const reviewPlumberMobileNo = getLabelWithValue(
  {
    labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"
  },
  { jsonPath: "WaterConnection[0].plumberInfo[0].mobileNumber",
    callBack: handleNA }
);

export const reviewRoadType = getLabelWithValue(
  {
    labelName: "Road Type",
    labelKey: "WS_ADDN_DETAIL_ROAD_TYPE"
  },
  {
    jsonPath: "WaterConnection[0].roadType",
    callBack: handleNA
    // callBack: convertEpochToDate
  }
);

export const reviewArea = getLabelWithValue(
  {
    labelName: "Area (in sq ft)",
    labelKey: "WS_ADDN_DETAILS_AREA_LABEL"
  },
  {
    jsonPath: "WaterConnection[0].roadCuttingArea",
    callBack: handleNA
  }
);
export const reviewConnectionExecutionDate = getLabelWithValue(
  {
    labelName: "Connection Execution Date",
    labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE"
  },
  {
    jsonPath: "WaterConnection[0].connectionExecutionDate",
    callBack: convertEpochToDateAndHandleNA
  }
);
export const reviewMeterId = getLabelWithValue(
  {
    labelName: "Meter ID",
    labelKey: "WS_SERV_DETAIL_METER_ID"
  },
  { jsonPath: "WaterConnection[0].meterId",
    callBack: handleNA }
);

export const reviewMeterInstallationDate = getLabelWithValue(
  {
    labelName: "Meter Installation Date",
    labelKey: "WS_ADDN_DETAIL_METER_INSTALL_DATE"
  },
  {
    jsonPath: "WaterConnection[0].meterInstallationDate",
    callBack: convertEpochToDateAndHandleNA
  }
);

export const reviewInitialMeterReading = getLabelWithValue(
  {
    labelName: "Initial Meter Reading",
    labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING"
  },
  { jsonPath: "WaterConnection[0].additionalDetails.initialMeterReading",
    callBack: handleNA }
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
            labelKey: "WS_COMMON_ADDN_DETAILS_HEADER"
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
    viewSix: renderService(),
    // viewSix: connectionDetails,
    viewSeven: connectionChargeDetailsHeader,
    viewEight: connectionChargeDetails,
    viewNine: roadCuttingChargesHeader,
    viewTen: roadCuttingCharges,
    viewEleven: activationDetailsHeader,
    viewTwelve: activationDetails
  })
};

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

export const renderService = () => {
  if (service === "WATER") {
    return getCommonContainer({ reviewConnectionType, reviewNumberOfTaps, reviewWaterSource, reviewWaterSubSource, reviewPipeSize });
  } else if (service === "SEWERAGE") {
    return getCommonContainer({ reviewConnectionType, reviewWaterClosets,reviewNoOfToilets })
  }
}