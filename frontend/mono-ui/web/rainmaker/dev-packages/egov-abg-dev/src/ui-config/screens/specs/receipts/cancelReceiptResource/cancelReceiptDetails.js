import {
  getCommonCard,

  getCommonContainer, getCommonGrayCard,
  getCommonSubHeader,

  getLabelWithValue, getPattern, getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { checkValueForNA } from "../../utils";
import { convertEpochToDate } from "../../utils/index";


export const receiptSummaryDetails = {
  receiptNumber: getLabelWithValue(
    {
      labelName: "Reason for Transfer",
      labelKey: "CR_RECEIPT_NUMBER"
    },
    {
      jsonPath:
        "PaymentReceipt.paymentDetails[0].receiptNumber",
      callBack: checkValueForNA
    }
  ),
  consumerNo: getLabelWithValue(
    {
      labelName: "Document Issue Date",
      labelKey: "CR_RECEIPT_CONSUMER_NUMBER"
    },
    {
      jsonPath:
        "PaymentReceipt.paymentDetails[0].bill.consumerCode",
      callBack: checkValueForNA
    }
  ), paymentDate: getLabelWithValue(
    {
      labelName: "Document Value",
      labelKey: "CR_RECEIPT_PAYMENT_DATE"
    },
    {
      jsonPath:
        "PaymentReceipt.paymentDetails[0].receiptDate",
      callBack: value => {
        return convertEpochToDate(value);
      }
    }
  ),
  payerName: getLabelWithValue(
    {
      labelName: "Remarks",
      labelKey: "CR_RECEIPT_PAYER_NAME"
    },
    {
      jsonPath:
        "PaymentReceipt.payerName",
      callBack: checkValueForNA
    }
  ), payerNumber: getLabelWithValue(
    {
      labelName: "Remarks",
      labelKey: "CR_RECEIPT_PAYER_NUMBER"
    },
    {
      jsonPath:
        "PaymentReceipt.mobileNumber",
      callBack: checkValueForNA
    }
  )
}
export const receiptPaymentDetails = {
  serviceType: getLabelWithValue(
    {

      labelName: "Market Value",
      labelKey: "CR_RECEIPT_SERVICE_TYPE"
    },
    {
      jsonPath:
        "PaymentReceipt.paymentDetails[0].businessService",
      callBack: checkValueForNA
    }
  ),
  billPeriod: getLabelWithValue(
    {
      labelName: "Document No.",
      labelKey: "CR_RECEIPT_BILL_PERIOD"
    },
    {
      jsonPath:
        "PaymentReceipt.paymentDetails[0].bill.billDetails[0].fromPeriod",
      callBack: value => {
        return convertEpochToDate(value);
      }
    }
  ), receiptAmount: getLabelWithValue(
    {
      labelName: "Document No.",
      labelKey: "CR_RECEIPT_AMOUNT"
    },
    {
      jsonPath:
        "PaymentReceipt.totalAmountPaid",
      callBack: checkValueForNA
    }
  ), pendingAmount: getLabelWithValue(
    {
      labelName: "Document No.",
      labelKey: "CR_RECEIPT_PENDING_AMOUNT"
    },
    {
      jsonPath:
        "PaymentReceipt.pendingAmountCalculated",
      callBack: checkValueForNA
    }
  ), paymentMode: getLabelWithValue(
    {
      labelName: "Document No.",
      labelKey: "CR_RECEIPT_PAYMENT_MODE"
    },
    {
      jsonPath:
        "PaymentReceipt.paymentMode",
      callBack: checkValueForNA
    }
  ), txnId: getLabelWithValue(
    {
      labelName: "Document No.",
      labelKey: "CR_RECEIPT_TXN_ID"
    },
    {
      jsonPath:
        "PaymentReceipt.transactionNumber",
      callBack: checkValueForNA
    }
  ), g8ReceiptNo: getLabelWithValue(
    {
      labelName: "Document No.",
      labelKey: "CR_RECEIPT_G8_RECEIPT_NO"
    },
    {
      jsonPath:
        "PaymentReceipt.paymentDetails[0].manualReceiptNumber",
      callBack: checkValueForNA
    }
  ), g8ReceiptDate: getLabelWithValue(
    {
      labelName: "Document No.",
      labelKey: "CR_RECEIPT_G8_RECEIPT_DATE"
    },
    {
      jsonPath:
        "PaymentReceipt.paymentDetails[0].manualReceiptDate",
      callBack: value => {
        return convertEpochToDate(value);
      }
    }
  ),
}
const receiptDetails = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Registration Details",
          labelKey: "CR_RECEIPT_SUMMARY"
        })
      }
    }
  },
  receiptPayeeDetails: getCommonCard({ receiptPayeeContainer: getCommonContainer(receiptSummaryDetails) }),
  receiptPaymentDetails: getCommonCard({ receiptPaymentContainer: getCommonContainer(receiptPaymentDetails) })
});

