import commonConfig from "config/common.js";

const formConfig = {
  name: "register",
  fields: {
    name: {
      id: "person-name",
      type: "textfield",
      jsonPath: "otp.name",
      required: true,
      floatingLabelText: "CORE_COMMON_NAME",
      errorMessage: "CORE_COMMON_NAME_VALIDMSG",
      hintText: "CORE_COMMON_NAME_PLACEHOLDER",
      pattern: "^([^-!#$%&()*,./:;?@[\\]_{|}¨ˇ“”€+<=>§°\\d\\s¤®™©]| )+$",
    },
    city: {
      id: "person-city",
      jsonPath: "otp.permanentCity",
      required: true,
      floatingLabelText: "CORE_COMMON_CITY",
      hintText: "CORE_COMMON_CITY_PLACEHOLDER",
    },
    tenant: {
      jsonPath: "otp.tenantId",
      value: commonConfig.tenantId,
    },
    phone: {
      id: "person-phone",
      required: true,
      type: "mobilenumber",
      jsonPath: "otp.mobileNumber",
      floatingLabelText: "CORE_COMMON_MOBILE_NUMBER",
      errorMessage: "CORE_COMMON_PHONENO_INVALIDMSG",
      hintText: "CORE_COMMON_PHONE_NUMBER_PLACEHOLDER",
     // pattern: "[1-9]{1}[0-9]{9}",
      maxLength:"10",
    
    },
    type: {
      id: "otp-type",
      jsonPath: "otp.type",
      value: "register",
    },
  },
  submit: {
    label: "CORE_COMMON_CONTINUE",
    id: "login-submit-action",
    type: "submit",
  },
  action: "_send",
  saveUrl: "/user-otp/v1/_send",
  redirectionRoute: "/user/otp",
};

export default formConfig;
