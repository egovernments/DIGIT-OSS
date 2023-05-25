export const config = [
  {
    texts: {
      header: "UC_SEARCH_CHALLAN_LABEL",
      submitBarLabel: "UC_SEARCH_LABEL",
      cardText: "UC_HOME_SEARCH_RESULTS_DESC",
    },
    inputs: [
      {
        label: "UC_SEARCH_MOBILE_NO_LABEL",
        type: "mobileNumber",
        name: "mobileNumber",
        error: "CORE_COMMON_PHONENO_INVALIDMSG",
      },
      {
        label: "UC_CHALLAN_NO",
        //description: "CS_PROPERTY_ID_FORMAT_MUST_BE",
        type: "number",
        name: "ChallanNo",
        error: "UC_WRONG_CHALLAN_NO",
      },
      {
        label: "UC_SERVICE_CATEGORY_LABEL",
        type: "any",
        name: "ServiceCategory",
        error: "UC_INVALID_SERVICE_CATEGORY",
      },
    ],
  },
];
