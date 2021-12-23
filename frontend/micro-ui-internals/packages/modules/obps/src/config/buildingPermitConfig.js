export const newConfig = [
  {
    head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
    body: [
      {
        route: "docs-required",
        component: "DocsRequired",
        nextStep: "basic-details"
      },
      {
        route: "basic-details",
        component: "BasicDetails",
      }
    ]
  }
]