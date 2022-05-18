  export const newConfig = [
    {
      head: "",
      body: [
        {       
          route: "docsrequired",
          component: "WSDisconnectionDocsRequired",
          key: "data",
          type: "component",
          isMandatory: true,
          withoutLabel: true,
          // nextStep: null,
          hideInEmployee: true,
          nextStep: "application-form"
        },
        {         
          route: "application-form",
          component: "WSDisConnectionForm",
          key: "WSDisConnectionForm",
          type: "component",
          isMandatory: true,
          withoutLabel: true,
          // nextStep: null,
          hideInEmployee: true,
          nextStep: "documents-upload"
        },
        {         
          route: "documents-upload",
          component: "WSDisconnectionDocumentsForm",
          key: "WSDisconnectionDocumentsForm",
          type: "component",
          isMandatory: true,
          withoutLabel: true,
          nextStep: null,
          hideInEmployee: true,
          // nextStep: "application-form"
        }
        ,
        {         
          route: "disconnection-summary",
          component: "WSDisconnectionSummary",
          key: "WSDisconnectionSummary",
          type: "component",
          isMandatory: true,
          withoutLabel: true,
          nextStep: null,
          hideInEmployee: true,
          // nextStep: "application-form"
        }
    ]
}
]
  