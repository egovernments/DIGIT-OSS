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
            header: "BPA_LICENSE_TYPE",
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
            header: "BPA_LICENSE_DET_CAPTION",
            cardText: "BPA_LICENSE_DETAILS_TEXT",
            submitBarLabel: "CS_COMMON_NEXT",
          },
          nextStep: "Permanent-address",
          key: "LicneseDetails",
          withoutLabel: true,
          hideInEmployee: true,
        },
        {
            type: "component",
            route: "Permanent-address",
            isMandatory: true,
            component: "PermanentAddress",
            texts: {
              headerCaption: "BPA_NEW_ADDRESS_HEADER_DETAILS",
              header: "BPA_LICENSEE_PERM_ADDR_HEADER",
              cardText: "BPA_LICENSEE_PERMANENT_TEXT",
              submitBarLabel: "CS_COMMON_NEXT",
            },
            nextStep: "correspondence-address",
            key: "LicneseDetails",
            withoutLabel: true,
            hideInEmployee: true,
          },
        {
            type: "component",
            route: "correspondence-address",
            isMandatory: true,
            component: "CorrospondenceAddress",
            texts: {
              headerCaption: "BPA_NEW_ADDRESS_HEADER_DETAILS",
              header: "BPA_LICENSEE_CORRESPONDENCE_LABEL",
              cardText: "BPA_LICENSEE_CORRESPONDENCE_TEXT",
              submitBarLabel: "CS_COMMON_NEXT",
            },
            nextStep: "stakeholder-document-details",
            key: "LicneseDetails",
            withoutLabel: true,
            hideInEmployee: true,
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