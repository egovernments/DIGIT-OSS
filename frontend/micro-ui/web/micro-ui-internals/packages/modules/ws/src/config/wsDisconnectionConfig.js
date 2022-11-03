export const newConfig = [
  {
    head: "NEW_DISCONNECTION",
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
    head: "WS_APP_FOR_WATER_AND_SEWERAGE_LABEL",
    isEditByConfig: true,
    hideInCitizen: true,
    isDisonnectionEdit: true,
    isDisonnectionEditByConfig: true,
    body: [
      {
        head: "",
        isDisonnectionEdit: true,
        isDisonnectionEditByConfig: true,
        body: [
          {
            type: "component",
            key: "disConnectionDetails",
            component: "WSDisconnectionAppDetails",
            isDisonnectionEdit: true,
            withoutLabel: true
          }
        ]
      },
      {
        head: "WS_COMMON_PLUMBER_DETAILS",
        isDisonnectionEditByConfig: true,
        body: [{
          type: "component",
          key: "plumberDetails",
          component: "WSActivationPlumberDetails",
          withoutLabel: true,
        }]
      },
      {
        head: "WS_COMMON_DOCS",
        isDisonnectionEdit: true,
        isDisonnectionEditByConfig: true,
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
    head: "RE_SUBMIT_DISCONNECTION_APPLICATION",
    body: [
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
        nextStep: "resubmit-check",
        hideInEmployee: true,
      },
      {
        route: "check",
        component: "WSReSubmitDisconnectionCheckPage",
        key: "WSReSubmitDisconnectionCheckPage",
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
]
