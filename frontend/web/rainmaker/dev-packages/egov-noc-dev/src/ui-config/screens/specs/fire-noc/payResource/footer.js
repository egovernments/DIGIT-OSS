import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import cloneDeep from "lodash/cloneDeep";
import { httpRequest } from "../../../../../ui-utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { convertDateToEpoch, validateFields } from "../../utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import { getBill } from "../../utils";

// export const callPGService = async (state, dispatch) => {
//   const tenantId = getQueryArg(window.location.href, "tenantId");
//   let callbackUrl = `${window.origin}/${
//     process.env.NODE_ENV === "production" ? "citizen" : ""
//   }/tradelicense-citizen/PaymentRedirectPage`;
//   try {
//     const queryObj = [
//       {
//         key: "tenantId",
//         value: tenantId
//       },
//       {
//         key: "consumerCode",
//         value: getQueryArg(window.location.href, "applicationNumber")
//       },
//       {
//         key: "businessService",
//         value: "TL"
//       }
//     ];
//     const billPayload = await getBill(queryObj);
//     try {
//       const requestBody = {
//         Transaction: {
//           tenantId,
//           txnAmount: get(
//             billPayload,
//             "billResponse.Bill[0].billDetails[0].totalAmount"
//           ),
//           module: "TL",
//           billId: get(billPayload, "billResponse.Bill[0].id"),
//           moduleId: get(
//             billPayload,
//             "billResponse.Bill[0].billDetails[0].consumerCode"
//           ),
//           productInfo: "Trade License Payment",
//           gateway: "AXIS",
//           callbackUrl
//         }
//       };
//       const goToPaymentGateway = await httpRequest(
//         "post",
//         "pg-service/transaction/v1/_create",
//         "_create",
//         [],
//         requestBody
//       );
//       const redirectionUrl = get(goToPaymentGateway, "Transaction.redirectUrl");
//       window.location = redirectionUrl;
//     } catch (e) {
//       console.log(e);
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };

const moveToSuccess = (href, dispatch, receiptNumber) => {
  const applicationNo = getQueryArg(href, "applicationNumber");
  const tenantId = getQueryArg(href, "tenantId");
  const purpose = "pay";
  const status = "success";
  dispatch(
    setRoute(
      `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&tenantId=${tenantId}&secondNumber=${receiptNumber}`
    )
  );
};

const getSelectedTabIndex = paymentType => {
  switch (paymentType) {
    case "Cash":
      return {
        selectedPaymentMode: "cash",
        selectedTabIndex: 0,
        fieldsToValidate: ["payeeDetails"]
      };
    case "Cheque":
      return {
        selectedPaymentMode: "cheque",
        selectedTabIndex: 1,
        fieldsToValidate: ["payeeDetails", "chequeDetails"]
      };
    case "DD":
      return {
        selectedPaymentMode: "demandDraft",
        selectedTabIndex: 2,
        fieldsToValidate: ["payeeDetails", "demandDraftDetails"]
      };
    case "Card":
      return {
        selectedPaymentMode: "card",
        selectedTabIndex: 3,
        fieldsToValidate: ["payeeDetails", "cardDetails"]
      };
    default:
      return {
        selectedPaymentMode: "cash",
        selectedTabIndex: 0,
        fieldsToValidate: ["payeeDetails"]
      };
  }
};

const convertDateFieldToEpoch = (finalObj, jsonPath) => {
  const dateConvertedToEpoch = convertDateToEpoch(get(finalObj, jsonPath));
  set(finalObj, jsonPath, dateConvertedToEpoch);
};

const allDateToEpoch = (finalObj, jsonPaths) => {
  jsonPaths.forEach(jsonPath => {
    if (get(finalObj, jsonPath)) {
      convertDateFieldToEpoch(finalObj, jsonPath);
    }
  });
};

