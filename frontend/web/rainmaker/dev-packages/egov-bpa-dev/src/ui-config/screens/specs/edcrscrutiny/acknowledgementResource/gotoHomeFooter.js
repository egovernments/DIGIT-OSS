import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

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
  let tenantId = getQueryArg(window.location.href, "tenantId");
  let edcrNumber = getQueryArg(window.location.href, "edcrNumber");
  let url = `/oc-bpa/apply?tenantId=${tenantId}&edcrNumber=${edcrNumber}`;
  return url;
};

export const gotoHomeFooter = getCommonApplyFooter({
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "contained",
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
    //  path: `/tradelicence/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`
    // path:`tradelicence/apply?applicationNumber=PB-TL-2019-12-04-003839&tenantId=pb.nawanshahr&action=edit`
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
  }
});
