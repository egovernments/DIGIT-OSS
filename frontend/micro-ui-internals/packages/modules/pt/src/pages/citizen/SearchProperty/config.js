export const config = [
  {
    texts: {
      header: "SEARCH_PROPERTY",
      submitButtonLabel: "PT_HOME_SEARCH_RESULTS_BUTTON_SEARCH",
      text: "CS_PT_HOME_SEARCH_RESULTS_DESC",
    },
    inputs: [
      {
        label: "PT_HOME_SEARCH_RESULTS_OWN_MOB_LABEL",
        type: "mobileNumber",
        name: "mobileNumber",
        error: "ERR_HRMS_INVALID_USER_ID",
      },
      {
        label: "PT_PROPERTY_UNIQUE_ID",
        description: "CS_PROPERTY_ID_FORMAT_MUST_BE",
        type: "text",
        name: "propertyId",
        error: "ERR_HRMS_WRONG_PASSWORD",
      },
      {
        label: "PT_EXISTING_PROPERTY_ID",
        type: "text",
        name: "oldPropertyId",
        error: "ERR_HRMS_INVALID_CITY",
      },
    ],
  },
];
