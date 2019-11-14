import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { getCurrentFinancialYear, generateBill } from "../utils";
import capturePaymentDetails from "./payResource/capture-payment-details";
import estimateDetails from "./payResource/estimate-details";
import { footer } from "./payResource/footer";
import g8Details from "./payResource/g8-details";
import AmountToBePaid from "./payResource/amount-to-be-paid";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { ifUserRoleExists } from "../utils";
import set from "lodash/set";
import { componentJsonpath, radioButtonJsonPath, paybuttonJsonpath } from "./payResource/constants";

const header =()=>getCommonContainer({
      header: getCommonHeader({
          labelName: `Payment (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
          labelKey: "COMMON_PAY_SCREEN_HEADER"
      }),
      consumerCode: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-common",
          componentPath: "ApplicationNoContainer",
          props: {
              number: '',
              label: {
                  labelValue:"Consumer Code.:",
                  labelKey:"PAYMENT_COMMON_CONSUMER_CODE"
              }
          }
      }
  });


const getPaymentCard = () => {

    const roleExists = ifUserRoleExists("CITIZEN");

    if (roleExists) {
        return {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            children: {
                paymentDetails: getCommonCard({
                    header: getCommonTitle({
                        labelName: "Payment Collection Details",
                        labelKey: "NOC_PAYMENT_HEAD"
                    }),
                    estimateDetails,
                    AmountToBePaid
                })
            }
        }
    } else {
        return {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            children: {
                paymentDetails: getCommonCard({
                    header: getCommonTitle({
                        labelName: "Payment Collection Details",
                        labelKey: "NOC_PAYMENT_HEAD"
                    }),
                    estimateDetails,
                    AmountToBePaid,
                    capturePaymentDetails,
                    g8Details
                    // addPenaltyRebateButton: {
                    //   componentPath: "Button",
                    //   props: {
                    //     color: "primary",
                    //     style: {}
                    //   },
                    //   children: {
                    //     previousButtonLabel: getLabel({
                    //       labelName: "ADD REBATE/PENALTY",
                    //       labelKey: "NOC_PAYMENT_ADD_RBT_PEN"
                    //     })
                    //   },
                    //   onClickDefination: {
                    //     action: "condition",
                    //     callBack: (state, dispatch) => showHideAdhocPopup(state, dispatch, "pay")
                    //   }
                    // },
                    // viewBreakupButton: getDialogButton(
                    //   "VIEW BREAKUP",
                    //   "TL_PAYMENT_VIEW_BREAKUP",
                    //   "pay"
                    // ),
                })
            }
        }
    }
}



const fetchBill = async (state, dispatch, consumerCode, tenantId) => {
    await generateBill(dispatch, consumerCode, tenantId);

    let payload = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0]");

    let totalAmount = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0]");

    //Collection Type Added in CS v1.1
    payload && dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].billDetails[0].collectionType", "COUNTER"));

    if (get(payload, "amount") != undefined) {
        //set amount paid as total amount from bill - destination changed in CS v1.1
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].taxAndPayments[0].amountPaid", payload.amount));
        //set total amount in instrument
        dispatch(prepareFinalObject("ReceiptTemp[0].instrument.amount", payload.amount));
    }

    if (get(totalAmount, "totalAmount") != undefined) {
        dispatch(handleField("pay", componentJsonpath, "props.value", totalAmount.totalAmount));
        if (totalAmount.totalAmount === 0 || totalAmount.totalAmount <= 100) {
            dispatch(handleField("pay", radioButtonJsonPath, "props.buttons[1].disabled", true));
        }
    }

    if (get(totalAmount, "totalAmount") === undefined) {
        const buttonJsonpath = paybuttonJsonpath + `${process.env.REACT_APP_NAME === "Citizen" ? "makePayment" : "generateReceipt" }`;
        dispatch(handleField("pay", buttonJsonpath, "props.disabled", true));
        dispatch(handleField("pay", radioButtonJsonPath, "props.buttons[1].disabled", true));
    }

    const consumeCodeComponentPath='components.div.children.headerDiv.children.header.children.consumerCode';
    const consumerCodeFromResponse=get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].consumerCode");;
    dispatch(handleField("pay", consumeCodeComponentPath, "props.number",consumerCodeFromResponse ));

    const raidButtonComponentPath="components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.AmountToBePaid.children.cardContent.children.amountDetailsCardContainer.children.AmountToPaidButton";
    dispatch(handleField("pay", raidButtonComponentPath, "props.value","full_amount" ));

    // dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].payer", "Owner"));
    // const payerComponentPath="components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.capturePaymentDetails.children.cardContent.children.tabSection.props.tabs[0].tabContent.card.children.payeeDetails.children.payer";
    // dispatch(handleField("pay", payerComponentPath, "props.value","" ));
    //
    // const paidByComponentPath="components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.capturePaymentDetails.children.cardContent.children.tabSection.props.tabs[0].tabContent.card.children.payeeDetails.children.paidBy";
    // dispatch(handleField("pay", paidByComponentPath, "props.value","" ));
    //
    // const numberComponentPath="components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.capturePaymentDetails.children.cardContent.children.tabSection.props.tabs[0].tabContent.card.children.payeeDetails.children.payerMobileNumber";
    // dispatch(handleField("pay", numberComponentPath, "props.value","" ));


    //Initially select instrument type as Cash
    dispatch(prepareFinalObject("ReceiptTemp[0].instrument.instrumentType.name", "Cash"));

    //set tenantId
    dispatch(prepareFinalObject("ReceiptTemp[0].tenantId", tenantId));

    //set tenantId in instrument
    dispatch(prepareFinalObject("ReceiptTemp[0].instrument.tenantId", tenantId));
};


const screenConfig = {
    uiFramework: "material-ui",
    name: "pay",
    beforeInitScreen: (action, state, dispatch) => {
        let consumerCode = getQueryArg(window.location.href, "consumerCode");
        let tenantId = getQueryArg(window.location.href, "tenantId");
        // let businessService = getQueryArg(window.location.href, "businessService");
        fetchBill(state, dispatch, consumerCode, tenantId);
        const data = getPaymentCard();
        set(action, "screenConfig.components.div.children.formwizardFirstStep", data);
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
                            ...header()
                        }
                    }
                },
                formwizardFirstStep: {},
                footer
            }
        },
        // adhocDialog: {
        //   uiFramework: "custom-containers-local",
        //   moduleName: "egov-noc",
        //   componentPath: "DialogContainer",
        //   props: {
        //     open: false,
        //     maxWidth: "sm",
        //     screenKey: "pay"
        //   },
        //   children: {
        //     popup: adhocPopup
        //   }
        // }
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