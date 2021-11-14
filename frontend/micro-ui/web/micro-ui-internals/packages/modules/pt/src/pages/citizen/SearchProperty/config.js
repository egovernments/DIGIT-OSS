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
        error: "CORE_COMMON_MOBILE_ERROR",
      },
      {
        label: "PT_PROPERTY_UNIQUE_ID",
        description: "CS_PROPERTY_ID_FORMAT_MUST_BE",
        type: "text",
        name: "propertyId",
        error: "ERR_INVALID_PROPERTY_ID",
      },
      {
        label: "PT_EXISTING_PROPERTY_ID",
        type: "text",
        name: "oldPropertyId",
        error: "ERR_INVALID_PROPERTY_ID",
      }, {
        label: "PT_SEARCHPROPERTY_TABEL_OWNERNAME",
        type: "text",
        name: "name",
        error: "PAYMENT_INVALID_NAME",
      }, {
        label: "PT_SEARCHPROPERTY_TABEL_DOOR_NO",
        type: "text",
        name: "doorNo",
        error: "ERR_INVALID_DOOR_NO",
      },
    ],
  },
];
