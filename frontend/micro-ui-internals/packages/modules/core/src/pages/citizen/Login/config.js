export const loginSteps = [
  {
    texts: {
      header: "CS_LOGIN_PROVIDE_MOBILE_NUMBER",
      cardText: "CS_LOGIN_TEXT",
      nextText: "PT_COMMONS_NEXT",
      submitBarLabel: "PT_COMMONS_NEXT",
    },
    inputs: [
      {
        label: "CORE_COMMON_MOBILE_NUMBER",
        type: "text",
        name: "mobileNumber",
        error: "ERR_HRMS_INVALID_MOB_NO",
        validation: {
          required: true,
          minLength: 10,
          maxLength: 10,
        },
      },
    ],
  },
  {
    texts: {
      header: "CS_LOGIN_OTP",
      cardText: "CS_LOGIN_OTP_TEXT",
      nextText: "PT_COMMONS_NEXT",
      submitBarLabel: "PT_COMMONS_NEXT",
    },
  },
  {
    texts: {
      header: "CS_LOGIN_PROVIDE_NAME",
      cardText: "CS_LOGIN_NAME_TEXT",
      nextText: "PT_COMMONS_NEXT",
      submitBarLabel: "PT_COMMONS_NEXT",
    },
    inputs: [
      {
        label: "CORE_COMMON_NAME",
        type: "text",
        name: "name",
        validation: {
          required: true,
        },
      },
    ],
  },
];
