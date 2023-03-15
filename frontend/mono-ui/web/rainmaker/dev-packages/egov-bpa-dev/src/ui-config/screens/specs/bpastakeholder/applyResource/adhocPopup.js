import {
  getCommonHeader,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonSubHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { showHideAdhocPopup } from "../../utils";
import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils/api";
import cloneDeep from "lodash/cloneDeep";
import { createEstimateData } from "../../utils";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";

const getEstimateDataAfterAdhoc = async (state, dispatch) => {
  const TLRequestBody = cloneDeep(
    get(state.screenConfiguration.preparedFinalObject, "Licenses")
  );
  set(TLRequestBody[0], "action", "ADHOC");
  const TLpayload = await httpRequest(
    "post",
    "/tl-services/v1/BPAREG/_update",
    "",
    [],
    { Licenses: TLRequestBody }
  );

  // clear data from form

  const billPayload = await createEstimateData(
    TLpayload.Licenses[0],
    "LicensesTemp[0].estimateCardData",
    dispatch,
    window.location.href
  );

  //get deep copy of bill in redux - merge new bill after adhoc
  const billInRedux = cloneDeep(
    get(state.screenConfiguration.preparedFinalObject, "ReceiptTemp[0].Bill[0]")
  );
  const mergedBillObj = { ...billInRedux, ...billPayload.billResponse.Bill[0] };

  //merge bill in Receipt obj
  billPayload &&
    dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0]", mergedBillObj));

  //set amount paid as total amount from bill
  billPayload &&
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].Bill[0].billDetails[0].amountPaid",
        billPayload.billResponse.Bill[0].billDetails[0].totalAmount
      )
    );

  //set total amount in instrument
  billPayload &&
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].instrument.amount",
        billPayload.billResponse.Bill[0].billDetails[0].totalAmount
      )
    );

  //Collection Type Added in CS v1.1
  const totalAmount = get(
    billPayload,
    "billResponse.Bill[0].billDetails[0].totalAmount"
  );
  dispatch(
    prepareFinalObject(
      "ReceiptTemp[0].Bill[0].billDetails[0].collectionType",
      "COUNTER"
    )
  );
  if (totalAmount) {
    //set amount paid as total amount from bill - destination changed in CS v1.1
    dispatch(
      prepareFinalObject(
        "ReceiptTemp[0].Bill[0].taxAndPayments[0].amountPaid",
        totalAmount
      )
    );
  }

  showHideAdhocPopup(state, dispatch);
};

const updateAdhoc = (state, dispatch) => {
  const adhocAmount = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.adhocPenalty"
  );
  const rebateAmount = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].tradeLicenseDetail.adhocExemption"
  );
  if (adhocAmount || rebateAmount) {
    const totalAmount = get(
      state.screenConfiguration.preparedFinalObject,
      "ReceiptTemp[0].Bill[0].billDetails[0].totalAmount"
    );
    if (rebateAmount && rebateAmount > totalAmount) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Rebate should be less than or equal to total amount!",
            labelKey: "ERR_REBATE_GREATER_THAN_AMOUNT"
          },
          "warning"
        )
      );
    } else {
      getEstimateDataAfterAdhoc(state, dispatch);
    }
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Enter at least one field",
          labelKey: "ERR_ENTER_ATLEAST_ONE_FIELD"
        },
        "warning"
      )
    );
  }
};

