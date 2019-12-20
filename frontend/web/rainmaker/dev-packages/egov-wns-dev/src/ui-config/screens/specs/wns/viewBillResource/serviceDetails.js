import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";


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
        serviceCardContainer: getCommonContainer({
            serviceType: getLabelWithValue(
                {
                    labelKey: "WS_SERV_DETAIL_SERV_LABEL"
                },
                {
                    jsonPath: "WaterConnection[0].service"
                }
            ),
            propertyUsage: getLabelWithValue(
                {
                    labelKey: "WS_SERV_DETAIL_PROP_USE_TYPE"// TL_NEW_OWNER_DETAILS_TYPE_OF_OWNERSHIP
                },
                {
                    jsonPath: "WaterConnection[0].property.propertyUsageType"
                },
            ),
            connectionType: getLabelWithValue(
                {
                    labelKey: "WS_SERV_DETAIL_CONN_TYPE"
                },
                {
                    jsonPath: "WaterConnection[0].connectionType"
                }
            ),

            meterId: getLabelWithValue(
                {
                    labelKey: "WS_SERV_DETAIL_METER_ID"
                },
                {
                    jsonPath: "WaterConnection[0].meterId"
                }
            ),
            meterStatus: getLabelWithValue(
                {
                    labelKey: "WS_SERV_DETAIL_METER_STAT"
                },
                {
                    jsonPath: "consumptionDetails[0].meterStatus"
                }
            ),
            meterReadingDate: getLabelWithValue(
                {
                    labelKey: "WS_SERV_DETAIL_METER_READ_DATE_LABEL"
                },
                {
                    jsonPath: "consumptionDetails[0].currentReadingDate"
                }
            ),
            consumption: getLabelWithValue(
                {
                    labelKey: "WS_SERV_DETAIL_CONSUMP"
                },
                {
                    jsonPath: "WaterConnection[0].consumption"
                }
            ),
            currentMeterReading: getLabelWithValue(
                {
                    labelKey: "WS_SERV_DETAIL_CUR_METER_READ"
                },
                {
                    jsonPath: "consumptionDetails[0].currentReading"
                }
            ),
            lastMeterReading: getLabelWithValue(
                {
                    labelKey: "WS_SERV_DETAIL_LAST_METER_READ"
                },
                {
                    jsonPath: "consumptionDetails[0].lastReading"
                }
            )
        })

    })
}