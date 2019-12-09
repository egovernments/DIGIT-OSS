import { fetchData } from "./citizenSearchResource/citizenFunctions";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";

const getHeader = (count) => {
  return getCommonHeader(
    {
      labelName: `My Applications ${number}`,
      labelKey: "TL_MY_APPLICATIONS_HEADER", //"My Applications {0}"
      dynamicArray: [number]
    },
    {
      classes: {
        root: "common-header-cont"
      }
    }
  );
};

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
          uiFramework: "custom-molecules-local",
          componentPath: "SingleApplicationedcr",
          moduleName: "egov-bpa",
          visible: true,
          props: {
            applicationName: {
              label: "TL_COMMON_TABLE_COL_OWN_NAME",
              jsonPath: "planDetail.planInformation.applicantName"
            },
            applicationNumber: {
              label: "TL_COMMON_TABLE_COL_APP_NO",
              jsonPath: "transactionNumber"
            },
            status: {
              label: "TL_COMMON_TABLE_COL_STATUS",
              jsonPath: "status"
            },
            city: {
              label: "City",
              jsonPath: "tenantId"
            },
            moduleName: "BPAREG",
            statusPrefix: "WF_ARCHITECT_"
          }
        }
      }
    }
  }
};

export default screenConfig;
