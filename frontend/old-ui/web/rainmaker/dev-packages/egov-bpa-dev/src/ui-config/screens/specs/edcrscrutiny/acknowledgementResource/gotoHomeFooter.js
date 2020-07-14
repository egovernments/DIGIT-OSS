import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import store from "ui-redux/store";

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

const getRedirectionURL = () => {
  /* Mseva 2.0 changes */
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? // ? "/tradelicense-citizen/home"
      "/"
    : "/inbox";
  return redirectionURL;
};

const getRedirectionOCURL = () => {
  let state = store.getState();
  let tenantId = getQueryArg(window.location.href, "tenantId");
  let edcrNumber = get( state.screenConfiguration.preparedFinalObject, "edcrDetail[0].edcrNumber", "");
  if(!edcrNumber) {
    edcrNumber = getQueryArg(window.location.href, "edcrNumber");
  }
  let url = `/oc-bpa/apply?tenantId=${tenantId}&edcrNumber=${edcrNumber}`;
  return url;
};

const getRedirectionBPAURL = () => {
  let state = store.getState();
  let tenantId = getQueryArg(window.location.href, "tenantId");
  let edcrNumber = get( state.screenConfiguration.preparedFinalObject, "edcrDetail[0].edcrNumber", "");
  if(!edcrNumber) {
    edcrNumber = getQueryArg(window.location.href, "edcrNumber");
  }
  let url = `/egov-bpa/apply?tenantId=${tenantId}&edcrNumber=${edcrNumber}`;
  return url;
};

export const gotoHomeFooter = getCommonApplyFooter({
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "BPA_HOME_BUTTON"
      })
    },
    onClickDefination: {
      action: "page_change",
       path: getRedirectionURL()
    }
  },
  ocCreateApp: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      },
      // disabled: true
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "CREATE OCUPANCY CERTIFICATE APPLICATION",
        labelKey: "EDCR_OC_CREATE_APP_BUTTON"
      })
    },
    onClickDefination: {
      action: "page_change",
       path: getRedirectionOCURL()
    },
    visible : false
  },
  bpaCreateApp: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      },
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "CREATE BUILDING PLAN APPLICATION",
        labelKey: "EDCR_CREATE_APP_BUTTON"
      })
    },
    onClickDefination: {
      action: "page_change",
       path: getRedirectionBPAURL()
    },
    visible : false
  }
});
