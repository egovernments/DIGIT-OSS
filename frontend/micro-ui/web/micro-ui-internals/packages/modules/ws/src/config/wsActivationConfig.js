export const newConfig = [
  {
    head: "WF_EMPLOYEE_NEWSW1_ACTIVATE_CONNECTION",
    hideInCitizen: true,
    body: [
      {
        head: "WS_COMMON_CONNECTION_DETAIL",
        body: [{
          type: "component",
          key: "connectionDetails",
          component: "WSActivationConnectionDetails",
          withoutLabel: true,
        }]
      },
      {
        head: "WS_COMMON_PLUMBER_DETAILS",
        body: [{
          type: "component",
          key: "plumberDetails",
          component: "WSActivationPlumberDetails",
          withoutLabel: true,
        }]
      },
      {
        head: "WS_ACTIVATION_DETAILS",
        body: [{
          type: "component",
          key: "activationDetails",
          component: "WSActivationPageDetails",
          withoutLabel: true,
        }]
      },
      {
        head: "WF_COMMON_COMMENTS",
        body: [{
          type: "component",
          key: "comments",
          component: "WSActivationCommentsDetails",
          withoutLabel: true,
        }]
      },
      {
        head: "WF_APPROVAL_UPLOAD_HEAD",
        body: [{
          type: "component",
          key: "supportingDocuments",
          component: "WSActivationSupportingDocuments",
          withoutLabel: true,
        }]
      }
    ]
  }
]
