export const loginConfig = [
  {
    texts: {
      header: "CORE_COMMON_LOGIN",
      submitButtonLabel: "CORE_COMMON_CONTINUE",
      secondaryButtonLabel: "CORE_COMMON_FORGOT_PASSWORD",
    },
    inputs: [
      {
        label: "CORE_LOGIN_USERNAME",
        type: "text",
        name: "username",
        error: "ERR_HRMS_INVALID_USER_ID",
      },
      {
        label: "CORE_LOGIN_PASSWORD",
        type: "password",
        name: "password",
        error: "ERR_HRMS_WRONG_PASSWORD",
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
