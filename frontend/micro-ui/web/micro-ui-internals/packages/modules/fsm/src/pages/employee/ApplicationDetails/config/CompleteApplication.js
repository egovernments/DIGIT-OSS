import React from "react";
import { DatePicker } from "@egovernments/digit-ui-react-components";
import { RadioButtons } from "@egovernments/digit-ui-react-components";


export const configCompleteApplication = ({ t, vehicle, vehicleCapacity, noOfTrips, applicationCreatedTime = 0, receivedPaymentType, action, module }) => ({

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
            component: (props, customProps) => <DatePicker disabled={true} onChange={props.onChange} date={props.value} {...customProps} />,
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
          disable: true,
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
          disable: true,
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
          label: "ES_NEW_APPLICATION_PIT_DIMENSION",
          isMandatory: false,
          type: "component",
          route: "tank-size",
          key: "pitDetail",
          component: "SelectTankSize",
          texts: {
            headerCaption: "",
            header: "CS_FILE_APPLICATION_PIT_SEPTIC_TANK_SIZE_TITLE",
            cardText: "CS_FILE_APPLICATION_PIT_SEPTIC_TANK_SIZE_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
          },
          nextStep: null,
        },
        {
          label: `${t("ES_NEW_APPLICATION_PAYMENT_NO_OF_TRIPS")} *`,
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
          disable: true,
          // disable: customizationConfig ? !customizationConfig?.noOfTrips?.override : true,
        },
        module !== "FSM_ZERO_PAY_SERVICE" && {
          label: "FSM_PAYMENT_RECEIVED",
          isMandatory: true,
          type: "custom",
          populators: {
            name: "paymentMode",
            error: t("ES_NEW_APPLICATION_NO_OF_TRIPS_INVALID"),
            validation: {
              required: true,
            },
            rules: { required: true },
            customProps: {
              isMandatory: true,
              options: receivedPaymentType,
              optionsKey: "i18nKey",
              innerStyles: { minWidth: "33%" },
            },
            component: (props, customProps) => (
              <RadioButtons
                selectedOption={props.value}
                onSelect={(d) => {
                  props.onChange(d);
                }}
                {...customProps}
              />
            ),
          },
        },
      ],
    },
  ],
});
