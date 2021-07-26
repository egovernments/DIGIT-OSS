import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { serviceConst } from "../../../../../ui-utils/commons";
import { getUserInfo, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";

export const checkValueForNA = value => {
  return value ? value : "NA";
};

// export const renderService = () => {
//   const tenantId = getTenantIdCommon()
// const connectionNumber = getQueryArg(window.location.href, "connectionNumber");
// const service = getQueryArg(window.location.href, "service")
// const connectionType = getQueryArg(window.location.href, "connectionType")
//   if (service === serviceConst.WATER) {
//     if (connectionType === "Metered") {
//       return getCommonContainer({
//         serviceType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_SERV_LABEL" }, { jsonPath: "WaterConnection[0].service" }),
//         connectionCategory: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_CATEGORY" }, { jsonPath: "WaterConnection[0].connectionCategory" }),
//         connectionType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_TYPE" }, { jsonPath: "WaterConnection[0].connectionType" }),
//         meterID: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_METER_ID" }, { jsonPath: "WaterConnection[0].meterId" }),
//         pipeSize: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_PIPE_SIZE" }, { jsonPath: "WaterConnection[0].pipeSize" }),
//         connectionExecutionDate: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" }, { jsonPath: "WaterConnection[0].connectionExecutionDate" }),
//         rainwaterHarvestingFacility: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC" }, { jsonPath: "WaterConnection[0].property.additionalDetails.isRainwaterHarvesting" }),
//         waterSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SOURCE" }, { jsonPath: "WaterConnection[0].waterSource" }),
//         waterSubSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE" }, { jsonPath: "WaterConnection[0].waterSubSource" }),
//         editSection: {
//           componentPath: "Button",
//           props: { color: "primary", style: { margin: "-16px" } },
//           visible: true,
//           gridDefination: { xs: 12, sm: 12, align: "left" },
//           children: { buttonLabel: getLabel({ labelKey: "WS_CONNECTION_DETAILS_VIEW_CONSUMPTION_LABEL" }) },
//           onClickDefination: {
//             action: "page_change",
//             path: `meter-reading?connectionNos=${connectionNumber}&tenantId=${tenantId}`
//           }
//         },
//       })
//     } else {
//       return getCommonContainer({
//         serviceType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_SERV_LABEL" }, { jsonPath: "WaterConnection[0].service" }),
//         connectionCategory: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_CATEGORY" }, { jsonPath: "WaterConnection[0].connectionCategory" }),
//         connectionType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_TYPE" }, { jsonPath: "WaterConnection[0].connectionType" }),
//         pipeSize: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_PIPE_SIZE" }, { jsonPath: "WaterConnection[0].pipeSize" }),
//         connectionExecutionDate: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" }, { jsonPath: "WaterConnection[0].connectionExecutionDate" }),
//         rainwaterHarvestingFacility: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC" }, { jsonPath: "WaterConnection[0].property.additionalDetails.isRainwaterHarvesting" }),
//         waterSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SOURCE" }, { jsonPath: "WaterConnection[0].waterSource" }),
//         waterSubSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE" }, { jsonPath: "WaterConnection[0].waterSubSource" }),
//         numberOfTaps: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_NO_OF_TAPS" }, { jsonPath: "WaterConnection[0].noOfTaps" })
//       })
//     }
//   } else if (service === serviceConst.SEWERAGE) {
//     return getCommonContainer({
//       serviceType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_SERV_LABEL" }, { jsonPath: "WaterConnection[0].service", callBack: checkValueForNA }),
//       connectionExecutionDate: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" }, { jsonPath: "WaterConnection[0].connectionExecutionDate", callBack: checkValueForNA }),
//       unitOfMeasurement: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_UNIT_OF_MEASUREMENT" }, { jsonPath: "WaterConnection[0].uom", callBack: checkValueForNA }),
//       numberOfToilets: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_NO_OF_TOILETS" }, { jsonPath: "WaterConnection[0].noOfToilets", callBack: checkValueForNA })
//     })
//   }
// }

export const waterDetails = () => {
  const tenantId = getTenantIdCommon();
  const connectionNumber = getQueryArg(window.location.href, "connectionNumber");
  const service = getQueryArg(window.location.href, "service");
  const connectionType = getQueryArg(window.location.href, "connectionType");
  if (connectionType === "Metered") {
    return getCommonContainer({
      serviceType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_SERV_LABEL" }, { jsonPath: "WaterConnection[0].service", callBack: checkValueForNA }),
      connectionCategory: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_CATEGORY" }, { jsonPath: "WaterConnection[0].additionalDetails.connectionCategory", callBack: checkValueForNA }),
      connectionType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_TYPE" }, { jsonPath: "WaterConnection[0].connectionType",localePrefix: { moduleName: "WS_SERVICES_MASTERS", masterName: "WATERSOURCE" }, callBack: checkValueForNA }),
      meterID: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_METER_ID" }, { jsonPath: "WaterConnection[0].meterId", callBack: checkValueForNA }),
      pipeSize: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_PIPE_SIZE" }, { jsonPath: "WaterConnection[0].pipeSize", callBack: checkValueForNA }),
      connectionExecutionDate: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" }, { jsonPath: "WaterConnection[0].connectionExecutionDate", callBack: checkValueForNA }),
      waterSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SOURCE" }, { jsonPath: "WaterConnection[0].waterSource", localePrefix: { moduleName: "WS_SERVICES_MASTERS", masterName: "WATERSOURCE" }, callBack: checkValueForNA })
    })
  } else {
    return getCommonContainer({
      serviceType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_SERV_LABEL" }, { jsonPath: "WaterConnection[0].service", callBack: checkValueForNA }),
      connectionCategory: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_CATEGORY" }, { jsonPath: "WaterConnection[0].additionalDetails.connectionCategory", callBack: checkValueForNA }),
      connectionType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_TYPE" }, { jsonPath: "WaterConnection[0].connectionType", localePrefix: { moduleName: "WS_SERVICES_MASTERS", masterName: "WATERSOURCE" }, callBack: checkValueForNA }),
      pipeSize: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_PIPE_SIZE" }, { jsonPath: "WaterConnection[0].pipeSize", callBack: checkValueForNA }),
      connectionExecutionDate: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" }, { jsonPath: "WaterConnection[0].connectionExecutionDate", callBack: checkValueForNA }),
      waterSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SOURCE" }, { jsonPath: "WaterConnection[0].waterSource", localePrefix: { moduleName: "WS_SERVICES_MASTERS", masterName: "WATERSOURCE" }, callBack: checkValueForNA }),
      // waterSubSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE" }, { jsonPath: "WaterConnection[0].waterSubSource" }),
      numberOfTaps: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_NO_OF_TAPS" }, { jsonPath: "WaterConnection[0].noOfTaps", callBack: checkValueForNA })
    })
  }
}
export const sewerDetails = () => {
  return getCommonContainer({
    serviceType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_SERV_LABEL" }, { jsonPath: "WaterConnection[0].service",callBack: checkValueForNA }),
    connectionExecutionDate: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" }, { jsonPath: "WaterConnection[0].connectionExecutionDate",callBack: checkValueForNA }),
    unitOfMeasurement: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_UNIT_OF_MEASUREMENT" }, { jsonPath: "WaterConnection[0].uom",callBack: checkValueForNA }),
    numberOfToilets: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_NO_OF_TOILETS" }, { jsonPath: "WaterConnection[0].noOfToilets",callBack: checkValueForNA })
  })
}


export const getServiceDetails = () => {

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
            labelKey: "WS_COMMON_SERV_DETAIL"
          })
        }
      }
    },
    // viewOne: renderService()
    waterDetails:  waterDetails(),
    sewerDetails: sewerDetails(),
  });
};


