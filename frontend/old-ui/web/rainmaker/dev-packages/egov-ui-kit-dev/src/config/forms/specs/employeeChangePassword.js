const formConfig = {
  name: "employeeChangePassword",
  fields: {
    existingPassword: {
      id: "employee-current-password",
      jsonPath: "existingPassword",
      required: true,
      type: "password",
      floatingLabelText: "CORE_CHANGEPASSWORD_EXISTINGPASSWORD",
      errorMessage: "CORE_CHANGEPASSWORD_EXISTINGPASSWORD_INVALIDMSG",
      hintText: "CORE_CHANGEPASSWORD_EXISTINGPASSWORD_PLACEHOLDER",
      pattern: "^([a-zA-Z0-9@#$%])+$",
      value: "",
    },
    newpassword: {
      id: "employee-new-password",
      jsonPath: "newPassword",
      required: true,
      type: "password",
      floatingLabelText: "CORE_LOGIN_NEW_PASSWORD",
      errorMessage: "CORE_LOGIN_PASSWORD_ERRORMSG",
      hintText: "CORE_LOGIN_NEW_PASSWORD_PLACEHOLDER",
      pattern: "^([a-zA-Z0-9@#$%])+$",
      value: "",
    },
    confirmnewpassword: {
      id: "employee-confirm-new-password",
      jsonPath: "newPassword",
      required: true,
      type: "password",
      floatingLabelText: "CORE_LOGIN_CONFIRM_NEW_PASSWORD",
      errorMessage: "CORE_LOGIN_PASSWORD_ERRORMSG",
      hintText: "CORE_LOGIN_CONNFIRM_NEW_PASSWORD_PLACEHOLDER",
      pattern: "^([a-zA-Z0-9@#$%])+$",
      value: "",
    },
  },
  submit: {
    type: "submit",
    label: "CORE_COMMON_CHANGE_PASSWORD",
    id: "employee-change-password-submit-action",
  },
  saveUrl: "/user/password/_update",
  redirectionRoute: "/inbox",
  action: "_update",
};

export default formConfig;
