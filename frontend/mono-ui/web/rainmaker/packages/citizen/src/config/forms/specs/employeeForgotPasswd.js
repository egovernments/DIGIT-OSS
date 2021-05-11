import commonConfig from "config/common.js";

const formConfig = {
  name: "employeeForgotPasswd",
  fields: {
    username: {
      id: "person-phone",
      jsonPath: "otp.mobileNumber",
      required: true,
      floatingLabelText: "CORE_LOGIN_USERNAME",
      errorMessage: "CORE_COMMON_USERNAME_INVALIDMSG",
      hintText: "CORE_LOGIN_USERNAME_PLACEHOLDER",
      pattern: "^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$",
    },
    type: {
      id: "otp-type",
      jsonPath: "otp.type",
      value: "passwordreset",
    },
    tenantId: {
      id: "employee-forgot-password-tenantId",
      jsonPath: "otp.tenantId",
      value:""
    },
  },
  submit: {
    type: "submit",
    label: "CORE_COMMON_CONTINUE",
    id: "employee-forgot-password-submit-action",
  },
  saveUrl: "/user-otp/v1/_send",
  redirectionRoute: "/user/otp",
  action: "token",
};
export default formConfig;
