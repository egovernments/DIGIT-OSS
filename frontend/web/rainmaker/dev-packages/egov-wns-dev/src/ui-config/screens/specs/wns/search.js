import commonConfig from "config/common.js";
import { getBreak, getCommonHeader, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getRequiredDocData, showHideAdhocPopup } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils/api";
import { resetFieldsForApplication, resetFieldsForConnection } from '../utils';
import "./index.css";
import { searchApplicationResults } from "./searchResource/searchApplicationResults";
import { searchResults } from "./searchResource/searchResults";
import { showSearches } from "./searchResource/searchTabs";

const getMDMSData = (action, dispatch) => {
  const moduleDetails = [
    {
      moduleName: "ws-services-masters",
      masterDetails: [
        { name: "Documents" }
      ]
    }
  ]
  try {
    getRequiredDocData(action, dispatch, moduleDetails)
  } catch (e) {
    console.log(e);
  }
};

const getMDMSAppType = (dispatch) => {
  // getMDMS data for ApplicationType
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "ws-services-masters", masterDetails: [
            { name: "ApplicationType" }
          ]
        }
      ]
    }
  };
  let applicationType = [];
  try {
    httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody).then((payload) => {
      if (payload && payload.MdmsRes['ws-services-masters'] && payload.MdmsRes['ws-services-masters'].ApplicationType !== undefined) {
        payload.MdmsRes['ws-services-masters'].ApplicationType.forEach(obj => applicationType.push({ code: obj.code.replace(/_/g, ' '), name: obj.name }));
        dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationType", applicationType));
      }
    });
  } catch (e) { console.log(e); }
};

const header = getCommonHeader({
  labelKey: "WS_SEARCH_CONNECTION_HEADER"
});

const getBusinessService = async (dispatch) => {
  const queryObject = [
    { key: "tenantId", value: getTenantId() },
    { key: "businessServices", value: 'NewWS1' }
  ];
  const payload = await httpRequest(
    "post",
    "egov-workflow-v2/egov-wf/businessservice/_search",
    "_search",
    queryObject
  );
  if (payload.BusinessServices[0].businessService === "NewWS1" || payload.BusinessServices[0].businessService === "NewSW1") {
    const { states } = payload.BusinessServices[0] || [];
    if (states && states.length > 0) {
      const status = states.map((item) => { return { code: item.applicationStatus } });
      const applicationStatus = status.filter(item => item.code != null);
      dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationStatus", applicationStatus));
    }
  }
}

const employeeSearchResults = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    getMDMSData(action, dispatch);
    resetFieldsForConnection(state, dispatch);
    resetFieldsForApplication(state, dispatch);
    getBusinessService(dispatch);
    getMDMSAppType(dispatch);
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
                  showHideAdhocPopup(state, dispatch, "search");

                }
              },
              // onClickDefination: {
              //   action: "condition",
              //   callBack: (state, dispatch) => {
              //     pageResetAndChange(state, dispatch);
              //   }
              // }
            }
          }
        },
        showSearches,
        breakAfterSearch: getBreak(),
        searchResults,
        searchApplicationResults
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "search"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default employeeSearchResults;
