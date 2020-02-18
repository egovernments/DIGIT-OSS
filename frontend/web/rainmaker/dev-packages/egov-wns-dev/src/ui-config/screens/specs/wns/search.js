import { getCommonHeader, getBreak, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { showSearches } from "./searchResource/searchTabs";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchResults } from "./searchResource/searchResults";
import { searchApplicationResults } from "./searchResource/searchApplicationResults";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

const header = getCommonHeader({
  labelKey: "WS_SEARCH_CONNECTION_HEADER"
});

const pageResetAndChange = (state, dispatch) => {
  dispatch(prepareFinalObject("Licenses", [{ licenseType: "PERMANENT" }]));
  dispatch(prepareFinalObject("LicensesTemp", []));
  dispatch(setRoute("/wns/apply"));
};

const employeeSearchResults = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: "NewWS1" });
    const { states } = data || [];
    const applicationType = [{ code: "Water", code: "WATER" }, { code: "Sewerage", code: "SEWERAGE" }]
    dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationType", applicationType));
    if (states && states.length > 0) {
      const status = states.map((item, index) => { return { code: item.state } });
      dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.status", status.filter(item => item.code != null)));
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
            },
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right"
              },
              visible: true,
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
                  labelKey: "WS_HOME_SEARCH_RESULTS_NEW_APP_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  pageResetAndChange(state, dispatch);
                }
              }
            }
          }
        },
        showSearches,
        breakAfterSearch: getBreak(),
        searchResults,
        searchApplicationResults
      }
    }
  }
};

export default employeeSearchResults;