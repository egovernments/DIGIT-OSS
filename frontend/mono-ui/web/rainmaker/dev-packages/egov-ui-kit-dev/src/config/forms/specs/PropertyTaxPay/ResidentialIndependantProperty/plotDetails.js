import {floorCount,plotSize,constructionYear,measuringUnit} from "../utils/reusableFields";
const formConfig = {
  name: "plotDetails",
  fields: {
    ...plotSize,
    ...measuringUnit,
    ...constructionYear,
    ...floorCount
  },
  isFormValid: false,
};

export default formConfig;
