import {floorCount,plotSize,measuringUnit} from "../utils/reusableFields";

const formConfig = {
  name: "plotDetails",
  fields: {
    ...plotSize,
    ...measuringUnit,
    ...floorCount
  },
  isFormValid: false,
};

export default formConfig;
