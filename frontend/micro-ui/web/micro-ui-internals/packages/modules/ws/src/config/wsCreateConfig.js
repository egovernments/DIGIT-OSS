export const newConfig = [
  {
    head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
    body: [
      {
        route: "docs-required",
        component: "WSDocsRequired",
        key: "data",
        nextStep: "know-your-property"
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
        WATER: "plumber-preference",
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
        nextStep: "plumber-preference",
        SEWERAGE: "plumber-preference",
        texts: {
          headerCaption: "WS_COMMON_CONNECTION_DETAIL",
          header: "PDF_STATIC_LABEL_SW_CONSOLIDATED_ACKNOWELDGMENT_LOGO_SUB_HEADER",
          cardText: "WS_PROVIDE_NO_WATER_CLOSETS_TOILETS",
          submitBarLabel: "CS_COMMON_NEXT",
        }
      },
      {
        route: "plumber-preference",
        component: "WSPlumberPreference",
        key: "plumberPreference",
        nextStep: "document-details",
        texts: {
          headerCaption: "WS_COMMON_CONNECTION_DETAIL",
          header: "WS_PLUMBER_PREFERENCE",
          cardText: "",
          submitBarLabel: "CS_COMMON_NEXT",
        }
      },
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
        nextStep: 'property-details',
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
        nextStep: 'connection-holder',
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
    head: "WS_APP_FOR_WATER_AND_SEWERAGE_LABEL",
    hideInCitizen: true,
    body: [{
      head: "",
      isEditConnection: true,
      isCreateConnection: true,
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
      isCreateConnection: true,
      body: [{
        type: "component",
        key: "ConnectionDetails",
        component: "WSConnectionDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_ROAD_CUTTING_DETAILS",
      isEditConnection: true,
      isCreateConnection: false,
      body:[{
        type: "component",
        key: "RoadCuttingDetails",
        component: "WSRoadCuttingDetails",
        withoutLabel: true,
      }]
    },
    {
      head: "WS_COMMON_DOCS",
      isEditConnection: true,
      isCreateConnection: true,
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