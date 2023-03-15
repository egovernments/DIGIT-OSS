import {getLocaleLabels} from "egov-ui-framework/ui-utils/commons.js";
const formConfig = {
  name: "profileEmployee",
  fields: {
    name: {
      id: "profile-form-name",
      required: true,
      floatingLabelText: "CORE_COMMON_NAME",
      errorMessage: "CORE_COMMON_NAME_VALIDMSG",
      hintText: "CORE_COMMON_NAME_PLACEHOLDER",
      pattern: "^[A-z]+(\\s?[A-z])*$",
      errorText: "",
      value: "",
    },
    phonenumber: {
      id: "profile-form-phonenumber",
      floatingLabelText: "CORE_COMMON_PHONE_NUMBER",
      errorMessage: "CORE_COMMON_PHONENO_INVALIDMSG",
      hintText: "CORE_COMMON_PHONE_NUMBER_PLACEHOLDER",
      errorText: "",
      value: "",
    },
    email: {
      id: "profile-form-email",
      floatingLabelText: "CS_PROFILE_EMAIL",
      hintText: "CS_PROFILE_EMAIL_PLACEHOLDER",
      errorMessage: "CS_PROFILE_EMAIL_ERRORMSG",
      pattern: "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
      errorText: "",
      value: "",
    },
  },
  submit: {
    label: "CS_PROFILE_SAVE",
    id: "profile-save-action",
    type: "submit",
  },
  toast: getLocaleLabels("PROFILE_UPDATED","PROFILE_UPDATED"),
  saveUrl: "/user/profile/_update",
};

export default formConfig;
