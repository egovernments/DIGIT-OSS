import { fetchData } from "./citizenSearchResource/citizenFunctions";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";

const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "BPA_MY_APPLICATIONS"
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
    fetchData(action, state, dispatch, true, false);
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
            contents: [
              {
                label: "BPA_COMMON_APP_NO",
                jsonPath: "applicationNumber"
              }, 
              {
                label: "TL_COMMON_TABLE_COL_OWN_NAME",
                jsonPath: "ownername"
              },
              {
                label: "BPA_COMMON_SERVICE",
                jsonPath: "businessService"
              },              {
                label: "BPA_COMMON_TABLE_COL_ASSIGN_TO",
                jsonPath: "assignedTo"
              },
              {
                label: "TL_COMMON_TABLE_COL_STATUS",
                jsonPath: "status",
              },
              {
                label: "BPA_COMMON_SLA",
                jsonPath: "sla",
              }
            ],
            moduleName: "BPAREG",
            homeURL: "/bpastakeholder-citizen/home"
          }
        }
      }
    }
  }
};

export default screenConfig;
