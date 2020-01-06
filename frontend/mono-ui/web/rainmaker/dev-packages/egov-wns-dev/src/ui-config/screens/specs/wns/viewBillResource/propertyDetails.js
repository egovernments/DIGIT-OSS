import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const getProperty = () => {
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
                        labelKey: "WS_COMMON_PROP_DETAIL" //TL_COMMON_OWN_DETAILS
                    })
                },

            }
        },
        propertyCardContainer: getCommonContainer({
            propertyCity: getLabelWithValue(
                {
                    labelKey: "WS_PROP_DETAIL_CITY"
                },
                {
                    jsonPath: "WaterConnection[0].property.address.city"
                }
            ),
            propertyDoorNo: getLabelWithValue(
                {
                    labelKey: "WS_PROP_DETAIL_PHNO_LABEL"
                },
                {
                    jsonPath: "WaterConnection[0].property.address.doorNo"
                }
            ),
            propertyBuilding: getLabelWithValue(
                {
                    labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
                },
                {
                    jsonPath: "WaterConnection[0].property.address.buildingName"
                }
            ),
            propertyStreet: getLabelWithValue(
                {
                    labelKey: "WS_PROP_DETAIL_STREET_NAME"
                },
                {
                    jsonPath: "WaterConnection[0].property.address.street"
                }
            ),
            propertyMohalla: getLabelWithValue(
                {
                    labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL"
                },
                {
                    jsonPath: "WaterConnection[0].property.address.locality.name"
                }
            ),
            propertyPincode: getLabelWithValue(
                {
                    labelKey: "WS_PROP_DETAIL_PINCODE"
                },
                {
                    jsonPath: "WaterConnection[0].property.address.pincode"
                }
            )
        })
    })
};
