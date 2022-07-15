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
}
]
