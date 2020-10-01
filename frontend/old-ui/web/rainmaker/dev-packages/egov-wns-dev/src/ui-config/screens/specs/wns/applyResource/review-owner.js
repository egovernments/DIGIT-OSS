import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabelWithValueForModifiedLabel,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { convertEpochToDateAndHandleNA, handleNA,handleRoadType } from "../../utils";
import { serviceConst } from "../../../../../ui-utils/commons";
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



export const plumberDetails={
  reviewPlumberProvidedBy : getLabelWithValueForModifiedLabel(
    {
      labelName: "Plumber provided by",
      labelKey: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY"
    },
    {
      jsonPath: "WaterConnection[0].additionalDetails.detailsProvidedBy",
      callBack: handleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].additionalDetails.detailsProvidedBy",
      callBack: handleNA
    }
  ),
  reviewPlumberLicenseNo : getLabelWithValueForModifiedLabel(
    {
      labelName: "Plumber licence No",
      labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].plumberInfo[0].licenseNo",
      callBack: handleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].plumberInfo[0].licenseNo",
      callBack: handleNA
    }
  ),
  reviewPlumberName : getLabelWithValueForModifiedLabel(
    {
      labelName: "Plumber Name",
      labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"
    },
    { jsonPath: "WaterConnection[0].plumberInfo[0].name",
      callBack: handleNA }, {
        labelKey: "WS_OLD_LABEL_NAME"
      },
      { jsonPath: "WaterConnectionOld[0].plumberInfo[0].name",
      callBack: handleNA }
  ),
  reviewPlumberMobileNo : getLabelWithValueForModifiedLabel(
    {
      labelName: "Plumber mobile No.",
      labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"
    },
    { jsonPath: "WaterConnection[0].plumberInfo[0].mobileNumber",
      callBack: handleNA }, {
        labelKey: "WS_OLD_LABEL_NAME"
      },
      { jsonPath: "WaterConnectionOld[0].plumberInfo[0].mobileNumber",
      callBack: handleNA }
  )


}
const connectionChargeDetails = getCommonContainer(plumberDetails);
export const roadDetails={
  reviewRoadType : getLabelWithValueForModifiedLabel(
    {
      labelName: "Road Type",
      labelKey: "WS_ADDN_DETAIL_ROAD_TYPE"
    },
    {
      jsonPath: "WaterConnection[0].roadType",
      callBack: handleRoadType
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].roadType",
      callBack: handleRoadType
    }
  ),
  reviewArea : getLabelWithValueForModifiedLabel(
    {
      labelName: "Area (in sq ft)",
      labelKey: "WS_ADDN_DETAILS_AREA_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].roadCuttingArea",
      callBack: handleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].roadCuttingArea",
      callBack: handleNA
    }
  )

}

const roadCuttingCharges = getCommonContainer(roadDetails);



export const activateDetailsMeter={
  reviewConnectionExecutionDate : getLabelWithValueForModifiedLabel(
    {
      labelName: "Connection Execution Date",
      labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE"
    },
    {
      jsonPath: "WaterConnection[0].connectionExecutionDate",
      callBack: convertEpochToDateAndHandleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].connectionExecutionDate",
      callBack: convertEpochToDateAndHandleNA
    }
  ),
  reviewMeterId : getLabelWithValueForModifiedLabel(
    {
      labelName: "Meter ID",
      labelKey: "WS_SERV_DETAIL_METER_ID"
    },
    { jsonPath: "WaterConnection[0].meterId",
      callBack: handleNA }, {
        labelKey: "WS_OLD_LABEL_NAME"
      },
      { jsonPath: "WaterConnectionOld[0].meterId",
      callBack: handleNA }
  ),
  reviewMeterInstallationDate : getLabelWithValueForModifiedLabel(
    {
      labelName: "Meter Installation Date",
      labelKey: "WS_ADDN_DETAIL_METER_INSTALL_DATE"
    },
    {
      jsonPath: "WaterConnection[0].meterInstallationDate",
      callBack: convertEpochToDateAndHandleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].meterInstallationDate",
      callBack: convertEpochToDateAndHandleNA
    }
  ),
  reviewInitialMeterReading : getLabelWithValueForModifiedLabel(
    {
      labelName: "Initial Meter Reading",
      labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING"
    },
    { jsonPath: "WaterConnection[0].additionalDetails.initialMeterReading",
      callBack: handleNA }, {
        labelKey: "WS_OLD_LABEL_NAME"
      },
      { jsonPath: "WaterConnectionOld[0].additionalDetails.initialMeterReading",
      callBack: handleNA }
  )

}
export const activateDetailsNonMeter={
  reviewConnectionExecutionDate : getLabelWithValueForModifiedLabel(
    {
      labelName: "Connection Execution Date",
      labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE"
    },
    {
      jsonPath: "WaterConnection[0].connectionExecutionDate",
      callBack: convertEpochToDateAndHandleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].connectionExecutionDate",
      callBack: convertEpochToDateAndHandleNA
    }
  ) 
}
const activationDetails = getCommonContainer(activateDetailsMeter);



