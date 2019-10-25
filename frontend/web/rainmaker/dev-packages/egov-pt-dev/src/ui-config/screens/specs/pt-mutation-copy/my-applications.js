import { fetchData } from "./searchResource/citizenSearchFunctions";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";

const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "NOC_MY_APPLICATIONS_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const screenConfig = {
  uiFramework: "material-ui",
  name: "my-applications",
  beforeInitScreen: (action, state, dispatch) => {
    fetchData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applicationsCard: {
          uiFramework: "custom-molecules",
          componentPath: "SingleApplication",
          visible: true,
          props: {
            applicationName: {
              label: "NOC_COMMON_TABLE_COL_BUILDING_NAME_LABEL",
              jsonPath: "fireNOCDetails.buildings[0].name"
            },
            applicationNumber: {
              label: "NOC_COMMON_TABLE_COL_APP_NO_LABEL",
              jsonPath: "fireNOCDetails.applicationNumber"
            },
            ownerName: {
              label: "NOC_COMMON_TABLE_COL_OWN_NAME_LABEL",
              jsonPath: "fireNOCDetails.applicantDetails.owners[0].name"
            },
            moduleNumber: {
              label: "NOC_COMMON_TABLE_COL_NOC_NO_LABEL",
              jsonPath: "fireNOCNumber"
            },
            status: {
              label: "NOC_COMMON_TABLE_COL_STATUS_LABEL",
              jsonPath: "fireNOCDetails.status"
            },
            moduleName: "FIRENOC",
            statusPrefix: "WF_FIRENOC_"
          }
        }
      }
    }
  }
};

export default screenConfig;
