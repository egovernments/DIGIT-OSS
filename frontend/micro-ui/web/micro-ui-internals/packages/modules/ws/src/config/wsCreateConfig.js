export const newConfig = [
  {
    head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
    body: [
      {
        route: "docs-required",
        component: "WSDocsRequired",
        key: "data",
        nextStep: "connection-holder"
      },
      {
        route: "connection-holder",
        component: "ConnectionHolder",
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
  }
]