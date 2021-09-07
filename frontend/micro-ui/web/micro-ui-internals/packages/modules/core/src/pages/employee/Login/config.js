export const loginConfig = [
  {
    texts: {
      header: "CS_LOGIN",
      submitButtonLabel: "CS_LOGIN",
      secondaryButtonLabel: "CS_FORGOT_PASSWORD",
    },
    inputs: [
      {
        label: "CORE_COMMON_USER_ID",
        type: "text",
        name: "username",
        error: "ERR_HRMS_INVALID_USER_ID",
      },
      {
        label: "CORE_COMMON_PASSWORD",
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
