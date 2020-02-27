import { fetchData } from "./searchResource/citizenSearchFunctions";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";

const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "PT_MUTATION_MY_APPLICATION_HEADER",
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
            contents: [
              {
                label: "PT_MUTATION_APPLICATION_NO",
                jsonPath: "acknowldgementNumber"
              },
              {
                label: "PT_MUTATION_PID",
                jsonPath: "propertyId"
              },
              {
                label: "PT_MUTATION_APPLICATIONTYPE",
                jsonPath: "creationReason"
              },
              {
                label: "PT_MUTATION_CREATION_DATE",
                jsonPath: "auditDetails.createdTime"
              },
              {
                label: "PT_MUTATION_STATUS",
                jsonPath: "status",
                prefix: "WF_PT_"
              }
            ],
            moduleName: "PT-MUTATION",
            homeURL: "/property-tax"
          }
        }
      }
    }
  }
};


export default screenConfig;
