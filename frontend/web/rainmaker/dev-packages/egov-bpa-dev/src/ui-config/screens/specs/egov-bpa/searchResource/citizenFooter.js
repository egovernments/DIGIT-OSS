import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let tenant = getQueryArg(window.location.href, "tenantId");

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

export const bpaMakePayment = async (state, dispatch) => {
  let status = get(state.screenConfiguration.preparedFinalObject, "BPA.status");
  let billbService = ((status == "PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" : "BPA.NC_SAN_FEE");
  const makePaymentUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-bpa/citizen-pay?applicationNumber=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`
    : `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`;
  dispatch(setRoute(makePaymentUrl));
}
export const citizenFooter = getCommonApplyFooter({
  makePayment: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
          marginRight: "45px"
        }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "TL_COMMON_BUTTON_CITIZEN_MAKE_PAYMENT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: bpaMakePayment
    },
    roleDefination: {
      rolePath: "user-info.roles",
      action: "PAY",
      roles: ["CITIZEN"]
    },
    visible: process.env.REACT_APP_NAME === "Citizen" ? true : false
  }  
});
