const formConfig = {
  name: "financialYear",
  fields: {
    button: {
      id: "year",
      jsonPath: "Properties[0].propertyDetails[0].financialYear",
      value: "",
    },
  },

  isFormValid: false,
};

export default formConfig;
