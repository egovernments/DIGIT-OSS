import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
const header = getCommonHeader(
  {
    labelName: "How It Works",
    labelKey: "BND_HELP"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
const screenConfig = {
  uiFramework: "material-ui",
  name: "HowItWorks",

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
          children: {
            header: header,
            howitWoorksDiv:{
          uiFramework: "custom-molecules-local",
          moduleName: "egov-bnd",
          componentPath: "HowItWorks",
          props: {
            className: "common-div-css"
          }
        }
      }
    }
  }
};

export default screenConfig;
