import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { createUpdateBpaApplication } from "../../../../../ui-utils/commons";
import { getCommonApplyFooter } from "../../utils";
import "./index.scss";

const updateBpaApplication = async (state, dispatch) => {
  let response = await createUpdateBpaApplication(state, dispatch, "APPLY");
  let applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.applicationNo"
  );
  let tenantId = get(
    state,
    "screenConfiguration.preparedFinalObject.BPAs[0].BPADetails.plotdetails.citytown.value"
  );
  if (get(response, "status", "") === "success") {
    const acknowledgementUrl =
      process.env.REACT_APP_SELF_RUNNING === "true"
        ? `/egov-ui-framework/egov-bpa/acknowledgement?purpose=apply&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
        : `/egov-bpa/acknowledgement?purpose=apply&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
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
      callBack: updateBpaApplication
    }
  }
});
