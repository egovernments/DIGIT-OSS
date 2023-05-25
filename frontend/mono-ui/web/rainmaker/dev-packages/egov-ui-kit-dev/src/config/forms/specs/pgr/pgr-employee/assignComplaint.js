const formConfig = {
  name: "assignComplaint",
  fields: {
    action: {
      id: "action",
      jsonPath: "actionInfo[0].action",
      value: "",
    },
    assignee: {
      id: "assignee",
      jsonPath: "actionInfo[0].assignee",
      value: "",
    },
  },
  saveUrl: "/rainmaker-pgr/v1/requests/_update",
  redirectionRoute: "",
};

export default formConfig;
