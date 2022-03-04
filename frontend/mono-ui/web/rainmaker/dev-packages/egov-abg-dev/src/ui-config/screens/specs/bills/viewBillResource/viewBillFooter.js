import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { hideSpinner, showSpinner, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { PAYMENTSEARCH } from "egov-ui-kit/utils/endPoints";
import { set } from "lodash";
import get from "lodash/get";
import { ifUserRoleExists, validateFields } from "../../utils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";

export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("EMPLOYEE") ? "/inbox" : "/inbox";
  return redirectionURL;
};

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer", //window.location.href.includes("viewBill?connectionNumber") ? "footer-styles-bill-cancellation" : "footer-style-bill-cancellation"
      style: {
        padding: "14px"
      }
    },
    children
  };
};

export const cancelBillFooter = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "270px",
        maxWidth: "360px",
        width: "100%",
        margin: "0px 5px 5px 0px",
        minHeight: "50px"
      }
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "PREVIOUS STEP",
        labelKey: "PT_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        dispatch(setRoute(`/bills/viewBill?connectionNumber=${getQueryArg(window.location.href, "consumerNumber")}&tenantId=${getQueryArg(window.location.href, "tenantId")}&edit=true&service=${getQueryArg(window.location.href, "service")}`));
      }
    },
    visible: true
  },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "300px",
        maxWidth: "400px",
        width: "100%",
        margin: "0px 5px 5px 0px",
        minHeight: "50px"
      }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "CANCEL BILL",
        labelKey: "ABG_UPPER_CANCEL_BILL"
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
      callBack: (state, dispatch) => {
        cancelReceipt(state, dispatch);
      }
    }
  }
});
export const viewBillFooter = getCommonApplyFooter({
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "270px",
        maxWidth: "360px",
        width: "100%",
        marginRight: "10px",
        minHeight: "50px"
      }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "NEXT STEP",
        labelKey: "WS_COMMON_BUTTON_NXT_STEP"
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
      callBack: (state, dispatch) => {
        let preparedFinalObject = get(state, "screenConfiguration.preparedFinalObject", {});
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const service = getQueryArg(window.location.href, "service");
        const businessService = get(preparedFinalObject, "billData.businessService", "");
        const consumerNumber = get(preparedFinalObject, "billData.consumerCode", "");
        const billNumber = get(preparedFinalObject, "billData.billNumber", "");
        dispatch(setRoute(`/bills/cancelBill?consumerNumber=${consumerNumber}&tenantId=${tenantId}&businessService=${businessService}&service=${service}&billNumber=${billNumber}`));
      }
    }
  }
});


const cancelReceipt = async (state, dispatch) => {
  const isFormValid = validateFields(
    "components.div.children.cancelBillDetailsCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "cancelBill"
  );

  let UpdateBillCriteria = get(state.screenConfiguration.preparedFinalObject, 'UpdateBillCriteria', []);
  let descriptionCheck = true;
  if (UpdateBillCriteria && UpdateBillCriteria.additionalDetails && UpdateBillCriteria.additionalDetails.reason == "OTHER") {
      if(UpdateBillCriteria && UpdateBillCriteria.additionalDetails && !UpdateBillCriteria.additionalDetails.description) descriptionCheck = false;
      else descriptionCheck = true;
  }

  if (UpdateBillCriteria && UpdateBillCriteria.additionalDetails && UpdateBillCriteria.additionalDetails.reason && descriptionCheck) {
    try {
      dispatch(showSpinner());
      const UpdateBillCriteriaObj = get(state, "screenConfiguration.preparedFinalObject.UpdateBillCriteria", {});
      set(UpdateBillCriteria, "tenantId", getQueryArg(window.location.href, "tenantId"));
      set(UpdateBillCriteria, "consumerCodes", [getQueryArg(window.location.href, "consumerNumber", "")]);
      set(UpdateBillCriteria, "businessService", getQueryArg(window.location.href, "businessService"));
      let additionalDetails = {};
      if (get(state.screenConfiguration.preparedFinalObject, 'UpdateBillCriteria.additionalDetails.reason', '') == "OTHER") {
        additionalDetails.reason = UpdateBillCriteriaObj.additionalDetails.reason;
        additionalDetails.description = UpdateBillCriteriaObj.additionalDetails.description;
      } else {
        additionalDetails.reason = UpdateBillCriteriaObj.additionalDetails.reason;
      }
      additionalDetails.reasonMessage = getLocaleLabels(`BC_REASON_${UpdateBillCriteriaObj.additionalDetails.reason}`,`BC_REASON_${UpdateBillCriteriaObj.additionalDetails.reason}`);
      set(UpdateBillCriteria, "additionalDetails", additionalDetails);
      set(UpdateBillCriteria, 'statusToBeUpdated', 'CANCELLED');

      let payload = await httpRequest(
        "post",
        `billing-service/bill/v2/_cancelbill`,
        "_search",
        [],
        { UpdateBillCriteria: UpdateBillCriteria }
      );
      if (payload) {
        dispatch(hideSpinner());
        dispatch(setRoute(`/bills/acknowledgement?purpose=apply&status=success&consumerNumber=${getQueryArg(window.location.href, "consumerNumber", "")}&service=${getQueryArg(window.location.href, "service", "")}&billNo=${getQueryArg(window.location.href, "billNumber", "")}`));
      }
    } catch (error) {
      dispatch(hideSpinner());
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please fill the required fields.",
            labelKey: error.message
          },
          "error"
        )
      );
    }
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill the required fields.",
          labelKey: "CR_REQUIRED_FIELDS_ERROR_MSG"
        },
        "info"
      )
    );
  }
}
