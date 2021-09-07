export const loginConfig = [
  {
    texts: {
      header: "CS_FORGOT_PASSWORD",
      submitButtonLabel: "CS_CONTINUE",
      secondaryButtonLabel: "CS_BACK_TO_LOGIN",
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
