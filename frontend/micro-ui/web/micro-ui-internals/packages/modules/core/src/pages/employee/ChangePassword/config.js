export const config = [
  {
    texts: {
      header: "CORE_COMMON_RESET_PASSWORD_LABEL",
      submitButtonLabel: "CORE_COMMON_CHANGE_PASSWORD",
    },
    inputs: [
      {
        label: "CORE_LOGIN_USERNAME",
        type: "text",
        name: "userName",
        error: "ERR_HRMS_INVALID_USERNAME",
      },
      {
        label: "CORE_LOGIN_NEW_PASSWORD",
        type: "password",
        name: "newPassword",
        error: "CORE_COMMON_REQUIRED_ERRMSG",
      },
      {
        label: "CORE_LOGIN_CONFIRM_NEW_PASSWORD",
        type: "password",
        name: "confirmPassword",
        error: "CORE_COMMON_REQUIRED_ERRMSG",
      },
    ],
  },
];
