import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import "./index.scss";

const gotoAcknowledgement = (state, dispatch) => {
  const acknowledgementUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/fire-noc/acknowledgement?purpose=apply&status=success&applicationNumber=NOC-JLD-2018-09-123434`
      : `/fire-noc/acknowledgement?purpose=apply&status=success&applicationNumber=NOC-JLD-2018-09-123434`;
  dispatch(setRoute(acknowledgementUrl));
};

export const footer = getCommonApplyFooter({
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "SUBMIT",
        labelKey: "NOC_COMMON_BUTTON_SUBMIT"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: gotoAcknowledgement
    }
  }
});
