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
import { localStorageGet,getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import find from "lodash/find";
import get from "lodash/get";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;
const tenant= getTenantId();
const pageResetAndChange = (state, dispatch) => {
  dispatch(prepareFinalObject("Licenses", [{ licenseType: "PERMANENT" }]));
  dispatch(prepareFinalObject("LicensesTemp", []));
  dispatch(setRoute(`/tradelicence/apply?tenantId=${tenant}`));
};


const getMdmsData = async (dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
      moduleDetails: [
        {
          moduleName: "TradeLicense",
          masterDetails: [
            { name: "ApplicationType" }
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    let types = [];
    if(payload && payload.MdmsRes){
      types =  get(payload.MdmsRes, "TradeLicense.ApplicationType").map((item,index) => {
        return {
          code : item.code.split(".")[1]
        }
      });
    }    
     dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.searchScreen.applicationType",
        types
      )
    );
  }catch (e) {
    console.log(e);
  }
}

const header = getCommonHeader({
  labelName: "Trade License",
  labelKey: "TL_COMMON_TL"
});
const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    getMdmsData(dispatch);
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
                  labelKey: "TL_HOME_SEARCH_RESULTS_NEW_APP_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  pageResetAndChange(state, dispatch);
                }
              },
              roleDefination: {
                rolePath: "user-info.roles",
                path : "tradelicence/apply"

              }
            }
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
