export const newConfig = [
  {
    head: "",
    body: [
      {       
        route: "docsrequired",
        component: "WSDisconnectionDocsRequired",
        key: "data",
        type: "component",       
        withoutLabel: true,
        nextStep: "application-form"
      },
      {         
        route: "application-form",
        component: "WSDisconnectionForm",
        key: "WSDisconnectionForm",
        type: "component",
        withoutLabel: true,
        nextStep: "documents-upload",
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
      },
      {         
        route: "check",
        component: "WSDisconnectionCheckPage",
        key: "WSDisconnectionCheckPage",
        type: "component",
        isMandatory: true,
        withoutLabel: true,
        nextStep: "disconnect-acknowledge",
        hideInEmployee: true,
      },
      {         
        route: "disconnect-acknowledge",
        component: "WSDisconnectAcknowledgement",
        key: "WSDisconnectAcknowledgement",
        type: "component",
        isMandatory: true,
        withoutLabel: true,
        hideInEmployee: true,
      }           
  ]
},
{
  head: "WS_APP_DISCONNECTION_FOR_WATER_AND_SEWERAGE",
  hideInCitizen: true,
  body: [
  {
    head: "",
    isEditConnection: true,
    isCreateConnection: false,
    isModifyConnection: true,
    isEditByConfigConnection: true,
    body: [
      {
        component: "WSEditDisConnectionDetails",
        withoutLabel: true,
        key: "ConnectionDetails",
        type: "component",
        hideInCitizen: true
      },
    ],
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
    head: "WS_COMMON_DOCS",
    isEditConnection: true,
    isCreateConnection: true,
    isModifyConnection: true,
    isEditByConfigConnection: true,
    body: [{
      type: "component",
      key: "DocumentsRequired",
      component: "WSDisconnectionDocsEmployee",
      withoutLabel: true
    }]
  }
  ]
}
]
