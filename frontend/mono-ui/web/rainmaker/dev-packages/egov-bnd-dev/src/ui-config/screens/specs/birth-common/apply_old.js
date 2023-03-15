import {
  getCommonCardWithHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { getCommonCard, getCommonContainer, getCommonHeader, getCommonParagraph, getCommonTitle, getStepperObject } from "egov-ui-framework/ui-config/screens/specs/utils";
import {billSearchCard} from "./birthSearchResources/birthSearchCard";

export const stepsData = [
  { labelName: "Search", labelKey: "BND_SEARCH" },
  { labelName: "Review Details", labelKey: "BND_DETAILS" },
  { labelName: "Pay", labelKey: "BND_PAY" },
];

export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      //searchForm
    }
  };
  
export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    
  },
  visible: false
};
  
export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    
  },
  visible: false
};
  
export const formwizardFourthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    
  },
  visible: false
};

export const header = getCommonContainer({
  header:
      getCommonHeader({
          labelName: 'Apply for New Trade License' ,
          labelKey: "APPLY"
      }),
  applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-tradelicence",
      componentPath: "ApplicationNoContainer",
      props: {
      number: "NA"
      },
      visible: false
  }
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "mihyLoginScreen",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        formwizardFourthStep,
        //footer
      }
    }
  }
};

export default screenConfig;
