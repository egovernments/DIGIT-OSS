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
import { serviceConst } from "../../../../../ui-utils/commons";
import cloneDeep from "lodash/cloneDeep";
import { createEstimateData } from "../../utils";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const tenantId = getQueryArg(window.location.href, "tenantId");

const getEstimateDataAfterAdhoc = async (state, dispatch) => {
  const WSRequestBody = cloneDeep(
    get(state.screenConfiguration.preparedFinalObject, "WaterConnection")
  );

  // to parse penalty and rebate amount
  if (WSRequestBody[0].additionalDetails !== undefined && WSRequestBody[0].additionalDetails.length !== 0) {
    if (WSRequestBody[0].additionalDetails.hasOwnProperty('adhocPenalty') === true) {
      WSRequestBody[0].additionalDetails.adhocPenalty = parseFloat(WSRequestBody[0].additionalDetails.adhocPenalty);
    }

    if (WSRequestBody[0].additionalDetails.hasOwnProperty('adhocRebate') === true) {
      WSRequestBody[0].additionalDetails.adhocRebate = parseFloat(WSRequestBody[0].additionalDetails.adhocRebate);
    }
  }
  const demandId = get(
      state.screenConfiguration.preparedFinalObject,
      "viewBillToolipData[0].description.demandId"
    );

  const consumerCode = getQueryArg(window.location.href, "connectionNumber") || WSRequestBody[0].connectionNo;
  let serviceUrl,httpmethod;
  if (WSRequestBody[0].service === serviceConst.WATER) {
    serviceUrl = "ws-calculator/waterCalculator/_applyAdhocTax";
    httpmethod = "post";
  } else {
    serviceUrl = "sw-calculator/sewerageCalculator/_applyAdhocTax"
    httpmethod = "get";
  }
try{
  const WSpayload = await httpRequest(
    "post",
    serviceUrl,
    "",
    [],
    {
      "demandId":demandId,
      "adhocrebate" : (WSRequestBody[0].additionalDetails.adhocRebate)?WSRequestBody[0].additionalDetails.adhocRebate:0,
      "adhocpenalty" : (WSRequestBody[0].additionalDetails.adhocPenalty)?WSRequestBody[0].additionalDetails.adhocPenalty:0,
      "consumerCode": consumerCode,
      "businessService": "WS"
    }
  );

  if(WSpayload){
    showHideAdhocPopup(state, dispatch, "viewBill");
    window.location.reload();
  }else {
      dispatch(
        toggleSnackbar(
          true, {
          labelKey: "PT_COMMON_ADD_REBATE_PENALITY",
          labelName: "Failed to add rebate and penality"
        },
          "warning"
        )
      )
    }
} catch (e) {
  dispatch(
        toggleSnackbar(
          true, {
          labelKey: "PT_COMMON_ADD_REBATE_PENALITY",
          labelName: "Failed to add rebate and penality"
        },
          "warning"
        )
      )  
}

  

};

const updateAdhoc = (state, dispatch) => {
  const adhocAmount = get(
    state.screenConfiguration.preparedFinalObject,
    "WaterConnection[0].additionalDetails.adhocPenalty"
  );
  const rebateAmount = get(
    state.screenConfiguration.preparedFinalObject,
    "WaterConnection[0].additionalDetails.adhocRebate"
  );
  if (adhocAmount || rebateAmount) {
    const totalAmount = get(
      state.screenConfiguration.preparedFinalObject,
      "billData.totalAmount"
    );
    
    if (parseFloat(rebateAmount) && parseFloat(rebateAmount) >= parseFloat(totalAmount)) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelKey: "ERR_WS_REBATE_GREATER_THAN_FEE_AMOUNT"
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
          labelKey: "ERR_WS_ENTER_ATLEAST_ONE_FIELD"
        },
        "warning"
      )
    );
  }
};

export const adhocPopupViewBill = getCommonContainer({
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
              labelKey: "WS_ADD_HOC_CHARGES_POPUP_HEAD"
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
              callBack: (state, dispatch) => {
                showHideAdhocPopup(state, dispatch, "viewBill");
              }
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
          labelKey: "WS_ADD_HOC_CHARGES_POPUP_SUB_FIRST"
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
            labelKey: "WS_ADD_HOC_CHARGES_POPUP_PEN_AMT_LABEL"
          },
          placeholder: {
            labelKey: "WS_ADD_HOC_CHARGES_POPUP_PEN_AMT_PLACEHOLDER"
          },
          props: {
            style: {
              width: "90%"
            },
            type: "number"
          },
          jsonPath: "WaterConnection[0].additionalDetails.adhocPenalty",
        }),
        penaltyReason: getSelectField({
          label: {
            labelKey: "WS_PAYMENT_PENALTY_REASON"
          },
          placeholder: {
            labelKey: "WS_PAYMENT_PENALTY_REASON_SELECT"
          },
          props: {
            style: {
              width: "90%"
            }
          },
          data: [
            {
              code: "WS_ADHOC_PENDING_DUES"
            },
            {
              code: "WS_ADHOC_MISCALCULATION"
            },
            {
              code: "WS_ADHOC_ONE_TIME_PENALTY"
            },
            {
              code: "WS_ADHOC_OTHER"
            }
          ],
          jsonPath: "WaterConnection[0].additionalDetails.adhocPenaltyReason"
        })
      }),
      commentsField: getTextField({
        label: {
          labelKey: "WS_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
        },
        placeholder: {
          labelKey: "WS_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
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
        jsonPath: "WaterConnection[0].additionalDetails.adhocPenaltyComment"
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
          labelKey: "WS_ADD_HOC_CHARGES_POPUP_SUB_SEC"
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
            labelKey: "WS_ADD_HOC_CHARGES_POPUP_RBT_AMT_LABEL"
          },
          placeholder: {
            labelKey: "WS_ADD_HOC_CHARGES_POPUP_RBT_AMT_PLACEHOLDER"
          },
          props: {
            style: {
              width: "90%"
            },
            type: "number"
          },
          jsonPath: "WaterConnection[0].additionalDetails.adhocRebate",
        }),
        rebateReason: getSelectField({
          label: {
            labelKey: "WS_PAYMENT_REBATE_REASON"
          },
          placeholder: {
            labelKey: "WS_PAYMENT_REBATE_REASON_SELECT"
          },
          props: {
            style: {
              width: "90%"
            }
          },
          data: [
            {
              code: "WS_REBATE_ADVANCED_PAID"
            },
            {
              code: "WS_REBATE_BY_COMMISSIONER"
            },
            {
              code: "WS_REBATE_ADDITIONAL_AMOUNT_CHARGED"
            },
            {
              code: "WS_ADHOC_OTHER"
            }
          ],
          jsonPath: "WaterConnection[0].additionalDetails.adhocRebateReason"
        }),
        rebateCommentsField: getTextField({
          label: {
            labelKey: "WS_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
          },
          placeholder: {
            labelKey: "WS_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
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
          jsonPath: "WaterConnection[0].additionalDetails.adhocRebateComment"
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
        textAlign: "center"
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
            margin: "8px"
          }
        },
        children: {
          previousButtonLabel: getLabel({
            labelKey: "WS_ADD_HOC_CHARGES_POPUP_BUTTON_CANCEL"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            showHideAdhocPopup(state, dispatch, "viewBill");
          }
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
            labelKey: "WS_ADD_HOC_CHARGES_POPUP_BUTTON_ADD"
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
