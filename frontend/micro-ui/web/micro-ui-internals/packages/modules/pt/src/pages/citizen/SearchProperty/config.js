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
        validation:{pattern:{  value: /[6789][0-9]{9}/,
        message: "CORE_COMMON_MOBILE_ERROR",}},
        error: "CORE_COMMON_MOBILE_ERROR",
      },
      {
        label: "PT_PROPERTY_UNIQUE_ID",
        description: "CS_PROPERTY_ID_FORMAT_MUST_BE",
        type: "text",
        name: "propertyIds",
        error: "ERR_INVALID_PROPERTY_ID",
        validation: {
          pattern: {
            value: "[A-Za-z]{2}\-[A-Za-z]{2}\-[0-9]{4}\-[0-9]{2}\-[0-9]{2}\-[0-9]{6}",
            message: "ERR_INVALID_PROPERTY_ID",
          },
        },
      },
      {
        label: "PT_EXISTING_PROPERTY_ID",
        type: "text",
        name: "oldPropertyId",
        error: "ERR_INVALID_PROPERTY_ID",
        validation: {
          pattern: {
            value: "[A-Za-z]{2}\-[A-Za-z]{2}\-[0-9]{4}\-[0-9]{2}\-[0-9]{2}\-[0-9]{6}",
            message: "ERR_INVALID_PROPERTY_ID",
          },
        },
      }, {
        label: "PT_SEARCHPROPERTY_TABEL_OWNERNAME",
        type: "text",
        name: "name",
        validation: {
          pattern: {
            value: "[A-Za-z .`'-]{3,63}",
            message: "PAYMENT_INVALID_NAME",
          },
        },
        error: "PAYMENT_INVALID_NAME",
      }, {
        label: "PT_SEARCHPROPERTY_TABEL_DOOR_NO",
        type: "text",
        name: "doorNo",
        validation:{pattern: {
          value: "[A-Za-z0-9#,/ -()]{1,63}",
          message: "ERR_INVALID_DOOR_NO",
        }},
        error: "ERR_INVALID_DOOR_NO",
      },
    ],
  },
];
