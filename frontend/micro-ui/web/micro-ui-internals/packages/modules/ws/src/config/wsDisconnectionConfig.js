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
          nextStep: null,
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
          nextStep: null,
          hideInEmployee: true,
          nextStep: "application-form"
        },
    ]
}
]
  