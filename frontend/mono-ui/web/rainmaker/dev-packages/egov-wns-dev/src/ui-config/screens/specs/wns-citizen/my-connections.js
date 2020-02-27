import { fetchData } from "./myConnectionDetails/myConnectionDetails";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";

const header = getCommonHeader(
  {
    labelKey: "WS_MYCONNECTIONS_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const screenConfig = {
  uiFramework: "material-ui",
  name: "my-connections",
  beforeInitScreen: (action, state, dispatch) => {
    fetchData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        // className: "common-div-css"
      },
      children: {
        header: header,
        applicationsCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-wns",
          componentPath: "MyConnections"
        }
      }
    }
  }
};

export default screenConfig;
