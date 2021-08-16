export const newConfig = [
  {
    head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
    body: [
      {
        route: "docs-required",
        component: "DocsRequired",
        nextStep: "basic-details"
      },
      {
        route: "basic-details",
        component: "BasicDetails",
      },
      {
        route: "scrutiny-details",
        component: "ScrutinyDetails",
        nextStep: "",
        hideInEmployee: true,
        key: "scrutinDetails",
        texts: {
          headerCaption: "BPA_STEPPER_SCRUTINY_DETAILS_HEADER",
          header: "BPA_STEPPER_SCRUTINY_DETAILS_HEADER",
          cardText: "",
          submitBarLabel: "next",
          skipAndContinueText: "",
        },
      },
    ]
  }
]