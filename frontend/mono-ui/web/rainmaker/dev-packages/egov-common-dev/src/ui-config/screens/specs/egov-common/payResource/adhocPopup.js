import {
  getCommonHeader,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonSubHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { showHideAdhocPopup, getBill } from "../../utils";
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
  const NOCRequestBody = cloneDeep(
    get(state.screenConfiguration.preparedFinalObject, "FireNOCs")
  );
  set(NOCRequestBody[0], "fireNOCDetails.action", "ADHOC");

  try {
    const NOCpayload = await httpRequest(
      "post",
      "/firenoc-services/v1/_update",
      "",
      [],
      { FireNOCs: NOCRequestBody }
    );

    const applicationNumber = get(
      NOCpayload,
      "FireNOCs[0].fireNOCDetails.applicationNumber"
    );
    const tenantId = get(NOCpayload, "FireNOCs[0].tenantId");

    if (applicationNumber && tenantId) {
      const queryObj = [
        {
          key: "tenantId",
          value: tenantId
        },
        {
          key: "applicationNumber",
          value: applicationNumber
        }
      ];
      const billPayload = await getBill(queryObj,dispatch);
      // let payload = sampleGetBill();
      if (billPayload && billPayload.Bill[0]) {
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill", billPayload.Bill));
        const estimateData = createEstimateData(billPayload.Bill[0]);
        estimateData &&
          estimateData.length &&
          dispatch(
            prepareFinalObject(
              "applyScreenMdmsData.estimateCardData",
              estimateData
            )
          );
      }

      //get deep copy of bill in redux - merge new bill after adhoc
      const billInRedux = cloneDeep(
        get(
          state.screenConfiguration.preparedFinalObject,
          "ReceiptTemp[0].Bill[0]"
        )
      );
      const mergedBillObj = {
        ...billInRedux,
        ...billPayload.Bill[0]
      };

      //merge bill in Receipt obj
      billPayload &&
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0]", mergedBillObj));

      //set amount paid as total amount from bill
      billPayload &&
        dispatch(
          prepareFinalObject(
            "ReceiptTemp[0].Bill[0].billDetails[0].amountPaid",
            billPayload.Bill[0].billDetails[0].totalAmount
          )
        );

      //set total amount in instrument
      billPayload &&
        dispatch(
          prepareFinalObject(
            "ReceiptTemp[0].instrument.amount",
            billPayload.Bill[0].billDetails[0].totalAmount
          )
        );

      //Collection Type Added in CS v1.1
      const collectionType = get(
        billPayload,
        "Bill[0].billDetails[0].totalAmount"
      );
      const totalAmount = get(
        billPayload,
        "Bill[0].billDetails[0].totalAmount"
      );
      collectionType &&
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

      showHideAdhocPopup(state, dispatch, "pay");
    }
  } catch (e) {
    console.log(e);
  }
};

const updateAdhoc = (state, dispatch) => {
  const penaltyAmount = get(
    state.screenConfiguration.preparedFinalObject,
    "FireNOCs[0].fireNOCDetails.additionalDetail.adhocPenalty"
  );
  const rebateAmount = get(
    state.screenConfiguration.preparedFinalObject,
    "FireNOCs[0].fireNOCDetails.additionalDetail.adhocRebate"
  );
  if (penaltyAmount || rebateAmount) {
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
              labelKey: "NOC_ADD_HOC_CHARGES_POPUP_HEAD"
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
              callBack: (state, dispatch) =>
                showHideAdhocPopup(state, dispatch, "pay")
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
          labelKey: "NOC_ADD_HOC_CHARGES_POPUP_SUB_FIRST"
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
            labelKey: "NOC_ADD_HOC_CHARGES_POPUP_PEN_AMT_LABEL"
          },
          placeholder: {
            labelName: "Enter Adhoc Charge Amount",
            labelKey: "NOC_ADD_HOC_CHARGES_POPUP_PEN_AMT_PLACEHOLDER"
          },
          props: {
            style: {
              width: "90%"
            }
          },
          jsonPath: "FireNOCs[0].fireNOCDetails.additionalDetail.adhocPenalty"
        }),
        penaltyReason: getSelectField({
          label: {
            labelName: "Reason for Adhoc Penalty",
            labelKey: "NOC_PAYMENT_PENALTY_REASON"
          },
          placeholder: {
            labelName: "Select reason for Adhoc Penalty",
            labelKey: "NOC_PAYMENT_PENALTY_REASON_SELECT"
          },
          props: {
            style: {
              width: "90%"
            }
          },
          data: [
            {
              code: "NOC_ADHOC_PENDING_DUES"
            },
            {
              code: "NOC_ADHOC_MISCALCULATION"
            },
            {
              code: "NOC_ADHOC_ONE_TIME_PENALTY"
            },
            {
              code: "NOC_ADHOC_OTHER"
            }
          ],
          jsonPath:
            "FireNOCs[0].fireNOCDetails.additionalDetail.adhocPenaltyReason"
        })
      }),
      commentsField: getTextField({
        label: {
          labelName: "Enter Comments",
          labelKey: "NOC_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
        },
        placeholder: {
          labelName: "Enter Comments",
          labelKey: "NOC_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
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
        jsonPath: "FireNOCs[0].fireNOCDetails.additionalDetail.penaltyComments"
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
          labelKey: "NOC_ADD_HOC_CHARGES_POPUP_SUB_SEC"
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
            labelKey: "NOC_ADD_HOC_CHARGES_POPUP_RBT_AMT_LABEL"
          },
          placeholder: {
            labelName: "Enter Adhoc Rebate Amount",
            labelKey: "NOC_ADD_HOC_CHARGES_POPUP_RBT_AMT_PLACEHOLDER"
          },
          props: {
            style: {
              width: "90%"
            }
          },
          jsonPath: "FireNOCs[0].fireNOCDetails.additionalDetail.adhocRebate"
        }),
        rebateReason: getSelectField({
          label: {
            labelName: "Reason for Adhoc Rebate",
            labelKey: "NOC_PAYMENT_REBATE_REASON"
          },
          placeholder: {
            labelName: "Select Reason for Adhoc Rebate",
            labelKey: "NOC_PAYMENT_REBATE_REASON_SELECT"
          },
          props: {
            style: {
              width: "90%"
            }
          },
          data: [
            {
              code: "NOC_REBATE_ADVANCED_PAID"
            },
            {
              code: "NOC_REBATE_BY_COMMISSIONER"
            },
            {
              code: "NOC_REBATE_ADDITIONAL_AMOUNT_CAHNGED"
            },
            {
              code: "NOC_ADHOC_OTHER"
            }
          ],
          jsonPath:
            "FireNOCs[0].fireNOCDetails.additionalDetail.adhocRebateReason"
        }),
        rebateCommentsField: getTextField({
          label: {
            labelName: "Enter Comments",
            labelKey: "NOC_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
          },
          placeholder: {
            labelName: "Enter Comments",
            labelKey: "NOC_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
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
          jsonPath: "FireNOCs[0].fireNOCDetails.additionalDetail.rebateComments"
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
            labelKey: "NOC_ADD_HOC_CHARGES_POPUP_BUTTON_CANCEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) =>
            showHideAdhocPopup(state, dispatch, "pay")
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
            labelKey: "NOC_ADD_HOC_CHARGES_POPUP_BUTTON_ADD"
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
