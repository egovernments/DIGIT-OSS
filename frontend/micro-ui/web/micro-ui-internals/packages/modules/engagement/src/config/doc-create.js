export const documentsFormConfig = [
  {
    body: [
      {
        type: "form",
        key: "ULB",
        component: "EngagementDocSelectULB",
        withoutLabel: true,
      },
      {
        type: "form",
        key: "documentName",
        component: "EnagementDocName",
        withoutLabel: true,
      },
      {
        type: "form",
        key: "docCategory",
        component: "EngagementDocCategory",
        withoutLabel: true,
      },
      {
        type: "form",
        key: "description",
        component: "EngagementDocDescription",
        withoutLabel: true,
      },
      {
        type: "form",
        key: "document",
        component: "EngagementDocUploadDocument",
        withoutLabel: true,
        inputs: [{ name: "" }],
      },
    ],
  },
];
