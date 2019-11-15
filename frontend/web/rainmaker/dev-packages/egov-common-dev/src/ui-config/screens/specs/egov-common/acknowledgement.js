import {
    getCommonHeader,
    getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { applicationSuccessFooter } from "./acknowledgementResource/applicationSuccessFooter";
import { paymentFailureFooter } from "./acknowledgementResource/paymentFailureFooter";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
// import { loadReceiptGenerationData } from "../utils/receiptTransformer";
import get from "lodash/get";
import set from "lodash/set";
import { ifUserRoleExists } from "../utils";

const getAcknowledgementCard = (
    state,
    dispatch,
    status,
    receiptNumber,
    consumerCode,
    tenant
) => {

    console.log(status);
    const roleExists = ifUserRoleExists("CITIZEN");
    if (status === "success") {
        return {
            header: getCommonContainer({
                header: getCommonHeader({
                    labelName: roleExists ? 'Payment Details' : 'Collection Details',
                    labelKey: roleExists ? "PAYMENT_HEADER_CITIZEN" : "PAYMENT_HEADER_EMPLOYEE"
                }),
                applicationNumber: {
                    uiFramework: "custom-atoms-local",
                    moduleName: "egov-common",
                    componentPath: "ApplicationNoContainer",
                    props: {
                        number: consumerCode,
                        label: {
                            labelValue:"Consumer Code.:",
                            labelKey:"PAYMENT_COMMON_CONSUMER_CODE"
                        }
                    }
                    
                }
            }),
            applicationSuccessCard: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    card: acknowledgementCard({
                        icon: "done",
                        backgroundColor: "#39CB74",
                        header: {
                            labelName: roleExists ? "Payment has been paid successfully!" : "Payment has been collected successfully!",
                            labelKey: roleExists ? "PAYMENT_MESSAGE_CITIZEN" : "PAYMENT_MESSAGE_EMPLOYEE"
                        },
                        body: {
                            labelName: roleExists ? "A notification regarding Payment has been sent to property owner at registered Mobile No." : "A notification regarding Payment Collection has been sent to property owner at registered Mobile No.",
                            labelKey: roleExists ? "PAYMENT_MESSAGE_DETAIL_CITIZEN" : "PAYMENT_MESSAGE_DETAIL_EMPLOYEE"
                        },
                        tailText: {
                            labelName: "Payment Receipt No.",
                            labelKey: "PAYMENT_RECEIPT_NO"
                        },
                        number: receiptNumber
                    })
                }
            },
            applicationSuccessFooter: applicationSuccessFooter(
                state,
                dispatch,
                receiptNumber,
                tenant,
                consumerCode
            )
        };
    } else if (status === "failure") {
        return {
            header: getCommonContainer({
                header: getCommonHeader({
                    labelName: roleExists ? 'Payment Details' : 'Collection Details',
                    labelKey: roleExists ? "PAYMENT_HEADER_CITIZEN" : "PAYMENT_HEADER_EMPLOYEE"
                }),
                applicationNumber: {
                    uiFramework: "custom-atoms-local",
                    moduleName: "egov-common",
                    componentPath: "ApplicationNoContainer",
                    props: {
                        number: consumerCode,
                        label: {
                            labelValue:"Consumer Code.:",
                            labelKey:"PAYMENT_COMMON_CONSUMER_CODE"
                        }
                    }
                }
            }),
            applicationSuccessCard: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    card: acknowledgementCard({
                        icon: "close",
                        backgroundColor: "#E54D42",
                        header: {
                            labelName: "Payment has failed!",
                            labelKey: "PAYMENT_FAILURE_MESSAGE"
                        },
                        body: {
                            labelName: "A notification regarding payment failure has been sent to property owner at registered Mobile No.",
                            labelKey: "PAYMENT_FAILURE_MESSAGE_DETAIL"
                        }
                    })
                }
            },
            paymentFailureFooter: paymentFailureFooter(consumerCode, tenant)
        };
    }
};
const screenConfig = {
    uiFramework: "material-ui",
    name: "acknowledgement",
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
                className: "common-div-css"
            },
            children: {}
        }
    },
    beforeInitScreen: (action, state, dispatch) => {
        const status = getQueryArg(window.location.href, "status");
        const consumerCode = getQueryArg(window.location.href, "consumerCode");
        const receiptNumber = getQueryArg(window.location.href, "receiptNumber");
        const tenant = getQueryArg(window.location.href, "tenantId");
        const data = getAcknowledgementCard(
            state,
            dispatch,
            status,
            receiptNumber,
            consumerCode,
            tenant
        );
        set(action, "screenConfig.components.div.children", data);
        return action;
    }
};

export default screenConfig;
//egov-common/acknowledgement?status=failure&receiptNumber=PB-TL-2019-10-29-003220&consumerCode=PT-1909-208877&tenantId=pb.amritsar
//egov-common/acknowledgement?status=success&receiptNumber=PB-TL-2019-10-29-003220&consumerCode=PT-1909-208877&tenantId=pb.amritsar