export const adhocPopup = getCommonContainer({
  // header: getCommonHeader({
  //   labelName: "Add Adhoc Penalty/Rebate",
  //   labelKey: "TL_ADD_HOC_CHARGES_POPUP_HEAD"
  // }),
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Add Adhoc Penalty/Rebate",
              labelKey: "TL_ADD_HOC_CHARGES_POPUP_HEAD"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: showHideAdhocPopup
            }
          }
        }
      }
    }
  },
  adhocPenaltyCard: getCommonContainer(
    {
      subheader: getCommonSubHeader(
        {
          labelName: "Adhoc Penalty",
          labelKey: "TL_ADD_HOC_CHARGES_POPUP_SUB_FIRST"
        },
        {
          style: {
            fontSize: "16px"
          }
        }
      ),
      penaltyAmountAndReasonContainer: getCommonContainer({
        penaltyAmount: getTextField({
          label: {
            labelName: "Adhoc Penalty Amount",
            labelKey: "TL_ADD_HOC_CHARGES_POPUP_PEN_AMT_LABEL"
          },
          placeholder: {
            labelName: "Enter Adhoc Charge Amount",
            labelKey: "TL_ADD_HOC_CHARGES_POPUP_PEN_AMT_PLACEHOLDER"
          },
          props: {
            style: {
              width: "90%"
            }
          },
          jsonPath: "Licenses[0].tradeLicenseDetail.adhocPenalty"
        }),
        penaltyReason: getSelectField({
          label: {
            labelName: "Reason for Adhoc Penalty",
            labelKey: "TL_PAYMENT_PENALTY_REASON"
          },
          placeholder: {
            labelName: "Select reason for Adhoc Penalty",
            labelKey: "TL_PAYMENT_PENALTY_REASON_SELECT"
          },
          props: {
            style: {
              width: "90%"
            }
          },
          data: [
            {
              code: "TL_ADHOC_PENDING_DUES"
            },
            {
              code: "TL_ADHOC_MISCALCULATION"
            },
            {
              code: "TL_ADHOC_ONE_TIME_PENALTY"
            },
            {
              code: "TL_ADHOC_OTHER"
            }
          ],
          jsonPath: "Licenses[0].tradeLicenseDetail.adhocPenaltyReason"
        })
      }),
      commentsField: getTextField({
        label: {
          labelName: "Enter Comments",
          labelKey: "TL_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
        },
        placeholder: {
          labelName: "Enter Comments",
          labelKey: "TL_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
        },
        gridDefination: {
          xs: 12,
          sm: 12
        },
        props: {
          style: {
            width: "90%"
          }
        },
        jsonPath: "Licenses[0].tradeLicenseDetail.penaltyComments"
      })
    },
    {
      style: {
        marginTop: "12px"
      }
    }
  ),
  adhocRebateCard: getCommonContainer(
    {
      subHeader: getCommonSubHeader(
        {
          labelName: "Adhoc Rebate",
          labelKey: "TL_ADD_HOC_CHARGES_POPUP_SUB_SEC"
        },
        {
          style: {
            fontSize: "16px"
          }
        }
      ),
      rebateAmountAndReasonContainer: getCommonContainer({
        rebateAmount: getTextField({
          label: {
            labelName: "Adhoc Rebate Amount",
            labelKey: "TL_ADD_HOC_CHARGES_POPUP_RBT_AMT_LABEL"
          },
          placeholder: {
            labelName: "Enter Adhoc Rebate Amount",
            labelKey: "TL_ADD_HOC_CHARGES_POPUP_RBT_AMT_PLACEHOLDER"
          },
          props: {
            style: {
              width: "90%"
            }
          },
          jsonPath: "Licenses[0].tradeLicenseDetail.adhocExemption"
        }),
        rebateReason: getSelectField({
          label: {
            labelName: "Reason for Adhoc Rebate",
            labelKey: "TL_PAYMENT_REBATE_REASON"
          },
          placeholder: {
            labelName: "Select Reason for Adhoc Rebate",
            labelKey: "TL_PAYMENT_REBATE_REASON_SELECT"
          },
          props: {
            style: {
              width: "90%"
            }
          },
          data: [
            {
              code: "TL_REBATE_ADVANCED_PAID"
            },
            {
              code: "TL_REBATE_BY_COMMISSIONER"
            },
            {
              code: "TL_REBATE_ADDITIONAL_AMOUNT_CAHNGED"
            },
            {
              code: "TL_ADHOC_OTHER"
            }
          ],
          jsonPath: "Licenses[0].tradeLicenseDetail.adhocExemptionReason"
        }),
        rebateCommentsField: getTextField({
          label: {
            labelName: "Enter Comments",
            labelKey: "TL_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
          },
          placeholder: {
            labelName: "Enter Comments",
            labelKey: "TL_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
          },
          gridDefination: {
            xs: 12,
            sm: 12
          },
          props: {
            style: {
              width: "90%"
            }
          },
          jsonPath: "Licenses[0].tradeLicenseDetail.rebateComments"
        })
      })
    },
    {
      style: {
        marginTop: "24px"
      }
    }
  ),
  div: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        width: "100%",
        textAlign: "right"
      }
    },
    children: {
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "outlined",
          color: "primary",
          style: {
            width: "140px",
            height: "48px",
            marginRight: "16px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "TL_ADD_HOC_CHARGES_POPUP_BUTTON_CANCEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: showHideAdhocPopup
        }
      },
      addButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            width: "140px",
            height: "48px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelName: "ADD",
            labelKey: "TL_ADD_HOC_CHARGES_POPUP_BUTTON_ADD"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: updateAdhoc
        }
      }
    }
  }
});
