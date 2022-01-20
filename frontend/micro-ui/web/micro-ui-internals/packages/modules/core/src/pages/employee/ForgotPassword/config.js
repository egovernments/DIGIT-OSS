export const loginConfig = [
  {
    texts: {
      header: "CORE_COMMON_FORGOT_PASSWORD_LABEL",
      description: "ES_FORGOT_PASSWORD_DESC",
      submitButtonLabel: "CORE_COMMON_CONTINUE",
    },
    inputs: [
      {
        label: "CORE_COMMON_MOBILE_NUMBER",
        type: "text",
        name: "mobileNumber",
        error: "ERR_HRMS_INVALID_MOBILE_NUMBER",
      },
      {
        label: "CORE_COMMON_CITY",
        type: "custom",
        name: "city",
        error: "ERR_HRMS_INVALID_CITY",
      },
    ],
  },
];
