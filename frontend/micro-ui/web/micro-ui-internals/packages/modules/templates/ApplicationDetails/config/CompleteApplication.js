import React from "react";
import { DatePicker } from "@egovernments/digit-ui-react-components";

export const configCompleteApplication = ({ t, vehicle, applicationCreatedTime = 0, action }) => ({
  label: {
    heading: `ES_FSM_ACTION_TITLE_${action}`,
    submit: `CS_COMMON_${action}`,
    cancel: "CS_COMMON_CANCEL",
  },
  form: [
    {
      body: [
        {
          label: t("ES_FSM_ACTION_DESLUGED_DATE_LABEL"),
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
            component: (props, customProps) => <DatePicker disabled={true} onChange={props.onChange} date={props.value} {...customProps} />,
          },
        },
        {
          label: t("ES_FSM_ACTION_WASTE_VOLUME_LABEL"),
          type: "text",
          isMandatory: true,
          populators: {
            name: "wasteCollected",
            validation: {
              required: true,
              validate: (value) => parseInt(value) <= parseInt(vehicle.capacity),
            },
            error: `${t("ES_FSM_ACTION_INVALID_WASTE_VOLUME")} ${vehicle?.capacity} ${t("CS_COMMON_LITRES")}`,
          },
        },
      ],
    },
  ],
});
