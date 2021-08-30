import {plotSize,measuringUnit,beforeInitFormForPlot} from "../utils/reusableFields";
const formConfig = {
  name: "plotDetails",
  fields: {
    ...plotSize,
    ...measuringUnit
  },
  isFormValid: false,
  ...beforeInitFormForPlot
};

export default formConfig;
