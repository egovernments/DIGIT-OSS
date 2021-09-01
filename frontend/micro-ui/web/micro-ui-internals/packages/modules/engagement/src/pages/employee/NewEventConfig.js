export const config = [
  {
    head: "",
    body: [
      {
        type: "component",
        withoutLabel: true,
        component: "EventForm",
        nextStep: "",
        route: "",
        key: "eventData",
      },
      {
        type: "text",
        label: "EVENTS_DESCRIPTION_LABEL",
        populators: {
          name: "description",
          className: "fullWidth",
          validation: {
            required: true,
          }
        }
      },
      {
        type: "date",
        label: "EVENTS_FROM_DATE_LABEL",
        populators: {
          name: "fromDate",
          className: "fullWidth",
          validation: {
            required: true,
          }
        }
      },
      {
        type: "date",
        label: "EVENTS_TO_DATE_LABEL",
        populators: {
          name: "toDate",
          className: "fullWidth",
          validation: {
            required: true,
          }
        }
      },
      {
        type: "time",
        label: "EVENTS_FROM_TIME_LABEL",
        populators: {
          name: "fromTime",
          className: "fullWidth",
          validation: {
            required: true,
          }
        }
      },
      {
        type: "time",
        label: "EVENTS_TO_TIME_LABEL",
        populators: {
          name: "toTime",
          className: "fullWidth",
          validation: {
            required: true,
          }
        }
      },
      {
        type: "text",
        label: "EVENTS_ADDRESS_LABEL",
        populators: {
          name: "address",
          className: "fullWidth",
          validation: {
            required: true,
          }
        }
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
            required: true,
          }
        }
      },
      {
        type: "text",
        label: "EVENTS_ENTRY_FEE_INR_LABEL",
        populators: {
          name: "fees",
          className: "fullWidth",
          validation: {
            required: true,
          }
        }
      },
    ]
  }
] 