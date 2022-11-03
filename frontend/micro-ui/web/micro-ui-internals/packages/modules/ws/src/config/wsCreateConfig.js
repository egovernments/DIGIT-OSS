export const newConfig = [
  {
    head: "",
    body: [
      {
        //if want to input index in url just pul @0 after route name owner-ship-details@0
        type: "component",
        route: "know-your-property",
        isMandatory: true,
        component: "CPTKnowYourProperty",
        texts: {
          header: "PT_DO_YOU_KNOW_YOUR_PROPERTY",
          submitBarLabel: "CS_COMMON_NEXT",
        },
        key: "knowyourproperty",
        withoutLabel: true,
        nextStep: {
          TL_COMMON_YES: "search-property",
          TL_COMMON_NO: "create-property",
        },
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "search-property",
        isMandatory: true,
        component: "CPTSearchProperty",
        key: "cptsearchproperty",
        withoutLabel: true,
        nextStep: 'search-results',
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "search-results",
        isMandatory: true,
        component: "CPTSearchResults",
        key: "cptsearchresults",
        withoutLabel: true,
        nextStep: 'docsrequired',
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "create-property",
        isMandatory: true,
        component: "CPTCreateProperty",
        key: "cptcreateproperty",
        withoutLabel: true,
        nextStep: 'acknowledge-create-property',
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "acknowledge-create-property",
        isMandatory: true,
        component: "CPTAcknowledgement",
        key: "cptacknowledgement",
        withoutLabel: true,
        nextStep: 'docsrequired',
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "property-details",
        isMandatory: true,
        component: "CPTPropertyDetails",
        key: "propertydetails",
        withoutLabel: true,
        nextStep: 'connection-holder',
        hideInEmployee: true,
      },
    ],
  },
  {
    head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
    body: [
      {
        route: "docsrequired",
        component: "WSDocsRequired",
        key: "data",
        nextStep: "property-details"
      },
      {
        route: "connection-holder",
        component: "WSConnectionHolder",
        key: "ConnectionHolderDetails",
        nextStep: "service-name",
        texts: {
          headerCaption: "WS_COMMON_CONNECTION_DETAIL",
          header: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
          cardText: "WS_CONNECTION_HOLDER_TEXT",
          submitBarLabel: "CS_COMMON_NEXT",
        }
      },
      {
        route: "service-name",
        component: "WSServiceName",
        key: "serviceName",
        nextStep: "water-connection-details",
        WATER: "water-connection-details",
        SEWERAGE: "sewerage-connection-details",
        texts: {
          headerCaption: "WS_COMMON_CONNECTION_DETAIL",
          header: "WS_SERVICE_NAME",
          cardText: "",
          submitBarLabel: "CS_COMMON_NEXT",
        }
      },
      {
        route: "water-connection-details",
        component: "WSWaterConnectionDetails",
        key: "waterConectionDetails",
        nextStep: "sewerage-connection-details",
        WATER: "document-details",
        texts: {
          headerCaption: "WS_COMMON_CONNECTION_DETAIL",
          header: "WS_WATER_CONNECTION_DETAILS",
          cardText: "WS_PROVIDE_PROPOSED_NO_OF_TAPS_SELECT_PIPE_SIZE",
          submitBarLabel: "CS_COMMON_NEXT",
        }
      },
      {
        route: "sewerage-connection-details",
        component: "WSSewerageConnectionDetails",
        key: "sewerageConnectionDetails",
        nextStep: "document-details",
        SEWERAGE: "document-details",
        texts: {
          headerCaption: "WS_COMMON_CONNECTION_DETAIL",
          header: "PDF_STATIC_LABEL_SW_CONSOLIDATED_ACKNOWELDGMENT_LOGO_SUB_HEADER",
          cardText: "WS_PROVIDE_NO_WATER_CLOSETS_TOILETS",
          submitBarLabel: "CS_COMMON_NEXT",
        }
      },
      // {
      //   route: "plumber-preference",
      //   component: "WSPlumberPreference",
      //   key: "plumberPreference",
      //   nextStep: "document-details",
      //   texts: {
      //     headerCaption: "WS_COMMON_CONNECTION_DETAIL",
      //     header: "WS_PLUMBER_PREFERENCE",
      //     cardText: "",
      //     submitBarLabel: "CS_COMMON_NEXT",
      //   }
      // },
      {
        route: "document-details",
        component: "WSDocumentDetails",
        key: "documents",
        nextStep: null,
        texts: {
          headerCaption: "CE_DOCUMENT_DETAILS",
          header: "WS_DOCUMENT_DETAILS_HEADER",
          submitBarLabel: "CS_COMMON_NEXT",
        }
      }
    ]
  },
  {
    head: "WS_APP_FOR_WATER_AND_SEWERAGE_LABEL",
    isCreate: true,
    hideInCitizen: true,
    body: [{
      // For UM-4418 changes
      head: "",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          type: "component",
          key: "InfoLabel",
          component: "WSInfoLabel",
          withoutLabel: true
        }
      ]
    },
    {
      head: "",
      isEditConnection: true,
      isCreateConnection: false,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          component: "WSEditConnectionDetails",
          withoutLabel: true,
          key: "ConnectionDetails",
          type: "component",
          hideInCitizen: true
        },
      ],
    },
    {
      head: "WS_COMMON_PROPERTY_DETAILS",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          component: "CPTPropertySearchNSummary",
          withoutLabel: true,
          key: "cpt",
          type: "component",
          hideInCitizen: true
        },
      ],
    },
    {
      head: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "ConnectionHolderDetails",
        component: "WSConnectionHolderDetails",
        withoutLabel: true
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      isEditConnection: false,
      isCreateConnection: false,
      isModifyConnection: true,
      body: [{
        type: "component",
        key: "connectionDetails",
        component: "WSActivationConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_ACTIVATION_DETAILS",
      isEditConnection: false,
      isCreateConnection: false,
      isModifyConnection: true,
      body: [{
        type: "component",
        key: "activationDetails",
        component: "WSActivationPageDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      subHead: "WS_CONNECTION_DETAILS_HEADER_SUB_TEXT_LABEL",
      isEditConnection: false,
      isCreateConnection: true,
      body: [{
        type: "component",
        key: "ConnectionDetails",
        component: "WSConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "connectionDetails",
        component: "WSActivationConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_PLUMBER_DETAILS",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "plumberDetails",
        component: "WSActivationPlumberDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_ROAD_CUTTING_DETAILS",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "roadCuttingDetails",
        component: "WSRoadCuttingDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_DOCS",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "DocumentsRequired",
        component: "WSDocumentsEmployee",
        withoutLabel: true
      }]
    }
    ]
  },
  {
    head: "WS_APP_FOR_WATER_AND_SEWERAGE_LABEL",
    isModify: true,
    hideInCitizen: true,
    body: [{
      // For UM-4418 changes
      head: "",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          type: "component",
          key: "InfoLabel",
          component: "WSInfoLabel",
          withoutLabel: true
        }
      ]
    },
    {
      head: "",
      isEditConnection: true,
      isCreateConnection: false,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          component: "WSEditConnectionDetails",
          withoutLabel: true,
          key: "ConnectionDetails",
          type: "component",
          hideInCitizen: true
        },
      ],
    },
    {
      head: "WS_COMMON_PROPERTY_DETAILS",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          component: "CPTPropertySearchNSummary",
          withoutLabel: true,
          key: "cpt",
          type: "component",
          hideInCitizen: true
        },
      ],
    },
    {
      head: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "ConnectionHolderDetails",
        component: "WSConnectionHolderDetails",
        withoutLabel: true
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      isEditConnection: false,
      isCreateConnection: false,
      isModifyConnection: true,
      body: [{
        type: "component",
        key: "connectionDetails",
        component: "WSActivationConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_ACTIVATION_DETAILS",
      isEditConnection: false,
      isCreateConnection: false,
      isModifyConnection: true,
      body: [{
        type: "component",
        key: "activationDetails",
        component: "WSActivationPageDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      isEditConnection: false,
      isCreateConnection: true,
      body: [{
        type: "component",
        key: "ConnectionDetails",
        component: "WSConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "connectionDetails",
        component: "WSActivationConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_PLUMBER_DETAILS",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "plumberDetails",
        component: "WSActivationPlumberDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_ROAD_CUTTING_DETAILS",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "roadCuttingDetails",
        component: "WSRoadCuttingDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_DOCS",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "DocumentsRequired",
        component: "WSDocumentsEmployee",
        withoutLabel: true
      }]
    }
    ]
  },
  {
    head: "WS_APP_FOR_WATER_AND_SEWERAGE_LABEL",
    isEdit: true,
    hideInCitizen: true,
    body: [{
      // For UM-4418 changes
      head: "",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          type: "component",
          key: "InfoLabel",
          component: "WSInfoLabel",
          withoutLabel: true
        }
      ]
    },
    {
      head: "",
      isEditConnection: true,
      isCreateConnection: false,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          component: "WSEditConnectionDetails",
          withoutLabel: true,
          key: "ConnectionDetails",
          type: "component",
          hideInCitizen: true
        },
      ],
    },
    {
      head: "WS_COMMON_PROPERTY_DETAILS",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          component: "CPTPropertySearchNSummary",
          withoutLabel: true,
          key: "cpt",
          type: "component",
          hideInCitizen: true
        },
      ],
    },
    {
      head: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "ConnectionHolderDetails",
        component: "WSConnectionHolderDetails",
        withoutLabel: true
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      isEditConnection: false,
      isCreateConnection: false,
      isModifyConnection: true,
      body: [{
        type: "component",
        key: "connectionDetails",
        component: "WSActivationConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_ACTIVATION_DETAILS",
      isEditConnection: false,
      isCreateConnection: false,
      isModifyConnection: true,
      body: [{
        type: "component",
        key: "activationDetails",
        component: "WSActivationPageDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      isEditConnection: false,
      isCreateConnection: true,
      body: [{
        type: "component",
        key: "ConnectionDetails",
        component: "WSConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "connectionDetails",
        component: "WSActivationConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_PLUMBER_DETAILS",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "plumberDetails",
        component: "WSActivationPlumberDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_ROAD_CUTTING_DETAILS",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "roadCuttingDetails",
        component: "WSRoadCuttingDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_DOCS",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "DocumentsRequired",
        component: "WSDocumentsEmployee",
        withoutLabel: true
      }]
    }
    ]
  },
  {
    head: "WS_APP_FOR_WATER_AND_SEWERAGE_LABEL",
    isEditByConfig: true,
    hideInCitizen: true,
    body: [{
      // For UM-4418 changes
      head: "",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          type: "component",
          key: "InfoLabel",
          component: "WSInfoLabel",
          withoutLabel: true
        }
      ]
    },
    {
      head: "",
      isEditConnection: true,
      isCreateConnection: false,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          component: "WSEditConnectionDetails",
          withoutLabel: true,
          key: "ConnectionDetails",
          type: "component",
          hideInCitizen: true
        },
      ],
    },
    {
      head: "WS_COMMON_PROPERTY_DETAILS",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [
        {
          component: "CPTPropertySearchNSummary",
          withoutLabel: true,
          key: "cpt",
          type: "component",
          hideInCitizen: true
        },
      ],
    },
    {
      head: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "ConnectionHolderDetails",
        component: "WSConnectionHolderDetails",
        withoutLabel: true
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      isEditConnection: false,
      isCreateConnection: false,
      isModifyConnection: true,
      body: [{
        type: "component",
        key: "connectionDetails",
        component: "WSActivationConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_ACTIVATION_DETAILS",
      isEditConnection: false,
      isCreateConnection: false,
      isModifyConnection: true,
      body: [{
        type: "component",
        key: "activationDetails",
        component: "WSActivationPageDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      isEditConnection: false,
      isCreateConnection: true,
      body: [{
        type: "component",
        key: "ConnectionDetails",
        component: "WSConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_CONNECTION_DETAIL",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "connectionDetails",
        component: "WSActivationConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_PLUMBER_DETAILS",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "plumberDetails",
        component: "WSActivationPlumberDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_ROAD_CUTTING_DETAILS",
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "roadCuttingDetails",
        component: "WSRoadCuttingDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_DOCS",
      isEditConnection: true,
      isCreateConnection: true,
      isModifyConnection: true,
      isEditByConfigConnection: true,
      body: [{
        type: "component",
        key: "DocumentsRequired",
        component: "WSDocumentsEmployee",
        withoutLabel: true
      }]
    }
    ]
  }
]