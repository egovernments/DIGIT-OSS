const formConfig = {
  name: "basicInformation",
  fields: {
    typeOfUsage: {
      id: "typeOfUsage",
      jsonPath: "",
      type: "singleValueList",
      floatingLabelText: "PT_TYPE_OF_USAGE",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
    },
    typeOfBuilding: {
      id: "typeOfBuilding",
      jsonPath: "",
      type: "singleValueList",
      floatingLabelText: "PT_TYPE_OF_BUILDING",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
    },
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
};

export default formConfig;