export const connectionWater={
  reviewConnectionType : getLabelWithValueForModifiedLabel(
    {
      labelName: "Connection Type",
      labelKey: "WS_SERV_DETAIL_CONN_TYPE"
    },
    {
      jsonPath: "WaterConnection[0].connectionType",
      callBack: handleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].connectionType",
      callBack: handleNA
    }
  ),
  reviewNumberOfTaps : getLabelWithValueForModifiedLabel(
    {
      labelName: "No. of Taps",
      labelKey: "WS_SERV_DETAIL_NO_OF_TAPS"
    },
    {
      jsonPath: "WaterConnection[0].noOfTaps",
      callBack: handleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].noOfTaps",
      callBack: handleNA
    }
  ),
  reviewWaterSource : getLabelWithValueForModifiedLabel(
    {
      labelName: "Water Source",
      labelKey: "WS_SERV_DETAIL_WATER_SOURCE"
    },
    {
      jsonPath: "WaterConnection[0].waterSource",
      callBack: handleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].waterSource",
      callBack: handleNA
    }
  ),
  reviewWaterSubSource : getLabelWithValueForModifiedLabel(
    {
      labelName: "Water Sub Source",
      labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE"
    },
    {
      jsonPath: "WaterConnection[0].waterSubSource",
      callBack: handleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].waterSubSource",
      callBack: handleNA
    }
  ),
   reviewPipeSize : getLabelWithValueForModifiedLabel(
    {
      labelName: "Pipe Size (in inches)",
      labelKey: "WS_SERV_DETAIL_PIPE_SIZE"
    },
    {
      jsonPath: "WaterConnection[0].pipeSize",
      callBack: handleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].pipeSize",
      callBack: handleNA
    }
  )


}

export const connectionSewerage={
  reviewConnectionType : getLabelWithValueForModifiedLabel(
    {
      labelName: "Connection Type",
      labelKey: "WS_SERV_DETAIL_CONN_TYPE"
    },
    {
      jsonPath: "WaterConnection[0].connectionType",
      callBack: handleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    }, {
      jsonPath: "WaterConnectionOld[0].connectionType",
      callBack: handleNA
    }
  ),
   reviewWaterClosets : getLabelWithValueForModifiedLabel(
    {
      labelName: "No. of Water Closets",
      labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS"
    },
    {
      jsonPath: "WaterConnection[0].noOfWaterClosets",
      callBack: handleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    }, {
      jsonPath: "WaterConnectionOld[0].noOfWaterClosets",
      callBack: handleNA
    }
  ),
   reviewNoOfToilets : getLabelWithValueForModifiedLabel(
    {
      labelName: "No. of Toilets",
      labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS"
    },
    {
      jsonPath: "WaterConnection[0].noOfToilets",
      callBack: handleNA
    }, {
      labelKey: "WS_OLD_LABEL_NAME"
    }, {
      jsonPath: "WaterConnectionOld[0].noOfToilets",
      callBack: handleNA
    }
  )
}

export const additionDetailsWater=connectionWater;

export const additionDetailsSewerage=connectionSewerage;

export const renderService = () => {
  let isService = getQueryArg(window.location.href, "service");
  if (isService === serviceConst.WATER) {
    return getCommonContainer(connectionWater);
  } else if (isService === serviceConst.SEWERAGE) {
    return getCommonContainer(connectionSewerage)
  }
}