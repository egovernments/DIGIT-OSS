import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getCurrentFinancialYear, generateBill, getBusinessServiceMdmsData } from "../utils";
import { capturePaymentDetails } from "./payResource/capture-payment-details";
import estimateDetails from "./payResource/estimate-details";
import { footer } from "./payResource/footer";
import g8Details from "./payResource/g8-details";
import AmountToBePaid from "./payResource/amount-to-be-paid";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { radioButtonJsonPath, paybuttonJsonpath } from "./payResource/constants";
import { ifUserRoleExists } from "../utils";
import set from "lodash/set";
import get from "lodash/get";
import "./pay.css";

export const getHeader = (state) => {
    const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject , "commonPayInfo");
    let consumerCode = getQueryArg(window.location.href, "consumerCode");

    let label = get(uiCommonPayConfig,"headerBandLabel");
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
                    labelKey: label,
                },
            }
        }
    });
}

const getPaymentCard = (state) => {
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
                    AmountToBePaid: {
                        ...AmountToBePaid,
                        visible: false
                    }
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
                    AmountToBePaid: {
                        ...AmountToBePaid,
                        visible: false
                    },
                    capturePaymentDetails : capturePaymentDetails(state),
                    g8Details
                })
            }
        }
    }
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
    const commonPayDetails = get(state , "screenConfiguration.preparedFinalObject.businessServiceMdmsData.common-masters.uiCommonPay");
    commonPayDetails && commonPayDetails.map(item => {
        if (item.code == businessService) {
            dispatch(prepareFinalObject("commonPayInfo", item));
        }
    })

    let header = getHeader(state);
    set(action, "screenConfig.components.div.children.headerDiv.children.header" ,header) 

    const data = getPaymentCard(state);    
    set(action, "screenConfig.components.div.children.formwizardFirstStep", data);

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
        if (totalAmount.totalAmount === 0 || totalAmount.totalAmount <= 100) {
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

    dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].payer", "COMMON_OWNER"));
    dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].paidBy", get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].payerName")));
    dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].payerMobileNumber", get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].mobileNumber")));

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
        let businessService = getQueryArg(window.location.href, "businessService");
        fetchBill(action ,state, dispatch, consumerCode, tenantId, businessService);
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
                // formwizardFirstStep: {},
                footer
            }
        },
    }
};

export default screenConfig;