const callBackForPay = async (state, dispatch) => {
  const { href } = window.location;
  let isFormValid = true;

  // --- Validation related -----//

  const selectedPaymentType = get(
    state.screenConfiguration.preparedFinalObject,
    "ReceiptTemp[0].instrument.instrumentType.name"
  );
  const {
    selectedTabIndex,
    selectedPaymentMode,
    fieldsToValidate
  } = getSelectedTabIndex(selectedPaymentType);

  isFormValid =
    fieldsToValidate
      .map(curr => {
        return validateFields(
          `components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.capturePaymentDetails.children.cardContent.children.tabSection.props.tabs[${selectedTabIndex}].tabContent.${selectedPaymentMode}.children.${curr}.children`,
          state,
          dispatch,
          "pay"
        );
      })
      .indexOf(false) === -1;
  if (
    get(
      state.screenConfiguration.preparedFinalObject,
      "Bill[0].billDetails[0].manualReceiptDate"
    )
  ) {
    isFormValid = validateFields(
      `components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.g8Details.children.cardContent.children.receiptDetailsCardContainer.children`,
      state,
      dispatch,
      "pay"
    );
  }

  //------------ Validation End -------------//

  //------------- Form related ----------------//

  const ReceiptDataTemp = get(
    state.screenConfiguration.preparedFinalObject,
    "ReceiptTemp[0]"
  );
  let finalReceiptData = cloneDeep(ReceiptDataTemp);

  allDateToEpoch(finalReceiptData, [
    "Bill[0].billDetails[0].manualReceiptDate",
    "instrument.transactionDateInput"
  ]);

  // if (get(finalReceiptData, "Bill[0].billDetails[0].manualReceiptDate")) {
  //   convertDateFieldToEpoch(
  //     finalReceiptData,
  //     "Bill[0].billDetails[0].manualReceiptDate"
  //   );
  // }

  // if (get(finalReceiptData, "instrument.transactionDateInput")) {
  //   convertDateFieldToEpoch(
  //     finalReceiptData,
  //     "Bill[0].billDetails[0].manualReceiptDate"
  //   );
  // }
  if (get(finalReceiptData, "instrument.transactionDateInput")) {
    set(
      finalReceiptData,
      "instrument.instrumentDate",
      get(finalReceiptData, "instrument.transactionDateInput")
    );
  }

  if (get(finalReceiptData, "instrument.transactionNumber")) {
    set(
      finalReceiptData,
      "instrument.instrumentNumber",
      get(finalReceiptData, "instrument.transactionNumber")
    );
  }

  if (selectedPaymentType === "Card") {
    //Extra check - remove once clearing forms onTabChange is fixed
    if (
      get(finalReceiptData, "instrument.transactionNumber") !==
      get(finalReceiptData, "instrument.transactionNumberConfirm")
    ) {
      dispatch(
        toggleSnackbar(true, "Transaction numbers don't match !", "error")
      );
      return;
    }
  }

  //------------- Form End ----------------//

  let ReceiptBody = {
    Receipt: []
  };

  ReceiptBody.Receipt.push(finalReceiptData);

  // console.log(ReceiptBody);

  //---------------- Create Receipt ------------------//
  if (isFormValid) {
    try {
      let response = await httpRequest(
        "post",
        "collection-services/receipts/_create",
        "_create",
        [],
        ReceiptBody,
        [],
        {}
      );
      let receiptNumber = get(
        response,
        "Receipt[0].Bill[0].billDetails[0].receiptNumber",
        null
      );
      moveToSuccess(href, dispatch, receiptNumber);
    } catch (e) {
      dispatch(toggleSnackbar(true, e.message, "error"));
      console.log(e);
    }
  } else {
    dispatch(
      toggleSnackbar(true, "Please fill all the mandatory fields", "warning")
    );
  }
};

export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
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
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "TL_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPay
    },
    roleDefination: {
      rolePath: "user-info.roles",
      //roles: ["TL_CEMP"]
      action: "PAY"
    },
    visible: process.env.REACT_APP_NAME === "Citizen" ? false : true
  },
  downloadConfirmationform: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "DOWNLOAD CONFIRMATION FORM",
        labelKey: "TL_COMMON_BUTTON_DOWNLOAD_CONFIRMATION_FORM"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPay
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["CITIZEN"]
    }
  },
  printConfirmationform: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "PRINT CONFIRMATION FORM",
        labelKey: "TL_COMMON_BUTTON_PRINT_CONFIRMATION_FORM"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPay
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["CITIZEN"]
    }
  },
  makePayment: {
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
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "TL_COMMON_BUTTON_CITIZEN_MAKE_PAYMENT"
      })
    },
    onClickDefination: {
      action: "page_change",
      path:
        process.env.REACT_APP_SELF_RUNNING === "true"
          ? `/egov-ui-framework/fire-noc/acknowledgement?purpose=pay&status=success&applicationNumber=NOC-JLD-2018-09-8786&secondNumber=NOC-RCPT-007652`
          : `/fire-noc/acknowledgement?purpose=pay&status=success&applicationNumber=NOC-JLD-2018-09-8786&secondNumber=NOC-RCPT-007652`
    }
    // roleDefination: {
    //   rolePath: "user-info.roles",
    //   // roles: ["CITIZEN"]
    //   action: "PAY"
    // },
    // visible: process.env.REACT_APP_NAME === "Citizen" ? true : false
  }
});
