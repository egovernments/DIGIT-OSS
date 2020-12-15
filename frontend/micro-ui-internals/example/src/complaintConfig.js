import SelectName from "./SelectName";

export const config = {
  routes: {
    'complaint-type': {
      nextStep: 'pincode'
    },
    'pincode': {
      nextStep: 'name',
    },
    'name': {
      component: 'SelectName',
      texts: {
        header: "CS_ADDCOMPLAINT_COMPLAINT_SUBTYPE_PLACEHOLDER",
        cardText: "CS_COMPLAINT_SUBTYPE_TEXT",
        submitBarLabel: "PT_COMMONS_NEXT",
      },
      inputs: [
        {
          label: "CORE_COMMON_PINCODE",
          type: "text",
          name: "pincode",
          validation: {
            minLength: 6,
            maxLength: 7,
          },
          error: "CORE_COMMON_PINCODE_INVALID",
        },
      ],
      nextStep: 'address',
    }
  }
};