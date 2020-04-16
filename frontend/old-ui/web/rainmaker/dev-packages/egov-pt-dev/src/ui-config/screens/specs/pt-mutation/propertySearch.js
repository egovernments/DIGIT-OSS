import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import propertySearchTabs from "./property-search-tabs";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import { progressStatus } from "./searchResource/progressStatus";
import { searchPropertyTable, searchApplicationTable } from "./searchResource/searchResults";
import { httpRequest } from "../../../../ui-utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import { adhocPopup } from "./adhocPopup";
import { showHideAdhocPopup } from "../utils";
import { resetFields } from "./mutation-methods";
const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;
const tenant = getTenantId();

//console.log(captureMutationDetails);

const getMDMSData = async (dispatch) => {
  const mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            },{name: "citymodule"}
          ]
        }
      ]
    }
  }
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    payload.MdmsRes.tenant.tenants=payload.MdmsRes.tenant.citymodule[1].tenants;
    // console.log("payload--", payload)
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    if(process.env.REACT_APP_NAME != "Citizen"){
      dispatch(
        prepareFinalObject(
          "searchScreen.tenantId",
          tenant
        )
      );
    }
  } catch (e) {
    console.log(e);
  }
};

const header = getCommonHeader({
  labelName: "Property Tax",
  labelKey: "PROPERTY_TAX"
});
const screenConfig = {
  uiFramework: "material-ui",
  name: "propertySearch",

  beforeInitScreen: (action, state, dispatch) => {
    resetFields(state, dispatch);
    getMDMSData(dispatch);
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
                  labelName: "Add New Property",
                  labelKey: "PT_ADD_NEW_PROPERTY_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  showHideAdhocPopup(state, dispatch, "search");

                }
              },
              // roleDefination: {
              //   rolePath: "user-info.roles",
              //   path : "tradelicence/apply"

              // }
            }
          }
        },
        propertySearchTabs,
        breakAfterSearch: getBreak(),
        searchPropertyTable,
        searchApplicationTable

      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search"
      },
      children: {
        popup: adhocPopup
      }
    }
  }
};

export default screenConfig;

