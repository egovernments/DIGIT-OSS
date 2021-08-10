import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { createUpdateNocApplication } from "../../../../../ui-utils/commons";
import { getCommonApplyFooter } from "../../utils";
import "./index.scss";
import { enableField, disableField } from "egov-ui-framework/ui-utils/commons";

const updateNocApplication = async (state, dispatch) => {
  disableField('summary',"components.div.children.footer.children.submitButton",dispatch);
  let response = await createUpdateNocApplication(state, dispatch, "APPLY");
  let applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.applicationNumber"
  );
  let tenantId = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].tenantId"
  );
  if (get(response, "status", "") === "success") {
    enableField('summary',"components.div.children.footer.children.submitButton",dispatch);
    const acknowledgementUrl =
      process.env.REACT_APP_SELF_RUNNING === "true"
        ? `/egov-ui-framework/fire-noc/acknowledgement?purpose=apply&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
        : `/fire-noc/acknowledgement?purpose=apply&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    dispatch(setRoute(acknowledgementUrl));
  }
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
      callBack: updateNocApplication
    }
  }
});
