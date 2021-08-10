import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  getFooterButtons,
  getCommonApplyFooter,
  onClickPreviousButton,
  onClickNextButton,
  getCheckBoxJsonpath
} from "../../utils";
import { prepareFinalObject as pFO } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { updateTradeDetails } from "../../../../../ui-utils/commons";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

const userName = JSON.parse(window.getUserInfo()).name;

const onNextButtonClick = async (state, dispatch) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { Licenses } = preparedFinalObject;
  const queryValue = getQueryArg(window.location.href, "purpose");
  if (Licenses && Licenses.length > 0) {
    const status = get(Licenses[0], "status");
    switch (queryValue) {
      case "cancel":
        if (status === "APPROVED") {
          set(Licenses[0], "action", "CANCEL");
        }
        break;
      case "reject":
        if (status === "PAID") {
          set(Licenses[0], "action", "REJECT");
        }
        break;
      default:
        if (status === "PAID") {
          set(Licenses[0], "action", "APPROVE");
        }
        break;
    }
  }
  if (get(preparedFinalObject, getCheckBoxJsonpath(queryValue))) {
    switch (queryValue) {
      case "cancel":
        dispatch(
          pFO(
            "Licenses[0].tradeLicenseDetail.additionalDetail.cancelDetail.cancelledBy",
            userName
          )
        );
        break;
      case "reject":
        dispatch(
          pFO(
            "Licenses[0].tradeLicenseDetail.additionalDetail.rejectDetail.rejectedBy",
            userName
          )
        );
        break;
      default:
        dispatch(
          pFO(
            "Licenses[0].tradeLicenseDetail.additionalDetail.approveDetail.approvedBy",
            userName
          )
        );
        break;
    }
    let response = await updateTradeDetails({ Licenses });
    if (response) {
      const applicationNumber = get(response, "Licenses[0].applicationNumber");
      const secondNumber = get(response, "Licenses[0].licenseNumber");
      const tenantId = get(response, "Licenses[0].tenantId");
      const route = onClickNextButton(
        applicationNumber,
        secondNumber,
        queryValue,
        tenantId
      );
      dispatch(setRoute(route));
    } else {
      response &&
        response.Error &&
        response.Error[0] &&
        dispatch(
          toggleSnackbar(true, get("response", Error[0].message), "error")
        );
    }
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please accept the terms !",
          labelKey: "ERR_ACCEPT_THE_TERMS"
        },
        "error"
      )
    );
  }
};

export const footerApprove = (applicationNumber, tenantId, queryPurpose) => {
  return getCommonApplyFooter({
    previousButton: {
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
        nextButtonLabel: getLabel({
          labelName: "BACK",
          labelKey: "BPA_COMMON_BUTTON_BACK"
        })
      },
      onClickDefination: {
        action: "page_change",
        path: onClickPreviousButton(queryPurpose, applicationNumber, tenantId)
      }
    },

    nextButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        nextButtonLabel: getFooterButtons(queryPurpose)
      },
      onClickDefination: {
        action: "condition",
        callBack: onNextButtonClick
      }
    }
  });
};
