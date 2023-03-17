import React from "react";
import PlusMinusInput from "../../../../pageComponents/PlusMinusInput";

export const configUpdateTrips = ({ t, noOfTrips, action }) => ({
  label: {
    heading: `ES_FSM_ACTION_TITLE_${action}`,
    submit: `CS_COMMON_${action}`,
    cancel: `CS_COMMON_CLOSE`,
  },
  form: [
    {
      body: [
        {
          label: t("ES_FSM_ACTION_NUMBER_OF_TRIPS"),
          isMandatory: true,
          type: "custom",
          populators: {
            name: "noOfTrips",
            error: t("ES_NEW_APPLICATION_NO_OF_TRIPS_INVALID"),
            validation: {
              required: true,
            },
            defaultValue: noOfTrips,
            rules: { required: true },
            customProps: {
              isMandatory: true,
              optionsKey: "i18nKey",
              innerStyles: { minWidth: "33%" },
            },
            component: (props, customProps) => (
              <PlusMinusInput
                defaultValues={props.value}
                {...customProps}
                onSelect={(d) => {
                  props.onChange(d);
                }}
              />
            ),
          },
        },
      ],
    },
  ],
});
