const formConfig = {
  name: "plotInformation",
  fields: {
    plotSize: {
      id: "plotSize",
      jsonPath: "",
      type: "number",
      floatingLabelText: "PT_FORM2_PLOT_SIZE",
      hintText: "PT_FORM2_PLOT_SIZE_PLACEHOLDER",
      pattern: "^([0-9]){0,8}$",
      numcols: 4,
    },
    measuringUnit: {
      id: "measuringUnit",
      jsonPath: "",
      type: "singleValueList",
      floatingLabelText: "PT_ASSESMENT1_MEASURING_UNIT",
      hintText: "",
      dropDownData: [{ label: "Sq Yards", value: "S_Yards" }, { label: "Sq Meter", value: "Sq Meter" }, { label: "Sq Feet", value: "Sq Feet" }],
      numcols: 4,
      value: "sq yards",
    },
    noOfFloors: {
      id: "noOfFloors",
      jsonPath: "",
      type: "textfield",
      floatingLabelText: "PT_FORM2_NUMBER_OF_FLOORS",
      defaultSort:false,
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      numcols: 4,
    },
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
