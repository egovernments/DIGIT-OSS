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
        nextStep: "scrutiny-details" 
      },
      {
        route: "scrutiny-details",
        component: "ScrutinyDetails",
        nextStep: "location",
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
      {
        route: "location",
        component: "LocationDetails",
        nextStep: "owner-details",
        hideInEmployee: true,
        key: "address",
        texts: {
          headerCaption: "BPA_STEPPER_SCRUTINY_DETAILS_HEADER",
          header: "BPA_NEW_TRADE_DETAILS_HEADER_DETAILS",
          cardText: "",
          submitBarLabel: "next",
          skipAndContinueText: "",
        },
      },
      {
        route: "owner-details",
        component: "OwnerDetails",
        nextStep: "document-details",
        key: "owners",
        texts: {
          headerCaption: "BPA_OWNER_AND_DOCUMENT_DETAILS_LABEL",
          header: "BPA_APPLICANT_DETAILS_HEADER",
          submitBarLabel: "CS_COMMON_NEXT"
        }
      },
      {
        route: "document-details",
        component: "DocumentDetails",
        nextStep: "",
        key: "documents",
        texts: {
          headerCaption: "BPA_OWNER_AND_DOCUMENT_DETAILS_LABEL",
          header: "BPA_DOCUMENT_DETAILS_LABEL",
          submitBarLabel: "CS_COMMON_NEXT"
        }
      }
    ]
  }
]