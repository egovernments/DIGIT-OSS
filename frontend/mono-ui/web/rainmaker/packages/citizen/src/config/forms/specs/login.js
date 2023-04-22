import commonConfig from "config/common.js";

const formConfig = {
  name: "login",
  fields: {
    phone: {
      id: "person-phone",
      type: "mobilenumber",
      jsonPath: "otp.mobileNumber",
      required: true,
      floatingLabelText: "CORE_COMMON_MOBILE_NUMBER",
      errorMessage: "CORE_COMMON_PHONENO_INVALIDMSG",
      hintText: "CORE_COMMON_PHONE_NUMBER_PLACEHOLDER",
      // pattern: "^([0-9]){10}$",
      maxLength:"10",
      value: "",
    },
    type: {
      id: "otp-type",
      jsonPath: "otp.type",
      value: "login",
    },
    city: {
      id: "person-city",
      jsonPath: "otp.tenantId",
      value: commonConfig.tenantId,
    },
    userType: {
      id: "user-type",
      jsonPath: "otp.userType",
      value: "CITIZEN",
    },
    citizenConsentForm: {
      errorMessage: "Citizen Consent Form",
      floatingLabelText: "Citizen Consent Form",
      hintText: "Please check Citizen Consent Form",
      id: "person-Citizen Consent Form",
      jsonPath: "otp.CitizenConsentForm",
      required: true,
      requiredmessage: "Required",
      type: "checkbox",
    }
  },
  submit: {
    type: "submit",
    label: "CORE_COMMON_CONTINUE",
    id: "login-submit-action",
  },
  saveUrl: "/user-otp/v1/_send",
  redirectionRoute: "/user/otp",
  action: "token",
};

export default formConfig;
