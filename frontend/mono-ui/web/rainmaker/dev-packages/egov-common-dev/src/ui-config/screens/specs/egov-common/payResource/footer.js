import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, isPublicSearch } from "egov-ui-framework/ui-utils/commons";
import { getPaymentSearchAPI } from "egov-ui-kit/utils/commons";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../../ui-utils/api";
import { convertDateToEpoch, ifUserRoleExists, validateFields } from "../../utils";
import { paybuttonJsonpath } from "./constants";
import "./index.css";

const checkAmount = (totalAmount, customAmount, businessService) => {
  if (totalAmount !== 0 && customAmount === 0) {
    return true;
  } else if (totalAmount === 0 && customAmount === 0 && (businessService === "WS" || businessService === "SW")) {
    return true;
  } else {
    return false;
  }
}

export const callPGService = async (state, dispatch) => {
  const isAdvancePaymentAllowed = get(state, "screenConfiguration.preparedFinalObject.businessServiceInfo.isAdvanceAllowed");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const consumerCode = getQueryArg(window.location.href, "consumerCode");
  const businessService = get(
    state,
    "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].businessService"
  );

  const url = isPublicSearch() ? "withoutAuth/egov-common/paymentRedirectPage" : "egov-common/paymentRedirectPage";
  const redirectUrl = process.env.NODE_ENV === "production" ? `citizen/${url}` : url;
  // const businessService = getQueryArg(window.location.href, "businessService"); businessService
  let callbackUrl = `${window.origin}/${redirectUrl}`;
  const { screenConfiguration = {} } = state;
  const { preparedFinalObject = {} } = screenConfiguration;
  const { ReceiptTemp = {} } = preparedFinalObject;
  const billPayload = ReceiptTemp[0];
  const taxAmount = Number(get(billPayload, "Bill[0].totalAmount"));
  let amtToPay =
    state.screenConfiguration.preparedFinalObject.AmountType ===
      "partial_amount"
      ? state.screenConfiguration.preparedFinalObject.AmountPaid
      : taxAmount;
  amtToPay = amtToPay ? Number(amtToPay) : taxAmount;

  if (amtToPay > taxAmount && !isAdvancePaymentAllowed) {
    alert("Advance Payment is not allowed");
    return;
  }
  let isFormValid = validateFields(
    "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.capturePayerDetails.children.cardContent.children.payerDetailsCardContainer.children",
    state,
    dispatch,
    "pay"
  );
  if (!isFormValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Transaction numbers don't match !",
          labelKey: "ERR_FILL_ALL_FIELDS"
        },
        "error"
      )
    );
    return;
  }
  if (checkAmount(taxAmount, Number(state.screenConfiguration.preparedFinalObject.AmountPaid), businessService)) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please enter an amount greater than zero!", labelKey: "ERR_ENTER_AMOUNT_MORE_THAN_ZERO" },
        "error"
      )
    );
    return;
  }

  if (checkAmount(taxAmount, Number(state.screenConfiguration.preparedFinalObject.AmountPaid), businessService)) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please enter an amount greater than zero!", labelKey: "ERR_ENTER_AMOUNT_MORE_THAN_ZERO" },
        "error"
      )
    );
    return;
  }
  const payerInfo=get(billPayload, "Bill[0].payer",'').replace("COMMON_",'');
  const user = {
    name: get(billPayload, "Bill[0].paidBy", get(billPayload, "Bill[0].payerName")),
    mobileNumber: get(billPayload, "Bill[0].payerMobileNumber", get(billPayload, "Bill[0].mobileNumber")),
    tenantId
  };
  let taxAndPayments = [];
  taxAndPayments.push({
    // taxAmount:taxAmount,
    // businessService: businessService,
    billId: get(billPayload, "Bill[0].id"),
    amountPaid: amtToPay
  });
  const buttonJsonpath = paybuttonJsonpath + `${process.env.REACT_APP_NAME === "Citizen" ? "makePayment" : "generateReceipt"}`;
  try {

    dispatch(handleField("pay", buttonJsonpath, "props.disabled", true));

    const requestBody = {
      Transaction: {
        tenantId,
        txnAmount: amtToPay,
        module: businessService,
        billId: get(billPayload, "Bill[0].id"),
        consumerCode: consumerCode,
        productInfo: "Common Payment",
        gateway: "AXIS",
        taxAndPayments,
        user,
        callbackUrl,
        additionalDetails: { isWhatsapp: localStorage.getItem('pay-channel') == 'whatsapp' ? true : false,
        paidBy:payerInfo }
      }
    };
    const goToPaymentGateway = await httpRequest(
      "post",
      "pg-service/transaction/v1/_create",
      "_create",
      [],
      requestBody
    );

    if (get(goToPaymentGateway, "Transaction.txnAmount") == 0) {
      const srcQuery = `?tenantId=${get(
        goToPaymentGateway,
        "Transaction.tenantId"
      )}&billIds=${get(goToPaymentGateway, "Transaction.billId")}`;

      let searchResponse = await httpRequest(
        "post",
        getPaymentSearchAPI(businessService) + srcQuery,
        "_search",
        [],
        {}
      );

      let transactionId = get(
        searchResponse,
        "Payments[0].paymentDetails[0].receiptNumber"
      );
      const ackUrl = `/egov-common/acknowledgement?status=${"success"}&consumerCode=${consumerCode}&tenantId=${tenantId}&receiptNumber=${transactionId}&businessService=${businessService}`;
      const successUrl = isPublicSearch() ? `/withoutAuth${ackUrl}` : ackUrl;
      dispatch(
        setRoute(
          successUrl
        )
      );
    } else {
      const redirectionUrl =
        get(goToPaymentGateway, "Transaction.redirectUrl") ||
        get(goToPaymentGateway, "Transaction.callbackUrl");
      window.location = redirectionUrl;
    }
  } catch (e) {
    dispatch(handleField("pay", buttonJsonpath, "props.disabled", false));
    dispatch(
      toggleSnackbar(
        true,
        { labelName: e.message, labelKey: e.message },
        "error"
      )
    );
    /*     // }else{
          moveToFailure(dispatch);
        }
     */
  }
};

