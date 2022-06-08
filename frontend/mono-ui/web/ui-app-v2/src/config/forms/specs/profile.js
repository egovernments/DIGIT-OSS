const formConfig = {
  name: "profile",
  fields: {
    name: {
      id: "profile-form-name",
      className: "profile-form-field",
      type: "textfield",
      jsonPath: "user.name",
      required: true,
      floatingLabelText: "CORE_COMMON_NAME",
      errorMessage: "CORE_COMMON_NAME_VALIDMSG",
      hintText: "CORE_COMMON_NAME_PLACEHOLDER",
      pattern: "^([^-!#$%&()*,./:;?@[\\]_{|}¨ˇ“”€+<=>§°\\d\\s¤®™©]| )+$",
    },
    city: {
      id: "profile-form-city",
      jsonPath: "user.location.city",
      required: true,
      floatingLabelText: "CORE_COMMON_CITY",
      hintText: "CORE_COMMON_CITY_PLACEHOLDER",
    },
    email: {
      id: "profile-form-email",
      className: "profile-form-field",
      type: "name",
      type: "textfield",
      jsonPath: "user.contact.email",
      floatingLabelText: "CS_PROFILE_EMAIL",
      hintText: "CS_PROFILE_EMAIL_PLACEHOLDER",
      errorMessage: "CS_PROFILE_EMAIL_ERRORMSG",
      pattern: "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
    },
  },
  submit: {
    label: "CS_PROFILE_SAVE",
    id: "profile-save-action",
    type: "submit",
  },
  toast: "Profile is Successfully Updated",
  saveUrl: "/user/profile/_update",
};

export default formConfig;
