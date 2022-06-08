const formConfig = {
  name: "employeeOTP",
  fields: {
    otpReference: {
      id: "employee-forgot-password-otp",
      required: true,
      jsonPath: "otpReference",
      floatingLabelText: "CORE_OTP_OTP",
      errorMessage: "CORE_OTP_ERRORMSG",
      hintText: "CORE_OTP_PLACEHOLDER",
      pattern: "^([0-9]){6}$",
    },
    newPassword: {
      id: "employee-forgot-password-new-password",
      jsonPath: "newPassword",
      required: true,
      type: "password",
      floatingLabelText: "CORE_LOGIN_NEW_PASSWORD",
      errorMessage: "CORE_LOGIN_PASSWORD_ERRORMSG",
      hintText: "CORE_LOGIN_NEW_PASSWORD_PLACEHOLDER",
      pattern: "^([a-zA-Z0-9@])+$",
      value: "",
    },
    confirmnewpassword: {
      id: "employee-forgot-password-confirm-new-password",
      jsonPath: "newPassword",
      required: true,
      type: "password",
      floatingLabelText: "CORE_LOGIN_CONFIRM_NEW_PASSWORD",
      errorMessage: "CORE_LOGIN_PASSWORD_ERRORMSG",
      hintText: "CORE_LOGIN_CONNFIRM_NEW_PASSWORD_PLACEHOLDER",
      pattern: "^([a-zA-Z0-9@])+$",
      value: "",
    },
  },
  submit: {
    type: "submit",
    label: "CORE_COMMON_CHANGE_PASSWORD",
    id: "forgot-password-submit-action",
  },
  saveUrl: "/user/password/nologin/_update",
  redirectionRoute: "/employee/user/login",
  action: "_update",
};

export default formConfig;
