const formConfig = {
  name: "feedback",
  fields: {
    rating: {
      id: "complaint-rating",
      jsonPath: "services[0].rating",
      required: true,
    },
    selectedSevice: {
      id: "feedback-service",
      jsonPath: "services[0].feedback",
    },
    comments: {
      id: "feedback-comments",
      jsonPath: "actionInfo[0].comments",
      hintText: "CS_COMMON_COMMENTS_PLACEHOLDER",
    },
    action: {
      id: "action",
      jsonPath: "actionInfo[0].action",
      value: "close",
    },
  },
  submit: {
    type: "submit",
    label: "CS_COMMON_SUBMIT",
    id: "feedback-submit-action",
  },
  action: "_update",
  redirectionRoute: "/feedback-acknowledgement",
  saveUrl: "/rainmaker-pgr/v1/requests/_update",
};

export default formConfig;
