import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import { generateBill, getBusinessServiceMdmsData, getCurrentFinancialYear } from "../utils";
import "./pay.css";
import AmountToBePaid from "./payResource/amount-to-be-paid";
import arrearsCard from "./payResource/arrears-details";
import capturePayerDetails from "./payResource/capture-payer-details";
import capturePaymentDetails from "./payResource/capture-payment-details";
import { paybuttonJsonpath, radioButtonJsonPath } from "./payResource/constants";
import estimateDetails from "./payResource/estimate-details";
import { footer } from "./payResource/footer";
import g8Details from "./payResource/g8-details";

export const getHeader = (state) => {
    const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject, "commonPayInfo");
    let consumerCode = getQueryArg(window.location.href, "consumerCode");
    let businessService = getQueryArg(window.location.href, "businessService");
    let label = get(uiCommonPayConfig, "headerBandLabel");
    return getCommonContainer({
        header: getCommonHeader({
            labelName: `Payment (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
            labelKey: "COMMON_PAY_SCREEN_HEADER"
        }),
        consumerCode: {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-common",
            componentPath: "ApplicationNoContainer",
            props: {
                number: consumerCode,
                label: {
                    labelKey: label ? label : "PAYMENT_COMMON_CONSUMER_CODE",
                },
            }
        }
    });
}


const fetchBill = async (action, state, dispatch, consumerCode, tenantId, billBusinessService) => {
    await getBusinessServiceMdmsData(dispatch, tenantId);

    await generateBill(dispatch, consumerCode, tenantId, billBusinessService);

    let payload = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0]");
    let totalAmount = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0]");

    //Collection Type Added in CS v1.1
    payload && dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].billDetails[0].collectionType", "COUNTER"));
    const businessService = get(
        state,
        "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].businessService"
    );
    const businessServiceArray = get(state, "screenConfiguration.preparedFinalObject.businessServiceMdmsData.BillingService.BusinessService");
    businessServiceArray && businessServiceArray.map(item => {
        if (item.code == businessService) {
            dispatch(prepareFinalObject("businessServiceInfo", item));
        }
    })

    //commonPay configuration 
    const commonPayDetails = get(state, "screenConfiguration.preparedFinalObject.businessServiceMdmsData.common-masters.uiCommonPay");
    const index = commonPayDetails && commonPayDetails.findIndex((item) => {
        return item.code == businessService;
    });
    if (index > -1) {
        dispatch(prepareFinalObject("commonPayInfo", commonPayDetails[index]));
        dispatch(prepareFinalObject("isArrears", get(commonPayDetails[index], "arrears", true)));


    } else {
        const details = commonPayDetails && commonPayDetails.filter(item => item.code === "DEFAULT");
        dispatch(prepareFinalObject("commonPayInfo", details));
        dispatch(prepareFinalObject("isArrears", get(details && details[0], "arrears", true)));
    }

    if (get(commonPayDetails[index], "arrears", true)) {
        dispatch(handleField("pay", "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.arrearsCard", "visible", true));
    } else {
        dispatch(handleField("pay", "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.arrearsCard", "visible", false));
    }
    let header = getHeader(state);
    set(action.screenConfig, "components.div.children.headerDiv.children.header", header)


    const isPartialPaymentAllowed = get(state, "screenConfiguration.preparedFinalObject.businessServiceInfo.partPaymentAllowed");
    if (isPartialPaymentAllowed) {
        dispatch(handleField("pay", "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.AmountToBePaid", "visible", true));
    }
    if (get(payload, "amount") != undefined) {
        //set amount paid as total amount from bill - destination changed in CS v1.1
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].taxAndPayments[0].amountPaid", payload.amount));
        //set total amount in instrument
        dispatch(prepareFinalObject("ReceiptTemp[0].instrument.amount", payload.amount));
    }

    if (get(totalAmount, "totalAmount") != undefined) {
        const componentJsonpath = "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.AmountToBePaid.children.cardContent.children.amountDetailsCardContainer.children.displayAmount";
        dispatch(handleField("pay", componentJsonpath, "props.value", totalAmount.totalAmount));
        const isAdvancePaymentAllowed = get(state, "screenConfiguration.preparedFinalObject.businessServiceInfo.isAdvanceAllowed");
        if ((totalAmount.totalAmount === 0 || totalAmount.totalAmount <= 100) && !isAdvancePaymentAllowed) {
            dispatch(handleField("pay", radioButtonJsonPath, "props.buttons[1].disabled", true));
        }
    }

    if (get(totalAmount, "totalAmount") === undefined) {
        const buttonJsonpath = paybuttonJsonpath + `${process.env.REACT_APP_NAME === "Citizen" ? "makePayment" : "generateReceipt"}`;
        dispatch(handleField("pay", buttonJsonpath, "props.disabled", true));
        dispatch(handleField("pay", radioButtonJsonPath, "props.buttons[1].disabled", true));
    }

    const consumeCodeComponentPath = 'components.div.children.headerDiv.children.header.children.consumerCode';
    const consumerCodeFromResponse = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].consumerCode");;
    dispatch(handleField("pay", consumeCodeComponentPath, "props.number", consumerCodeFromResponse));

    const raidButtonComponentPath = "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.AmountToBePaid.children.cardContent.children.amountDetailsCardContainer.children.AmountToPaidButton";
    dispatch(handleField("pay", raidButtonComponentPath, "props.value", "full_amount"));

    /* To disable the payer name and mobile number incase the user is not owner 
        and autofill the owner or paidby others deatils in case of payment through whatsapp */

    let payerName = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].payerName");
    let paidBy = "COMMON_OWNER";
    let payerNumber = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].mobileNumber");
    if (process.env.REACT_APP_NAME === "Citizen" && getQueryArg(window.location.href, "mobileNumber") && getQueryArg(window.location.href, "name")) {
        if (payerNumber != getQueryArg(window.location.href, "mobileNumber")) {
            payerName = getQueryArg(window.location.href, "name");
            paidBy = "COMMON_OTHER";
            payerNumber = getQueryArg(window.location.href, "mobileNumber");
        }
    }
    if (paidBy != "COMMON_OTHER") {
        dispatch(
            handleField(
                "pay",
                "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.capturePayerDetails.children.cardContent.children.payerDetailsCardContainer.children.payerName",
                "props.disabled",
                true
            )
        );
        dispatch(
            handleField(
                "pay",
                "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.capturePayerDetails.children.cardContent.children.payerDetailsCardContainer.children.payerMobileNo",
                "props.disabled",
                true
            )
        );
    }
    dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].payer", paidBy));
    dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].paidBy", payerName));
    dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].payerMobileNumber", payerNumber));
    dispatch(handleField("pay", `components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.capturePaymentDetails.children.cardContent.children.tabSection.props.tabs[0].tabContent.cash.children.payeeDetails.children.payerName`,
        "props.value", payerName));
    dispatch(handleField("pay", `components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.capturePaymentDetails.children.cardContent.children.tabSection.props.tabs[0].tabContent.cash.children.payeeDetails.children.payerMobileNo`,
        "props.value", payerNumber));

    //Initially select instrument type as Cash
    dispatch(prepareFinalObject("ReceiptTemp[0].instrument.instrumentType.name", "Cash"));

    //set tenantId
    dispatch(prepareFinalObject("ReceiptTemp[0].tenantId", tenantId));

    //set tenantId in instrument
    dispatch(prepareFinalObject("ReceiptTemp[0].instrument.tenantId", tenantId));

    // Handling Negative amount
    if (get(totalAmount, "totalAmount") != undefined) {
        const componentJsonpath = "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.AmountToBePaid.children.cardContent.children.amountDetailsCardContainer.children.displayAmount";
        if (totalAmount.totalAmount < 0) {
            dispatch(handleField("pay", radioButtonJsonPath, "props.buttons[0].disabled", true));
            dispatch(handleField("pay", componentJsonpath, "props.value", 0));
            dispatch(handleField("pay", raidButtonComponentPath, "props.value", "partial_amount"));
        }
    }
};


const screenConfig = {
    uiFramework: "material-ui",
    name: "pay",
    beforeInitScreen: (action, state, dispatch) => {
        dispatch(unMountScreen("acknowledgement"));
        let consumerCode = getQueryArg(window.location.href, "consumerCode");
        let tenantId = getQueryArg(window.location.href, "tenantId");
        let businessService = getQueryArg(window.location.href, "businessService");
        fetchBill(action, state, dispatch, consumerCode, tenantId, businessService);
        localStorage.setItem('pay-businessService', businessService);
        let channel = getQueryArg(window.location.href, "channel");
        let redirectNumber = getQueryArg(window.location.href, "redirectNumber");
        if (channel) {
            localStorage.setItem('pay-channel', channel);
            redirectNumber = !redirectNumber.includes('+91') && redirectNumber.length == 10 ? `+91${redirectNumber}` : redirectNumber
            localStorage.setItem('pay-redirectNumber', redirectNumber);
        } else {
            localStorage.setItem('pay-channel', "");
            localStorage.setItem('pay-redirectNumber', '');
        }
        // fetchBill(action,state, dispatch, consumerCode, tenantId, businessService).then(
        //     response => {
        //         let header = getHeader(state);
        //         set(action, "screenConfig.components.div.children.headerDiv.children.header" ,header) 
        //     }
        // );
        // const data = getPaymentCard(state);    
        // set(action, "screenConfig.components.div.children.formwizardFirstStep", data);
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
                        // header : {}
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
                            estimateDetails,
                            arrearsCard: {
                                ...arrearsCard,
                                visible: false
                            },
                            AmountToBePaid: {
                                ...AmountToBePaid,
                                visible: false
                            },
                            capturePaymentDetails: process.env.REACT_APP_NAME === "Citizen" ? { } : capturePaymentDetails,
                            capturePayerDetails: process.env.REACT_APP_NAME === "Citizen" ? capturePayerDetails : { },
                            g8Details: process.env.REACT_APP_NAME === "Citizen" ? { } : g8Details
                        })
                    }
                },
                footer
            }
        },
    }
};

export default screenConfig;
