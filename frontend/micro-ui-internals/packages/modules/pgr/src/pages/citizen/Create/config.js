export const newComplaintSteps = [
  {
    texts: {
      subHeader: "",
      header: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
      cardText: "CS_COMPLAINT_TYPE_TEXT",
      submitBarLabel: "PT_COMMONS_NEXT",
    },
  },
  {
    texts: {
      header: "CS_ADDCOMPLAINT_COMPLAINT_SUBTYPE_PLACEHOLDER",
      cardText: "CS_COMPLAINT_SUBTYPE_TEXT",
      submitBarLabel: "PT_COMMONS_NEXT",
    },
  },
  {
    texts: {
      subHeader: "Test",
      header: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
      cardText: "CS_COMPLAINT_TYPE_TEXT",
      nextText: "PT_COMMONS_NEXT",
    },
    inputs: [
      {
        label: "",
        type: "textarea",
        name: "details",
        validation: {},
      },
    ],
  },
];
