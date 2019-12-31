import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { wnsApplication } from "./searchResource/employeeApplication";
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

const header = getCommonHeader({
  labelKey: "WS_SEARCH_CONNECTION_HEADER"
});
const employeeSearchResults = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: "NewTL" });
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
          },
        },
        pendingApprovals,
        wnsApplication,
        breakAfterSearch: getBreak(),
        searchResults
      }
    }
  }
};

export default employeeSearchResults;
