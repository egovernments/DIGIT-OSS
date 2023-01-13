export const newConfig = [
  {
    head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
    body: [
      // {
      //   route: "stakeholder-docs-required",
      //   component: "StakeholderDocsRequired",
      //   key: "data",
      //   nextStep: "provide-license-type"
      // },
      {
        type: "component",
        route: "provide-license-type",
        isMandatory: true,
        component: "LicenseType",
        texts: {
          headerCaption: "Applicant Type",
          header: "",
          cardText: "",
          submitBarLabel: "CS_COMMON_NEXT",
        },
        nextStep: "license-add-info",
        key: "LicneseType",
        withoutLabel: true,
        hideInEmployee: true,
      },
      // {
      //   type: "component",
      //   route: "license-details",
      //   isMandatory: true,
      //   component: "LicenseDetails",
      //   texts: {
      //     headerCaption: "Authorized User",
      //     header: "",
      //     cardText: "",
      //     submitBarLabel: "CS_COMMON_NEXT",
      //   },
      //   nextStep: "license-add-info",
      //   key: "LicneseDetails",
      //   withoutLabel: true,
      //   hideInEmployee: true,
      // },
      {
        type: "component",
        route: "license-add-info",
        isMandatory: true,
        component: "LicenseAddInfo",
        texts: {
        headerCaption: "Applicant Information",
        header: "",
        cardText: "",
        submitBarLabel: "CS_COMMON_NEXT"
        },
        nextStep: "add-authorized-user",
        key: "LicenseAddInfo",
        withoutLabel: true,
        hideInEmployee: true
      },
      {
        type: "component",
        route: "add-authorized-user",
        isMandatory: true,
        component: "AddAuthorizedUser",
        texts: {
        headerCaption: "Authorized User",
        header: "",
        cardText: "",
        submitBarLabel: "CS_COMMON_NEXT"
        },
        nextStep: "developer-capacity",
        key: "AddAuthorizedUser",
        withoutLabel: true,
        hideInEmployee: true
      },
      {
        type: "component",
        route: "developer-capacity",
        isMandatory: true,
        component: "DeveloperCapacity",
        texts: {
        headerCaption: "Developer Capacity",
        header: "",
        cardText: "",
        submitBarLabel: "CS_COMMON_NEXT"
        },
        nextStep: "stakeholder-document-details",
        key: "DeveloperCapacity",
        withoutLabel: true,
        hideInEmployee: true
      },
      {
          route: "stakeholder-document-details",
          component: "StakeholderDocuments",
          nextStep: null,
          key: "documents",
          texts: {
            headerCaption: "BPA_DOCUMENT_DETAILS_LABEL",
            header: "BPA_LICENSEE_DOCUMENT_DETAILS_HEADER",
            submitBarLabel: "CS_COMMON_NEXT"
          }
      },


    ]
  }
] 