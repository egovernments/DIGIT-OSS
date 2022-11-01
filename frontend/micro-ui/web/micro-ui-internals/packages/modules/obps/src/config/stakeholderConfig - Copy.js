export const newConfig = [
  {
    head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
    body: [
      {
        route: "stakeholder-docs-required",
        component: "StakeholderDocsRequired",
        key: "data",
        nextStep: "provide-license-type"
      },
      {
        type: "component",
        route: "provide-license-type",
        isMandatory: true,
        component: "LicenseType",
        texts: {
          headerCaption: "BPA_LICENSE_TYPE",
          header: "",
          cardText: "BPA_LICENSE_TYPE_TEXT",
          submitBarLabel: "CS_COMMON_NEXT",
        },
        nextStep: "license-details",
        key: "LicneseType",
        withoutLabel: true,
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "license-details",
        isMandatory: true,
        component: "LicenseDetails",
        texts: {
          headerCaption: "BPA_LICENSE_DET_CAPTION",
          header: "",
          cardText: "",
          submitBarLabel: "CS_COMMON_NEXT",
        },
        nextStep: "license-add-info",
        key: "LicneseDetails",
        withoutLabel: true,
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "license-add-info",
        isMandatory: true,
        component: "LicenseAddInfo",
        texts: {
        headerCaption: "Add Developer Details",
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
        headerCaption: "Add Authorized User",
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