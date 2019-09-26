import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { NOCApplication } from "./searchResource/fireNocApplication";
import { NOCRequiredDocuments } from "./reqDocs";
import { showHideAdhocPopup } from "../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { pendingApprovals } from "./searchResource/pendingApprovals";
// import { progressStatus } from "./searchResource/progressStatus";
import { searchResults } from "./searchResource/searchResults";

const hasButton = getQueryArg(window.location.href, "hasButton");
//const hasApproval = getQueryArg(window.location.href, "hasApproval");
let enableButton = true;
//enableInbox = hasApproval && hasApproval === "false" ? false : true;
enableButton = hasButton && hasButton === "false" ? false : true;

const header = getCommonHeader({
  labelName: "Fire NOC",
  labelKey: "NOC_COMMON_NOC"
});
const NOCSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
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
            },
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right"
              },
              visible: enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px"
                }
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px"
                    }
                  }
                },

                buttonLabel: getLabel({
                  labelName: "NEW APPLICATION",
                  labelKey: "NOC_HOME_SEARCH_RESULTS_NEW_APP_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: showHideAdhocPopup
              },
              roleDefination: {
                rolePath: "user-info.roles",
                roles: ["TL_CEMP", "SUPERUSER"]
              }
            }
          }
        },
        pendingApprovals,
        NOCApplication,
        breakAfterSearch: getBreak(),
        // progressStatus,
        searchResults
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-tradelicence",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "search"
      },
      children: {
        popup: NOCRequiredDocuments
      }
    }
  }
};

export default NOCSearchAndResult;
