import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { getSearchResults } from "../../../../ui-utils/commons";
import AmountToBePaid from "./payResource/amount-to-be-paid";
import { generateBill, getCurrentFinancialYear } from "../utils";
import estimateDetails from "./payResource/estimate-details";
import { footer } from "./payResource/footer";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const header = getCommonContainer({
    header: getCommonHeader({
        labelName: `Payment (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
        labelKey: "COMMON_PAY_SCREEN_HEADER"
    }),
    consumerCode: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-common",
        componentPath: "ApplicationNoContainer",
        props: {
            number: getQueryArg(window.location.href, "consumerCode"),
            label: "Consumer Code.:"
        }
    }
});

const fetchBill = async(state, dispatch, consumerCode, tenantId, businessService) => {
    await generateBill(dispatch, consumerCode, tenantId, businessService);

    let payload = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0]");

    //Collection Type Added in CS v1.1
    payload && dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].billDetails[0].collectionType", "COUNTER"));

    if (get(payload, "amount") != undefined) {
        //set amount paid as total amount from bill - destination changed in CS v1.1
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill[0].taxAndPayments[0].amountPaid", payload.amount));
        //set total amount in instrument
        dispatch(prepareFinalObject("ReceiptTemp[0].instrument.amount", payload.amount));
        const componentJsonpath = "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.AmountToBePaid.children.cardContent.children.amountDetailsCardContainer.children.displayAmount";
        dispatch(handleField("citizen-pay", componentJsonpath, "props.value", payload.amount));
    }

    //Initially select instrument type as Cash
    dispatch(prepareFinalObject("ReceiptTemp[0].instrument.instrumentType.name", "Cash"));

    //set tenantId
    dispatch(prepareFinalObject("ReceiptTemp[0].tenantId", tenantId));

    //set tenantId in instrument
    dispatch(prepareFinalObject("ReceiptTemp[0].instrument.tenantId", tenantId));
};

const screenConfig = {
    uiFramework: "material-ui",
    name: "citizen-pay",
    beforeInitScreen: (action, state, dispatch) => {
        let consumerCode = getQueryArg(
            window.location.href,
            "consumerCode"
        );
        let tenantId = getQueryArg(window.location.href, "tenantId");
        let businessService = getQueryArg(window.location.href, "businessService");
        fetchBill(state, dispatch, consumerCode, tenantId, businessService);
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
                className: "common-div-css",
                id: "citizen-pay"
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
                            estimateDetails,
                            AmountToBePaid
                        })
                    }
                },
                footer
            }
        }
    }
};

export default screenConfig;