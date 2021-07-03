import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getCommonTitle,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { getCurrentFinancialYear, generateBill, showHideAdhocPopup } from "../utils";
import { adhocPopup } from "./payResource/adhocPopup";
import capturePaymentDetails from "./payResource/capture-payment-details";
import estimateDetails from "./payResource/estimate-details";
import { footer } from "./payResource/footer";
import g8Details from "./payResource/g8-details";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for Fire NOC (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "NOC_COMMON_APPLY_NOC"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-firenoc",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  }
});

const fetchBill = async (state, dispatch, applicationNumber, tenantId) => {
  await generateBill(dispatch, applicationNumber, tenantId);

  let payload = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0]");

  //Collection Type Added in CS v1.1
  payload && dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].billDetails[0].collectionType", "COUNTER"));

  if (get(payload, "totalAmount") != undefined) {
    //set amount paid as total amount from bill - destination changed in CS v1.1
    dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].taxAndPayments[0].amountPaid", payload.totalAmount));
    //set total amount in instrument
    dispatch(prepareFinalObject("ReceiptTemp[0].instrument.amount", payload.totalAmount));
  }

  //Initially select instrument type as Cash
  dispatch(prepareFinalObject("ReceiptTemp[0].instrument.instrumentType.name", "Cash"));

  //set tenantId
  dispatch(prepareFinalObject("ReceiptTemp[0].tenantId", tenantId));

  //set tenantId in instrument
  dispatch(prepareFinalObject("ReceiptTemp[0].instrument.tenantId", tenantId));
};

const loadNocData = async (dispatch, applicationNumber, tenantId) => {
  const response = await getSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNumber", value: applicationNumber }
  ]);
  // const response = sampleSingleSearch();
  dispatch(prepareFinalObject("FireNOCs", get(response, "FireNOCs", [])));
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "pay",
  beforeInitScreen: (action, state, dispatch) => {
    let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    loadNocData(dispatch, applicationNumber, tenantId);
    fetchBill(state, dispatch, applicationNumber, tenantId);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "pay"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        formwizardFirstStep: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            paymentDetails: getCommonCard({
              header: getCommonTitle({
                labelName: "Payment Collection Details",
                labelKey: "NOC_PAYMENT_HEAD"
              }),
              // paragraph: getCommonParagraph({
              //   labelName: ""
              // }),
              estimateDetails,
              addPenaltyRebateButton: {
                componentPath: "Button",
                props: {
                  color: "primary",
                  style: {}
                },
                children: {
                  previousButtonLabel: getLabel({
                    labelName: "ADD REBATE/PENALTY",
                    labelKey: "NOC_PAYMENT_ADD_RBT_PEN"
                  })
                },
                onClickDefination: {
                  action: "condition",
                  callBack: (state, dispatch) => showHideAdhocPopup(state, dispatch, "pay")
                }
              },
              // viewBreakupButton: getDialogButton(
              //   "VIEW BREAKUP",
              //   "TL_PAYMENT_VIEW_BREAKUP",
              //   "pay"
              // ),
              capturePaymentDetails,
              g8Details
            })
          }
        },
        footer
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-firenoc",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "pay"
      },
      children: {
        popup: adhocPopup
      }
    }
    // breakUpDialog: {
    //   uiFramework: "custom-containers-local",
    //   moduleName: "egov-tradelicence",
    //   componentPath: "ViewBreakupContainer",
    //   props: {
    //     open: false,
    //     maxWidth: "md",
    //     screenKey: "pay"
    //   }
    // }
  }
};

export default screenConfig;
