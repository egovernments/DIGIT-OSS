import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
// import { serviceConst } from "../../../../../ui-utils/commons";
const service = getQueryArg(window.location.href, "service")
const connectionType = getQueryArg(window.location.href, "connectionType")

export const serviceType = getLabelWithValue(
    {
        labelKey: "WS_SERV_DETAIL_SERV_LABEL"
    },
    {
        jsonPath: "WaterConnection[0].service"
    }
);

export const propertyUsage = getLabelWithValue(
    {
        labelKey: "WS_SERV_DETAIL_PROP_USE_TYPE"// TL_NEW_OWNER_DETAILS_TYPE_OF_OWNERSHIP
    },
    {
        jsonPath: "WaterConnection[0].property.usageCategory"
    }
);

export const connType = getLabelWithValue(
    {
        labelKey: "WS_SERV_DETAIL_CONN_TYPE"
    },
    {
        jsonPath: "WaterConnection[0].connectionType",
        localePrefix: {
            moduleName: "WS_SERVICES_MASTERS",
            masterName: "WATERSOURCE"
          },
    }
);

export const meterId = getLabelWithValue(
    {
        labelKey: "WS_SERV_DETAIL_METER_ID"
    },
    {
        jsonPath: "WaterConnection[0].meterId"
    }
);

export const meterStatus = getLabelWithValue(
    {
        labelKey: "WS_SERV_DETAIL_METER_STAT"
    },
    {
        jsonPath: "consumptionDetails[0].meterStatus"
    }
);

export const meterReadingDate = getLabelWithValue(
    {
        labelKey: "WS_SERV_DETAIL_METER_READ_DATE_LABEL"
    },
    {
        jsonPath: "consumptionDetails[0].currentReadingDate"
    }
);

export const consumption = getLabelWithValue(
    {
        labelKey: "WS_SERV_DETAIL_CONSUMP"
    },
    {
        jsonPath: "WaterConnection[0].consumption",
        callBack: (params) => {
            if (params !== undefined && params !== null && params > 0) {
                return parseFloat(params).toFixed(2)
            } else if (params === 0) { return 0; }
            else return "NA"
        }
    }
);

export const currentMeterReading = getLabelWithValue(
    {
        labelKey: "WS_SERV_DETAIL_CUR_METER_READ"
    },
    {
        jsonPath: "consumptionDetails[0].currentReading"
    }
);

export const lastMeterReading = getLabelWithValue(
    {
        labelKey: "WS_SERV_DETAIL_LAST_METER_READ"
    },
    {
        jsonPath: "consumptionDetails[0].lastReading"
    }
);

export const getService = () => {
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
                    ...getCommonSubHeader(
                        {
                            labelKey: "WS_COMMON_SERV_DETAIL"
                        },
                        {
                            style: {
                                marginBottom: 18
                            }
                        }
                    ),
                }
            },
        },
        // serviceCardContainer: renderService()
        waterDetails:  waterDetailsCard(),
        waterMeterDetails: waterMeterDetailsCard (),
        sewerDetails: sewerDetailsCard(),
    });
};

// export const renderService = () => {
//     if (service === serviceConst.WATER) {
//         if (connectionType === "Metered") {
//             return getCommonContainer({ serviceType, propertyUsage, connType, meterId, meterStatus, meterReadingDate, consumption, currentMeterReading, lastMeterReading });
//         } else {
//             return getCommonContainer({ serviceType, propertyUsage, connType });
//         }
//     } else if (service === serviceConst.SEWERAGE) {
//         return getCommonContainer({ serviceType, propertyUsage })
//     }
// }
export const waterMeterDetailsCard = () => {
    return getCommonContainer({ serviceType, propertyUsage, connType, meterId, meterStatus, meterReadingDate, consumption, currentMeterReading, lastMeterReading });

}
export const waterDetailsCard = () => {
    // if (connectionType === "Metered") {
    //     return getCommonContainer({ serviceType, propertyUsage, connType, meterId, meterStatus, meterReadingDate, consumption, currentMeterReading, lastMeterReading });
    // } else {
    //     return getCommonContainer({ serviceType, propertyUsage, connType });
    // }
    return getCommonContainer({ serviceType, propertyUsage, connType });

}
export const sewerDetailsCard = () => {
    return getCommonContainer({ serviceType, propertyUsage });
}