export const receiptSummary = getCommonGrayCard({
  cardOne: receiptDetails
});

export const cancelReceiptDetailsCard = getCommonCard(
  {
    searchContainer: getCommonContainer(
      {
        reason: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-abg",
          componentPath: "AutosuggestContainer",
          props: {
            label: {
              labelName: "Reason",
              labelKey: "CR_RECEIPT_CANCELLATION_REASON_LABEL"
            },
            localePrefix: {
              moduleName: "CR",
              masterName: "REASON"
            },
            optionLabel: "name",
            placeholder: {
              labelName: "Select Reason",
              labelKey: "CR_SELECT_RECEIPT_CANCELLATION_REASON_LABEL"
            },
            required: true,
            labelsFromLocalisation: true,
            isClearable: true,
            className: "autocomplete-dropdown",
            sourceJsonPath: "applyScreenMdmsData.reasonForReceiptCancel",
          },
          required: true,
          jsonPath: "paymentWorkflows[0].reason",
          gridDefination: {
            xs: 12,
            sm: 8
          },
          beforeFieldChange: async (action, state, dispatch) => {
            const additionalDetailsJson = "components.div.children.cancelReceiptDetailsCard.children.cardContent.children.searchContainer.children.addtionalDetails";
            if (action.value == "OTHER") {
              dispatch(handleField('cancelReceipt', additionalDetailsJson, "props.disabled", false))
              dispatch(handleField('cancelReceipt', additionalDetailsJson, "required", true))
              dispatch(handleField('cancelReceipt', additionalDetailsJson, "props.required", true))
            } else {
              dispatch(handleField('cancelReceipt', additionalDetailsJson, "props.disabled", true))
              dispatch(handleField('cancelReceipt', additionalDetailsJson, "required", false))
              dispatch(handleField('cancelReceipt', additionalDetailsJson, "props.required", false))
            }
            dispatch(handleField('cancelReceipt', additionalDetailsJson, "props.value", ""))
            dispatch(handleField('cancelReceipt', additionalDetailsJson, "props.error", false))
            return action;
          }
        },
        addtionalDetails: getTextField({
          label: {
            labelName: "Consumer Name",
            labelKey: "CR_MORE_DETAILS_LABEL"
          },
          placeholder: {
            labelName: "Enter Consumer Name",
            labelKey: "CR_SELECT_MORE_DETAILS_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 8
          },
          required: false,
          disabled: true,
          // multiline: true,
          // rows: "4",
          visible: true,
          pattern: getPattern("Address"),
          errorMessage: "Invalid Details.",
          jsonPath: "paymentWorkflows[0].additionalDetails"
        }),

        addtionalPenalty: getTextField({
          label: {
            labelName: "Comments",
            labelKey: "CR_ADDITIONAL_PENALTY"
          },
          placeholder: {
            labelName: "Enter Comment ",
            labelKey: "CR_ADDITIONAL_PENALTY_PLACEHOLDER"
          },
          required: false,
          gridDefination: {
            xs: 12,
            sm: 8
          },
          pattern: getPattern("Amount"),
          jsonPath: "paymentWorkflows[0].additionalPenalty",
          disabled: true
        })
      }
    )
  }
);
export const viewReceiptDetailsCard = getCommonCard(
  {

    receiptDetails: receiptSummary,

  });

