import { getCommonHeader, getLabel, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { tradeLicenseApplication } from "./searchResource/tradeLicenseApplication";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import { progressStatus } from "./searchResource/progressStatus";
import { searchResults } from "./searchResource/searchResults";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const pageResetAndChange = (state, dispatch) => {
  dispatch(prepareFinalObject("Licenses", [{ licenseType: "PERMANENT" }]));
  dispatch(prepareFinalObject("LicensesTemp", []));
  dispatch(setRoute("/tradelicence/apply"));
};

const header = getCommonHeader({
  labelName: "Trade License",
  labelKey: "TL_COMMON_TL",
});
const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("tenantId", ""));
    const tenantId = getQueryArg(window.location.href, "tenantId");
    if (tenantId) dispatch(prepareFinalObject("tenantId", tenantId));
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search",
      },
      children: {
        tradeLicenseApplication,
        breakAfterSearch: getBreak(),
        searchResults,
      },
    },
  },
};

export default tradeLicenseSearchAndResult;
