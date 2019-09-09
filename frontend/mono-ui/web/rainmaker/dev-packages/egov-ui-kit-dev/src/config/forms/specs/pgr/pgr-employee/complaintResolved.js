const formConfig = {
  name: "complaintResolved",
  fields: {
    media: {
      id: "media-upload",
      file: true,
      jsonPath: "actionInfo[0].media",
      errorMessage: "CS_FILE_UPLOAD_FAILED",
    },

    textarea: {
      id: "textarea",
      jsonPath: "actionInfo[0].comments",
      hintText: "CS_COMMON_COMMENTS_PLACEHOLDER",
      value: "",
    },
    action: {
      id: "action",
      jsonPath: "actionInfo[0].action",
      value: "resolve",
    },
  },
  submit: {
    type: "submit",
    label: "ES_RESOLVE_MARK_RESOLVED",
    id: "complaintresolved-submit-action",
  },
  action: "_update",
  redirectionRoute: "/resolve-success",
  saveUrl: "/rainmaker-pgr/v1/requests/_update",
};

export default formConfig;
