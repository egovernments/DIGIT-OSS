import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { tradeLicenseApplication } from "./searchResource/tradeLicenseApplication";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { pendingApprovals } from "./searchResource/pendingApprovals";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import { progressStatus } from "./searchResource/progressStatus";
import { searchResults } from "./searchResource/searchResults";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const pageResetAndChange = (state, dispatch) => {
  dispatch(prepareFinalObject("Licenses", [{ licenseType: "PERMANENT" }]));
  dispatch(prepareFinalObject("LicensesTemp", []));
  dispatch(setRoute("/tradelicence/apply"));
};

const header = getCommonHeader({
  labelName: "Stakeholder Registraton",
  labelKey: "BPA_COMMON_TITLE"
});
const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: "ARCHITECT" });
    const { states } = data || [];

    if (states && states.length > 0) {
      const status = states.map((item, index) => {
        return {
          code: item.state
        };
      });
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.searchScreen.status",
          status.filter(item => item.code != null)
        )
      );
    }

    return action;
  },
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
            }
            // newApplicationButton: {
            //   componentPath: "Button",
            //   gridDefination: {
            //     xs: 12,
            //     sm: 6,
            //     align: "right"
            //   },
            //   visible: enableButton,
            //   props: {
            //     variant: "contained",
            //     color: "primary",
            //     style: {
            //       color: "white",
            //       borderRadius: "2px",
            //       width: "250px",
            //       height: "48px"
            //     }
            //   },

            //   children: {
            //     plusIconInsideButton: {
            //       uiFramework: "custom-atoms",
            //       componentPath: "Icon",
            //       props: {
            //         iconName: "add",
            //         style: {
            //           fontSize: "24px"
            //         }
            //       }
            //     },

            //     buttonLabel: getLabel({
            //       labelName: "NEW APPLICATION",
            //       labelKey: "TL_HOME_SEARCH_RESULTS_NEW_APP_BUTTON"
            //     })
            //   },
            //   onClickDefination: {
            //     action: "condition",
            //     callBack: (state, dispatch) => {
            //       pageResetAndChange(state, dispatch);
            //     }
            //   },
            //   roleDefination: {
            //     rolePath: "user-info.roles",
            //     path : "tradelicence/apply"

            //   }
            // }
          }
        },
        pendingApprovals,
        tradeLicenseApplication,
        breakAfterSearch: getBreak(),
        searchResults
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
