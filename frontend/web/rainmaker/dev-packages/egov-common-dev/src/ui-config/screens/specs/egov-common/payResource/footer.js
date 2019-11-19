import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../../ui-utils/api";
import { convertDateToEpoch, validateFields } from "../../utils";
import { ifUserRoleExists } from "../../utils";

export const callPGService = async (state, dispatch) => {
  
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const consumerCode = getQueryArg(window.location.href, "consumerCode");
  const businessService =  get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].businessService");
  // const businessService = getQueryArg(window.location.href, "businessService"); businessService
  let callbackUrl = `${
    process.env.NODE_ENV === "production"
      ? `${window.origin}/citizen`
      : window.origin
    }/egov-common/paymentRedirectPage`;

  const { screenConfiguration = {} } = state;
  const {
    preparedFinalObject = {}
  } = screenConfiguration;
  const {
    ReceiptTemp = {}
  } = preparedFinalObject;
  const billPayload = ReceiptTemp[0];
  const taxAmount=Number(get(billPayload, "Bill[0].totalAmount"));
  let amtToPay = state.screenConfiguration.preparedFinalObject.AmountType === "partial_amount" ? state.screenConfiguration.preparedFinalObject.AmountPaid : taxAmount;
  amtToPay = amtToPay ? Number(amtToPay) :taxAmount;
  const user={
    name:get(billPayload, "Bill[0].payerName"),
    mobileNumber:get(billPayload, "Bill[0].mobileNumber"),
    tenantId
  };
  let taxAndPayments = [];
  taxAndPayments.push({
    // taxAmount:taxAmount,
    // businessService: businessService,
    billId: get(billPayload, "Bill[0].id"),
    amountPaid: amtToPay
  })
  try {
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
        callbackUrl
      }
    };
    const goToPaymentGateway = await httpRequest(
      "post",
      "pg-service/transaction/v1/_create",
      "_create",
      [],
      requestBody
    );

    if(get(goToPaymentGateway, "Transaction.txnAmount")==0){
      const srcQuery=`?tenantId=${get(goToPaymentGateway, "Transaction.tenantId")}&billIds=${get(goToPaymentGateway, "Transaction.billId")}`
 
 
        let searchResponse = await httpRequest(
          "post",
          "collection-services/payments/_search" + srcQuery,
          "_search",
          [],
          {}
        );

        let transactionId = get(searchResponse, "Payments[0].paymentDetails[0].receiptNumber");


        dispatch(
          setRoute(
            `/egov-common/acknowledgement?status=${"success"}&consumerCode=${consumerCode}&tenantId=${tenantId}&receiptNumber=${transactionId}`
          )
        );
       
      
    }else{
      const redirectionUrl = get(goToPaymentGateway, "Transaction.redirectUrl")|| get(goToPaymentGateway, "Transaction.callbackUrl");
      window.location = redirectionUrl;
    }
   
  } catch (e) {
    console.log(e);
    moveToFailure(dispatch);
  }
};

const moveToSuccess = (dispatch, receiptNumber) => {
  const consumerCode = getQueryArg(window.location, "consumerCode");
  const tenantId = getQueryArg(window.location, "tenantId");
  const status = "success";
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  dispatch(
    setRoute(
      `${appendUrl}/egov-common/acknowledgement?status=${status}&consumerCode=${consumerCode}&tenantId=${tenantId}&receiptNumber=${receiptNumber}`
    )
  );
};
const moveToFailure = (dispatch) => {
  const consumerCode = getQueryArg(window.location, "consumerCode");
  const tenantId = getQueryArg(window.location, "tenantId");
  const status = "failure";
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  dispatch(
    setRoute(
      `${appendUrl}/egov-common/acknowledgement?status=${status}&consumerCode=${consumerCode}&tenantId=${tenantId}`
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
  const roleExists = ifUserRoleExists("CITIZEN");
  if(roleExists){
    alert('You are not Authorized!');
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

  if (selectedPaymentType === "Card") {
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

  //------------- Form End ----------------//

  let ReceiptBody = {
    Receipt: []
  };
  let ReceiptBodyNew = {
    Payment: { paymentDetails: [] }
  };

  ReceiptBody.Receipt.push(finalReceiptData);
  const totalAmount=Number(finalReceiptData.Bill[0].totalAmount);

  ReceiptBodyNew.Payment['tenantId'] = finalReceiptData.tenantId;
  ReceiptBodyNew.Payment['totalDue'] = totalAmount;

  ReceiptBodyNew.Payment['paymentMode'] = finalReceiptData.instrument.instrumentType.name;
  ReceiptBodyNew.Payment['paidBy'] = finalReceiptData.Bill[0].payerName;
  ReceiptBodyNew.Payment['mobileNumber'] = finalReceiptData.Bill[0].mobileNumber;
  if (ReceiptBodyNew.Payment.paymentMode !== 'Cash') {
    ReceiptBodyNew.Payment['transactionNumber'] = finalReceiptData.instrument.transactionNumber;
    ReceiptBodyNew.Payment['instrumentNumber'] = finalReceiptData.instrument.instrumentNumber;
    if (ReceiptBodyNew.Payment.paymentMode === "Cheque") {
      ReceiptBodyNew.Payment['instrumentDate'] = finalReceiptData.instrument.instrumentDate;
    }
  }

  let amtPaid = state.screenConfiguration.preparedFinalObject.AmountType === "partial_amount" ? state.screenConfiguration.preparedFinalObject.AmountPaid : finalReceiptData.Bill[0].totalAmount;
  amtPaid = amtPaid ? Number(amtPaid) :totalAmount;
  ReceiptBodyNew.Payment.paymentDetails.push(
    {
      businessService: finalReceiptData.Bill[0].businessService,
      billId: finalReceiptData.Bill[0].id,
      totalDue:totalAmount,
      totalAmountPaid: amtPaid
    }
  )
  ReceiptBodyNew.Payment['totalAmountPaid'] = amtPaid;


  // console.log(ReceiptBody);

  //---------------- Create Receipt ------------------//
  if (isFormValid) {
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
        "warning"
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
      style: {
        width: "379px",
        height: "48px ",
        right: "19px ",
        position:"relative",
        borderRadius:"0px "
      }
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
      style: {
        width: "363px",
        height: "48px ",
        right: "19px",
        position:"relative",
        borderRadius:"0px "
      }
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
          className:""
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