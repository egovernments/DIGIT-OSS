import {
  getCommonContainer, getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { showHideAdhocPopup } from "../utils";
import { deactivateEmployee } from "./viewResource/deactivate-employee";
import { employeeReviewDetails } from "./viewResource/employee-review";
import { hrViewFooter } from "./viewResource/footer";
import { getEmployeeData } from "./viewResource/functions";


export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `View Employee Information`,
    labelKey: "HR_VIEW_HEADER"
  })
});

const tradeView = employeeReviewDetails(false);

const getMdmsData = async (action, state, dispatch, tenantId) => {
  const tenant = tenantId || getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenant,
      moduleDetails: [
        {
          moduleName: "egov-hrms",
          masterDetails: [
            {
              name: "DeactivationReason",
              filter: "[?(@.active == true)]"
            }
          ]
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
    dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "view",
  beforeInitScreen: (action, state, dispatch) => {
    let employeeCode = getQueryArg(window.location.href, "employeeID");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    getEmployeeData(state, dispatch, employeeCode, tenantId);
    showHideAdhocPopup(state, dispatch);
    getMdmsData(action, state, dispatch, tenantId);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        tradeView,
        footer: hrViewFooter()
      }
    },
    // deactivateEmployee: {
    //   uiFramework: "custom-molecules-local",
    //   componentPath: "ActionDialog",
    //   props: {
    //     open: false
    //   },
    //   type: "array"
    // },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-hrms",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "view",

      },
      children: {
        popup: deactivateEmployee
      }
    }
  }
};

export default screenConfig;