const moveToSuccess = (dispatch, receiptNumber) => {
  const consumerCode = getQueryArg(window.location, "consumerCode");
  const tenantId = getQueryArg(window.location, "tenantId");
  const businessService = getQueryArg(window.location, "businessService");
  const status = "success";
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  let moduleName = "egov-common";
  if (businessService && businessService.indexOf("BPA") > -1) {
    moduleName = "egov-bpa"
  }
  const url = `${appendUrl}/${moduleName}/acknowledgement?status=${status}&consumerCode=${consumerCode}&tenantId=${tenantId}&receiptNumber=${receiptNumber}&businessService=${businessService}&purpose=${"pay"}`;
  const ackSuccessUrl = isPublicSearch() ? `/withoutAuth${url}` : url;
  dispatch(
    setRoute(ackSuccessUrl)
  );
};
const moveToFailure = dispatch => {
  const consumerCode = getQueryArg(window.location, "consumerCode");
  const tenantId = getQueryArg(window.location, "tenantId");
  const businessService = getQueryArg(window.location, "businessService");
  const status = "failure";
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const url = `${appendUrl}/egov-common/acknowledgement?status=${status}&consumerCode=${consumerCode}&tenantId=${tenantId}&businessService=${businessService}`
  const ackFailureUrl = isPublicSearch() ? `/withoutAuth${url}` : url;
  dispatch(
    setRoute(
      ackFailureUrl
    )
  );
};

const getSelectedTabIndex = paymentType => {
  switch (paymentType) {
    case "CASH":
      return {
        selectedPaymentMode: "cash",
        selectedTabIndex: 0,
        fieldsToValidate: ["payeeDetails"]
      };
    case "CHEQUE":
      return {
        selectedPaymentMode: "cheque",
        selectedTabIndex: 1,
        fieldsToValidate: ["payeeDetails", "chequeDetails"]
      };

    case "CARD":
      return {
        selectedPaymentMode: "card",
        selectedTabIndex: 2,
        fieldsToValidate: ["payeeDetails", "cardDetails"]
      };
    case "OFFLINE_NEFT":
      return {
        selectedPaymentMode: "offline_neft",
        selectedTabIndex: 3,
        fieldsToValidate: ["payeeDetails", "onlineDetails"]
      };
    case "OFFLINE_RTGS":
      return {
        selectedPaymentMode: "offline_rtgs",
        selectedTabIndex: 4,
        fieldsToValidate: ["payeeDetails", "onlineDetails"]
      };
    case "POSTAL_ORDER":
      return {
        selectedPaymentMode: "postal_order",
        selectedTabIndex: 5,
        fieldsToValidate: ["payeeDetails", "poDetails"]
      };
    case "DD":
      return {
        selectedPaymentMode: "demandDraft",
        selectedTabIndex: 6,
        fieldsToValidate: ["payeeDetails", "demandDraftDetails"]
      };

    default:
      return {
        selectedPaymentMode: "cash",
        selectedTabIndex: 0,
        fieldsToValidate: ["payeeDetails"]
      };
  }
};

