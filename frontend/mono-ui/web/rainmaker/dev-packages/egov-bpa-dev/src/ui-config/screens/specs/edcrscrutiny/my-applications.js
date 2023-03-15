import { fetchData } from "./functions";
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
    fetchData(action, state, dispatch, true);
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
          moduleName: "egov-bpa",
          componentPath: "EdcrSingleApplication",
          visible: true,
          props: {
            contents: [
              {
                label: "EDCR_COMMON_TABLE_APPL_NO",
                jsonPath: "applicationNumber"
              },
              {
                label: "EDCR_COMMON_TABLE_SCRUTINY_NO",
                jsonPath: "edcrNumber"
              },

              {
                label: "EDCR_COMMON_TABLE_CITY_LABEL",
                jsonPath: "tenantId",
                prefix: "TENANT_TENANTS_"
              },
              {
                label: "EDCR_COMMON_TABLE_APPL_NAME",
                jsonPath: "planDetail.planInformation.applicantName"
              },
              {
                label: "EDCR_COMMON_TABLE_COL_STATUS",
                jsonPath: "status"
                // prefix: "WF_ARCHITECT_"
              }
            ],
            moduleName: "EDCR",
            homeURL: "/edcrscrutiny/home"
          }
        }
      }
    }
  }
};

export default screenConfig;
