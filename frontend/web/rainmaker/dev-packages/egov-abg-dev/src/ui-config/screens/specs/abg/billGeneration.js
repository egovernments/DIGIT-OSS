import {
    getCommonHeader,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {billGenSearchCard} from "./billGenerationResource/billGensearch";
//   import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { searchResults } from "./billGenerationResource/searchResults";
  
  const header = getCommonHeader({
    labelName: "Generate Bill",
    labelKey: "ABG_COMMON_HEADER"
  });
  
  const billGenSearchAndResult = {
    uiFramework: "material-ui",
    name: "billGeneration",
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "billGeneration"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 6
                },
                ...header
              }
            }
          },
          billGenSearchCard,
          breakAfterSearch: getBreak(),
          searchResults,
        }
      },
    }
  };
  
  export default billGenSearchAndResult;
  