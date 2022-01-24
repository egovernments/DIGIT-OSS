import React from "react";
import { DatePicker } from "@egovernments/digit-ui-react-components";

export const configCompleteApplication = ({ t, vehicle, vehicleCapacity, applicationCreatedTime = 0, action }) => ({
  label: {
    heading: `ES_FSM_ACTION_TITLE_${action}`,
    submit: `CS_COMMON_${action}`,
    cancel: "CS_COMMON_CLOSE",
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
            component: (props, customProps) => <DatePicker onChange={props.onChange} date={props.value} {...customProps} />,
          },
        },
        {
          label: t("ES_FSM_ACTION_WASTE_VOLUME_LABEL"),
          type: "number",
          isMandatory: true,
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
          label: "ES_NEW_APPLICATION_PROPERTY_TYPE",
          isMandatory: true,
          type: "component",
          route: "property-type",
          key: "propertyType",
          component: "SelectPropertyType",
          texts: {
            headerCaption: "",
            header: "CS_FILE_APPLICATION_PROPERTY_LABEL",
            cardText: "CS_FILE_APPLICATION_PROPERTY_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
          },
          nextStep: "property-subtype",
        },
        {
          label: "ES_NEW_APPLICATION_PROPERTY_SUB-TYPE",
          isMandatory: true,
          type: "component",
          route: "property-subtype",
          key: "subtype",
          component: "SelectPropertySubtype",
          texts: {
            headerCaption: "",
            header: "CS_FILE_APPLICATION_PROPERTY_SUBTYPE_LABEL",
            cardText: "CS_FILE_APPLICATION_PROPERTY_SUBTYPE_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
          },
          nextStep: "map",
        },
        {
          label: "ES_NEW_APPLICATION_PIT_TYPE",
          isMandatory: false,
          type: "component",
          route: "pit-type",
          key: "pitType",
          component: "SelectPitType",
          texts: {
            header: "CS_FILE_PROPERTY_PIT_TYPE",
            cardText: "CS_FILE_PROPERTY_PIT_TYPE_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
            skipText: "CORE_COMMON_SKIP_CONTINUE",
          },
          nextStep: "tank-size",
        },
        {
          route: "tank-size",
          component: "SelectTankSize",
          isMandatory: false,
          texts: {
            headerCaption: "",
            header: "CS_FILE_APPLICATION_PIT_SEPTIC_TANK_SIZE_TITLE",
            cardText: "CS_FILE_APPLICATION_PIT_SEPTIC_TANK_SIZE_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
          },
          type: "component",
          key: "pitDetail",
          nextStep: null,
          label: "ES_NEW_APPLICATION_PIT_DIMENSION",
        },
      ],
    },
  ],
});
