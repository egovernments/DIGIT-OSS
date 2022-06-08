import React from "react";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import { DatePicker } from "@egovernments/digit-ui-react-components";

export const configScheduleDso = ({ t, rejectMenu, setTrips, trips, applicationCreatedTime = 0, vehicleCapacity, noOfTrips, action }) => {
    return {
        label: {
            heading: `ES_FSM_ACTION_TITLE_${action}`,
            submit: `CS_COMMON_${action}`,
            cancel: "CS_COMMON_CLOSE",
        },
        form: [
            {
                body: [
                    {
                        label: t("ES_FSM_ACTION_DESLUDGING_ON"),
                        isMandatory: true,
                        type: "custom",
                        populators: {
                            name: "desluged",
                            validation: {
                                required: true,
                            },
                            defaultValue: Digit.Utils.date.getDate(),
                            customProps: {
                                min: Digit.Utils.date.getDate(applicationCreatedTime),
                                max: Digit.Utils.date.getDate(),
                            },
                            component: (props, customProps) => <DatePicker onChange={props.onChange} date={props.value} {...customProps} />,
                        },
                    },
                    {
                        label: t("ES_FSM_ACTION_WASTE_VOLUME_LABEL"),
                        type: "number",
                        isMandatory: true,
                        disable: true,
                        populators: {
                            name: "wasteCollected",
                            validation: {
                                required: true,
                                validate: (value) => parseInt(value) <= parseInt(vehicleCapacity),
                            },
                            error: `${t("ES_FSM_ACTION_INVALID_WASTE_VOLUME")} ${vehicleCapacity} ${t("CS_COMMON_LITRES")}`,
                        },
                    },
                    {
                        label: t("ES_NEW_APPLICATION_PAYMENT_NO_OF_TRIPS"),
                        type: "number",
                        populators: {
                            name: "noOfTrips",
                            error: t("ES_NEW_APPLICATION_NO_OF_TRIPS_INVALID"),
                            validation: {
                                required: true,
                            },
                            defaultValue: noOfTrips
                            // defaultValue: customizationConfig && Object.keys(customizationConfig).length > 0 ? customizationConfig?.noOfTrips?.default : 1,
                        },
                        // disable: true,
                        // disable: customizationConfig ? !customizationConfig?.noOfTrips?.override : true,
                    },
                ],
            },
        ],
    };
};
