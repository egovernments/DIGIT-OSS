import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";

const declarationDetails = getCommonContainer({
   checkbox:{
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pt",
    componentPath: "Checkbox",
    props: {
      content:'PT_MUTATION_DECLARATION',
      jsonPath:
          "Property.declaration"
    },
    
    visible: process.env.REACT_APP_NAME === "Citizen" ? true : false
  }
  });


export const declarationSummary = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { margin: "10px" }
    },
    children: {
      body:declarationDetails
    }
  },

});