const validateString = (str = "") => {
  str = str && str != null && str.trim() || "";
  if (str.length > 0) {
    return true;
  }
  return false;
}
const convertDateFieldToEpoch = (finalObj, jsonPath) => {
  const dateConvertedToEpoch = convertDateToEpoch(
    get(finalObj, jsonPath),
    "daystart"
  );
  set(finalObj, jsonPath, dateConvertedToEpoch);
};

const allDateToEpoch = (finalObj, jsonPaths) => {
  jsonPaths.forEach(jsonPath => {
    if (get(finalObj, jsonPath)) {
      convertDateFieldToEpoch(finalObj, jsonPath);
    }
  });
};

const updatePayAction = async (
  state,
  dispatch,
  consumerCode,
  tenantId,
  receiptNumber
) => {
  try {
    moveToSuccess(dispatch, receiptNumber);
  } catch (e) {
    moveToFailure(dispatch);
    dispatch(
      toggleSnackbar(
        true,
        { labelName: e.message, labelKey: e.message },
        "error"
      )
    );
    console.log(e);
  }
};

const callBackForPay = async (state, dispatch) => {
  let isFormValid = true;
  const isAdvancePaymentAllowed = get(state, "screenConfiguration.preparedFinalObject.businessServiceInfo.isAdvanceAllowed");
  const roleExists = ifUserRoleExists("CITIZEN");
  if (roleExists) {
    alert("You are not Authorized!");
    return;
  }

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

  if (selectedPaymentType === "CARD") {
    //Extra check - remove once clearing forms onTabChange is fixed
    if (
      get(finalReceiptData, "instrument.transactionNumber") !==
      get(finalReceiptData, "instrument.transactionNumberConfirm")
    ) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Transaction numbers don't match !",
            labelKey: "ERR_TRANSACTION_NO_DONT_MATCH"
          },
          "error"
        )
      );
      return;
    }
  }
  if (selectedPaymentType === "CHEQUE" || selectedPaymentType === "OFFLINE_NEFT" || selectedPaymentType === "OFFLINE_RTGS") {
    //Extra check - to verify ifsc and bank details are populated 


    let ifscCode = get(finalReceiptData, "instrument.ifscCode", "");
    let branchName = get(finalReceiptData, "instrument.branchName", "");
    let bankName = get(finalReceiptData, "instrument.bank.name", "");
    if (
      !validateString(ifscCode) || !validateString(branchName) || !validateString(bankName) || ifscCode !== get(
        state.screenConfiguration.preparedFinalObject,
        "validIfscCode", ""
      )
    ) {
      dispatch(
        prepareFinalObject("ReceiptTemp[0].instrument.bank.name", "")
      );
      dispatch(
        prepareFinalObject("ReceiptTemp[0].instrument.branchName", "")
      );
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Enter a Valid IFSC code !",
            labelKey: "ERR_ENTER_VALID_IFSC"
          },
          "error"
        )
      );
      return;
    }
  }


  //------------- Form End ----------------//

  let ReceiptBody = {
    Receipt: []
  };
  let ReceiptBodyNew = {
    Payment: { paymentDetails: [] }
  };

  ReceiptBody.Receipt.push(finalReceiptData);
  const totalAmount = Number(finalReceiptData.Bill[0].totalAmount);

  ReceiptBodyNew.Payment["tenantId"] = finalReceiptData.tenantId;
  ReceiptBodyNew.Payment["totalDue"] = totalAmount;

  ReceiptBodyNew.Payment["paymentMode"] =
    finalReceiptData.instrument.instrumentType.name;
  ReceiptBodyNew.Payment["paidBy"] = finalReceiptData.Bill[0].payer;
  ReceiptBodyNew.Payment["mobileNumber"] =
    finalReceiptData.Bill[0].payerMobileNumber;
  ReceiptBodyNew.Payment["payerName"] = finalReceiptData.Bill[0].paidBy ? finalReceiptData.Bill[0].paidBy : (finalReceiptData.Bill[0].payerName || finalReceiptData.Bill[0].payer);
  if (finalReceiptData.instrument.transactionNumber) {
    ReceiptBodyNew.Payment["transactionNumber"] =
      finalReceiptData.instrument.transactionNumber;
  }
  if (finalReceiptData.instrument.instrumentNumber) {
    ReceiptBodyNew.Payment["instrumentNumber"] =
      finalReceiptData.instrument.instrumentNumber;
  }
  if (finalReceiptData.instrument.instrumentDate) {
    ReceiptBodyNew.Payment["instrumentDate"] =
      finalReceiptData.instrument.instrumentDate;
  }
  if (finalReceiptData.instrument.ifscCode) {
    ReceiptBodyNew.Payment["ifscCode"] =
      finalReceiptData.instrument.ifscCode;
  }
  let amtPaid =
    state.screenConfiguration.preparedFinalObject.AmountType ===
      "partial_amount"
      ? state.screenConfiguration.preparedFinalObject.AmountPaid
      : finalReceiptData.Bill[0].totalAmount;
  amtPaid = amtPaid ? Number(amtPaid) : totalAmount;


  if (amtPaid > totalAmount && !isAdvancePaymentAllowed) {
    alert("Advance Payment is not allowed");
    return;
  }

  if (checkAmount(totalAmount, Number(state.screenConfiguration.preparedFinalObject.AmountPaid), finalReceiptData.Bill[0].businessService)) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please enter an amount greater than zero!", labelKey: "ERR_ENTER_AMOUNT_MORE_THAN_ZERO" },
        "error"
      )
    );
    return;
  }

  ReceiptBodyNew.Payment.paymentDetails.push({
    manualReceiptDate:
      finalReceiptData.Bill[0].billDetails[0].manualReceiptDate,
    manualReceiptNumber:
      finalReceiptData.Bill[0].billDetails[0].manualReceiptNumber,
    businessService: finalReceiptData.Bill[0].businessService,
    billId: finalReceiptData.Bill[0].id,
    totalDue: totalAmount,
    totalAmountPaid: amtPaid
  });
  ReceiptBodyNew.Payment["totalAmountPaid"] = amtPaid;

  //---------------- Create Receipt ------------------//
  if (isFormValid) {
    const buttonJsonpath = paybuttonJsonpath + `${process.env.REACT_APP_NAME === "Citizen" ? "makePayment" : "generateReceipt"}`;
    dispatch(handleField("pay", buttonJsonpath, "props.disabled", true));
    try {
      let response = await httpRequest(
        "post",
        "collection-services/payments/_create",
        "_create",
        [],
        ReceiptBodyNew,
        [],
        {}
      );
      let receiptNumber = get(
        response,
        "Payments[0].paymentDetails[0].receiptNumber",
        null
      );

      // Search NOC application and update action to PAY
      const consumerCode = getQueryArg(window.location, "consumerCode");
      const tenantId = getQueryArg(window.location, "tenantId");
      await updatePayAction(
        state,
        dispatch,
        consumerCode,
        tenantId,
        receiptNumber
      );
    } catch (e) {

      dispatch(handleField("pay", buttonJsonpath, "props.disabled", false));
      dispatch(
        toggleSnackbar(
          true,
          { labelName: e.message, labelKey: e.message },
          "error"
        )
      );
      console.log(e);
    }
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill all the mandatory fields",
          labelKey: "ERR_FILL_ALL_FIELDS"
        },
        "error"
      )
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
  generateReceipt: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      className: "gen-receipt-com",
      // style: {
      //   width: "379px",
      //   height: "48px ",
      //   right: "19px ",
      //   position: "relative",
      //   borderRadius: "0px "
      // }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "GENERATE RECEIPT",
        labelKey: "COMMON_GENERATE_RECEIPT"
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
    // roleDefination: {
    //   rolePath: "user-info.roles",
    //   roles: ["NOC_CEMP"],
    //   action: "PAY"
    // },
    visible: process.env.REACT_APP_NAME === "Citizen" ? false : true
  },
  makePayment: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      className: "make-payment-com",
      // style: {
      //   width: "363px",
      //   height: "48px ",
      //   right: "19px",
      //   position: "relative",
      //   borderRadius: "0px "
      // }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "COMMON_MAKE_PAYMENT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right",
          className: ""
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callPGService
    },
    // roleDefination: {
    //   rolePath: "user-info.roles",
    //   roles: ["CITIZEN"],
    //   action: "PAY"
    // },
    visible: process.env.REACT_APP_NAME === "Citizen" ? true : false
  }
});

