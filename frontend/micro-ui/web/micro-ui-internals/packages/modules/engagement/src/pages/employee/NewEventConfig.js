export const config = [
  {
    head: "",
    body: [
      {
        type: "form",
        withoutLabel: true,
        component: "EventForm",
        nextStep: "",
        route: "",
        key: "eventData",
      },
      {
        type: "text",
        label: "EVENTS_DESCRIPTION_LABEL",
        isMandatory: true,
        populators: {
          name: "description",
          className: "fullWidth",
          validation: {
            required: true,
          },
          error: 'EVENTS_DESCRIPTION_ERROR_REQUIRED',
        },
      },
      {
        type: "date",
        label: "EVENTS_FROM_DATE_LABEL",
        isMandatory: true,
        populators: {
          name: "fromDate",
          className: "fullWidth",
          validation: {
            required: true,
          },
          error: "EVENTS_FROM_DATE_ERROR_REQUIRED",
        },
      },
      {
        type: "date",
        label: "EVENTS_TO_DATE_LABEL",
        isMandatory: true,
        populators: {
          name: "toDate",
          className: "fullWidth",
          validation: {
            required: true,
          },
          error: "EVENTS_TO_DATE_ERROR_REQUIRED",
        },
      },
      {
        type: "time",
        label: "EVENTS_FROM_TIME_LABEL",
        isMandatory: true,
        populators: {
          name: "fromTime",
          className: "fullWidth",
          validation: {
            required: true,
          },
          error: "EVENTS_FROM_TIME_ERROR_REQUIRED",
        },
      },
      {
        type: "time",
        label: "EVENTS_TO_TIME_LABEL",
        isMandatory: true,
        populators: {
          name: "toTime",
          className: "fullWidth",
          validation: {
            required: true,
          },
          error: "EVENTS_TO_TIME_ERROR_REQUIRED",
        },
      },
      {
        type: "text",
        label: "EVENTS_ADDRESS_LABEL",
        isMandatory: true,
        populators: {
          name: "address",
          className: "fullWidth",
          validation: {
            required: true,
          },
          error: "EVENTS_ADDRESS_ERROR_REQUIRED",
        },
      },
      {
        type: "component",
        component: "SelectEventGeolocation",
        withoutLabel: true,
        key: "geoLocation",
      },
      {
        type: "text",
        label: "EVENTS_ORGANIZER_NAME_LABEL",
        populators: {
          name: "organizer",
          className: "fullWidth",
          validation: {
            pattern: /^[A-Za-z ]*$/,
          },
          error: "EVENTS_ORGANIZER_ERROR",
        }
      },
      {
        type: "number",
        label: "EVENTS_ENTRY_FEE_INR_LABEL",
        populators: {
          name: "fees",
          className: "fullWidth",
          error: "EVENTS_ENTRY_ERROR_REQUIRED",
        }
      },
    ]
  }
] 