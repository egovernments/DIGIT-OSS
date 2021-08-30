const formConfig = {
  name: "requestReassign",
  fields: {
    comments: {
      id: "comments-reopen",
      jsonPath: "actionInfo[0].comments",
    },
    textarea: {
      id: "textarea",
      hintText: "CS_COMMON_COMMENTS_PLACEHOLDER",
    },
    action: {
      id: "action",
      jsonPath: "actionInfo[0].action",
      value: "requestforreassign",
    },
  },
  submit: {
    type: "submit",
    label: "ES_REQUEST_REQUEST_RE_ASSIGN",
    id: "reopencomplaint-submit-action",
  },
  action: "_update",
  redirectionRoute: "/employee/reassign-success",
  saveUrl: "/rainmaker-pgr/v1/requests/_update",
};

export default formConfig;
