export const newConfig = [
  {
    head: "",
    body: [
      {       
        route: "docsrequired",
        component: "WSDisconnectionDocsRequired",
        key: "data",
        type: "component",
        // isMandatory: true,
        withoutLabel: true,
        nextStep: "application-form",
        // hideInEmployee: true,
      },
      {         
        route: "application-form",
        component: "WSDisconnectionForm",
        key: "WSDisconnectionForm",
        type: "component",
        // isMandatory: true,
        withoutLabel: true,
        nextStep: "documents-upload",
        // hideInEmployee: true,
      },
      {         
        route: "documents-upload",
        component: "WSDisconnectionDocumentsForm",
        key: "WSDisconnectionDocumentsForm",
        type: "component",
        isMandatory: true,
        withoutLabel: true,
        nextStep: "check",
        hideInEmployee: true,
      }        
  ]
},
{
  head: "WS_DISCONNECT_APP_FOR_WATER_AND_SEWERAGE_LABEL",
  hideInCitizen: true,
  body: [
  {
    head: "WS_COMMON_APPL_DETAIL",
    isCreate: true,
    body: [
      {
        component: "WSDisconnectionDetails",
        withoutLabel: true,
        key: "DisconnectionDetails",
        type: "component",
        hideInCitizen: true
      },
    ],
  },
  {
    head: "WS_COMMON_DISCONNECTION_TYPE_HEADER",
    isCreate: true,
    body: [{
      type: "component",
      key: "DisconnectionDetails",
      component: "WSDisconnectionForm",
      withoutLabel: true
    }]
  },
  {
    head: "WS_COMMON_DOCS",
    isCreate: true,
    body: [{
      type: "component",
      key: "DocumentsRequired",
      component: "WSDisconnectionDocumentsEmployee",
      withoutLabel: true
    }]
  }
  ]
}
]
