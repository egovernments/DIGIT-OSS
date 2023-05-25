export const config = [
  {
    texts: {
      header: "TL_SEARCH_TRADE_HEADER",
      submitButtonLabel: "ES_COMMON_SEARCH",
      text: "TL_SEARCH_TEXT",
    },
    inputs: [
      {
        label: "TL_OWNER_MOB_NO_LABEL",
        type: "mobileNumber",
        name: "mobileNumber",
        error: "ERR_INVALID_MOBILE_NUMBER",
      },
      {
        label: "TL_TRADE_LICENSE_LABEL",
        type: "text",
        name: "LicenseNum",
        error: "ERR_INVALID_TRADE_LICENSE_NO",
      },
    ],
  },
];