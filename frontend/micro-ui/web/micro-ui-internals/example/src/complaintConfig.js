export const config = {
  routes: {
    "complaint-type": {
      nextStep: "pincode",
    },
    landmark: {
      nextStep: "apartment",
    },
    apartment: {
      component: "SelectName",
      texts: {
        header: "Apartment or Society",
        cardText: "CS_COMPLAINT_SUBTYPE_TEXT",
        submitBarLabel: "PT_COMMONS_NEXT",
      },
      inputs: [
        {
          label: "Apartment",
          type: "text",
          name: "custom.additionalDetails.apartment",
          validation: {
            minLength: 6,
            maxLength: 7,
          },
          error: "CORE_COMMON_PINCODE_INVALID",
        },
      ],
      nextStep: "upload-photos",
    },
  },
};
