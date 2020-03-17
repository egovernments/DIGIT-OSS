import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

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
        jsonPath: "WaterConnection[0].property.propertyUsageType"
    }
);

export const connType = getLabelWithValue(
    {
        labelKey: "WS_SERV_DETAIL_CONN_TYPE"
    },
    {
        jsonPath: "WaterConnection[0].connectionType"
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
        jsonPath: "WaterConnection[0].consumption"
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
        serviceCardContainer: renderService()
    });
};

export const renderService = () => {
    if (service === "WATER") {
        if (connectionType === "Metered") {
            return getCommonContainer({ serviceType, propertyUsage, connType, meterId, meterStatus, meterReadingDate, consumption, currentMeterReading, lastMeterReading });
        } else {
            return getCommonContainer({ serviceType, propertyUsage, connType });
        }
    } else if (service === "SEWERAGE") {
        return getCommonContainer({ serviceType, propertyUsage })
    }
}
