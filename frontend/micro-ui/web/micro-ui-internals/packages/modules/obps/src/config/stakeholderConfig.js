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
            headerCaption: "BPA_LICENSE_DET_CAPTION",
            header: "BPA_LICENSE_TYPE_LABEL",
            cardText: "BPA_LICENSE_TYPE_TEXT",
            submitBarLabel: "CS_COMMONS_NEXT",
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
            header: "BPA_LICENSE_DET_CAPTION",
            cardText: "",
            submitBarLabel: "CS_COMMONS_NEXT",
          },
          nextStep: "stakeholder-docs-required",
          key: "LicneseDetails",
          withoutLabel: true,
          hideInEmployee: true,
        },

      ]
    }
  ] 