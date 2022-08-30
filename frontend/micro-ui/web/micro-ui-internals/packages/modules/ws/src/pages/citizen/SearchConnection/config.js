export const config = [
    {
      texts: {
        header: "WS_SEARCH_CONNECTION",
        submitBarLabel: "WS_SEARCH_LABEL",
        cardText: "",
      },
      inputs: [
        {
          label: "CORE_COMMON_MOBILE_NUMBER",
          type: "mobileNumber",
          name: "mobileNumber",
          error: "CORE_COMMON_PHONENO_INVALIDMSG",
        },
        {
          label: "WS_PROP_DETAIL_CITY",
          //description: "CS_PROPERTY_ID_FORMAT_MUST_BE",
          //type: "number",
          name: "city",
          error: "WS_WRONG_CITY",
        },
        {
          label: "WS_PROP_DETAIL_LOCALITY_LABEL",
          type: "any",
          name: "locality",
          error: "UC_INVALID_LOCALITY",
        },
      ],
    },
  ];