import {
  getBreak,
  getCommonHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { pendingApprovals } from "./searchResource/pendingApprovals";
import { searchForm } from "./searchResource/searchForm";
import { searchResults } from "./searchResource/searchResults";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { showCityPicker, getAdminRole, createEmployee } from "../utils";
import { cityPicker } from "./createResource/cityPicker";

const hasButton = getQueryArg(window.location.href, "hasButton");
//const hasApproval = getQueryArg(window.location.href, "hasApproval");
let enableButton = true;
//enableInbox = hasApproval && hasApproval === "false" ? false : true;
enableButton = hasButton && hasButton === "false" ? false : true;

const header = getCommonHeader({
  labelName: "Employee Management",
  labelKey: "HR_COMMON_HEADER"
});

const getMDMSData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            { name: "Department", filter: "[?(@.active == true)]" },
            { name: "Designation", filter: "[?(@.active == true)]" }
          ]
        },
        {
          moduleName: "egov-hrms",
          masterDetails: [
            {
              name: "Degree",
              filter: "[?(@.active == true)]"
            },
            {
              name: "EmployeeStatus",
              filter: "[?(@.active == true)]"
            },
            {
              name: "EmployeeType",
              filter: "[?(@.active == true)]"
            },
            {
              name: "DeactivationReason",
              filter: "[?(@.active == true)]"
            },
            {
              name: "EmploymentTest",
              filter: "[?(@.active == true)]"
            },
            {
              name: "Specalization",
              filter: "[?(@.active == true)]"
            }
          ]
        },
        {
          moduleName: "tenant",
          masterDetails: [{ name: "tenants" }]
        }
      ]
    }
  };
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const setUlbSelect = (action, state, dispatch) => {
  let adminRoles = getAdminRole(state);
  if (adminRoles.hasAdminRole) {
    set(
      action.screenConfig,
      "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.ulb.roleDefination.roles",
      adminRoles.configAdminRoles
    );
  } else {
    set(
      action.screenConfig,
      "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.ulb.required",
      false
    );
  }
};

const getData = async (action, state, dispatch) => {
  await getMDMSData(action, state, dispatch);
};

const adminCityPickerCheck = (state, dispatch) => {
  let adminRoles = getAdminRole(state);
  if (adminRoles.hasAdminRole) {
    showCityPicker(state, dispatch);
  } else {
    createEmployee(state, dispatch);
  }
};

const employeeSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch);
    setUlbSelect(action, state, dispatch);
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
                  labelName: "Add Employee",
                  labelKey: "HR_ADD_NEW_EMPLOYEE_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: adminCityPickerCheck
              },
              roleDefination: {
                rolePath: "user-info.roles",
                roles: ["SUPERUSER", "HRMS_ADMIN"]
              }
            }
          }
        },
        pendingApprovals,
        searchForm,
        breakAfterSearch: getBreak(),
        // progressStatus,
        searchResults
      }
    },
    cityPickerDialog: {
      componentPath: "Dialog",
      props: {
        open: false,
        className: "hrmsCityPickerDialog",
        style: { overflow: "visible" }
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            style: {
              //     minHeight: "180px",
              //     minWidth: "365px",
              overflow: "visible"
            }
          },
          children: {
            popup: cityPicker
          }
        }
      }
    }
  }
};

export default employeeSearchAndResult;
