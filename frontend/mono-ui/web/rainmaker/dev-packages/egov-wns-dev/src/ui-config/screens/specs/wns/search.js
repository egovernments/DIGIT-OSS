import { getCommonHeader, getBreak, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { showSearches } from "./searchResource/searchTabs";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchResults } from "./searchResource/searchResults";
import { searchApplicationResults } from "./searchResource/searchApplicationResults";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { resetFieldsForConnection, resetFieldsForApplication } from '../utils';

const header = getCommonHeader({
  labelKey: "WS_SEARCH_CONNECTION_HEADER"
});

const pageResetAndChange = (state, dispatch) => {
  dispatch(prepareFinalObject("WaterConnection", []));
  dispatch(prepareFinalObject("SewerageConnection", []));
  dispatch(prepareFinalObject("applyScreen", {}));
  dispatch(prepareFinalObject("searchScreen", {}));
  window.location.href = "/employee/wns/apply";
};

const queryObject = [
  { key: "tenantId", value: 'pb.amritsar' },
  { key: "businessServices", value: 'NewWS1' }
];

const employeeSearchResults = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen:  (action, state, dispatch) => {
    resetFieldsForConnection(state, dispatch);
    resetFieldsForApplication(state, dispatch);
    setBusinessServiceDataToLocalStorage(queryObject,dispatch);
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    if(businessServiceData[0].businessService==="NewWS1"||businessServiceData[0].businessService==="NewSW1" ){
      const data = find(businessServiceData, { businessService: businessServiceData[0].businessService });
      const { states } = data || [];  
      if (states && states.length > 0) {
        const status = states.map((item) => { return { code: item.state } });
        const applicationStatus = status.filter(item => item.code != null);
        dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationStatus", applicationStatus));
      }
    }
    const applicationType = [{ code: "New Water connection", code: "New Water connection" }, { code: "New Sewerage Connection", code: "New Sewerage Connection" }]
    dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationType", applicationType));

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