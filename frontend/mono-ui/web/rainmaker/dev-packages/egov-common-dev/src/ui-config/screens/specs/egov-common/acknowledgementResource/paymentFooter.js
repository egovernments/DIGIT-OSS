import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { isPublicSearch } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { ifUserRoleExists } from "../../utils";
import './acknowledgementUtils.css';
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const getHomeButtonPath = (item) => {
    const consumerCode = getQueryArg(window.location.href, "consumerCode");
    let url = "/withoutAuth/pt-mutation/public-search";
    if(consumerCode.includes("WS") || consumerCode.includes("SW")) {
        url = "/withoutAuth/wns/public-search";
    }
    return isPublicSearch() ? url : (ifUserRoleExists("CITIZEN") ? get(item, "citizenUrl", "/") : get(item, "employeeUrl", "/inbox"));
}

const getCommonApplyFooter = children => {
    return {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
            className: "apply-wizard-footer common-footer-mobile"
        },
        children
    };
};

const defaultValues = {
    "code": "DEFAULT",
    "headerBandLabel": "PAYMENT_COMMON_CONSUMER_CODE",
    "receiptKey": "consolidatedreceipt",
    "billKey": "consolidatedbill",
    "buttons": [
        {
            "label": "COMMON_BUTTON_HOME",
            "citizenUrl": "/",
            "employeeUrl": "/inbox"
        }
    ]
}

export const paymentFooter = (state, consumerCode, tenant, status, businessService) => {

    const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject, "commonPayInfo", defaultValues);
    const buttons = get(uiCommonPayConfig, "buttons");
    const redirectionURL = isPublicSearch() ? "/withoutAuth/egov-common/pay" : "/egov-common/pay";
    const path = `${redirectionURL}?consumerCode=${consumerCode}&tenantId=${tenant}&businessService=${businessService}`

    // gotoHome: {
    //     componentPath: "Button",
    //     props: {
    //         variant: "contained",
    //         color: "primary",
    //         className:"common-footer-mobile",
    //         style: {
    //             minWidth: "200px",
    //             height: "48px",
    //             marginRight: "16px",
    //             marginLeft: "40px"
    //         }
    //     },
    //     children: {
    //         downloadReceiptButtonLabel: getLabel({
    //             labelKey : label
    //         //    ...footer.label,
    //             //  labelName: get(footer,"label.labelName","GO TO HOME"),
    //             //  labelKey: get(footer,"label.labelKey","GO_TO_HOME")
    //         })
    //     },
    //     onClickDefination: {
    //         action: "page_change",
    //         path: get(footer,"link", `/inbox`)
    //     },
    // },



    const footer = buttons && buttons.map((item, index) => {
        return {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                className: "common-footer-mobile",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                    marginLeft: "40px"
                }
            },
            children: {
                downloadReceiptButtonLabel: getLabel({
                    labelKey: get(item, "label", "GO_TO_HOME")
                })
            },
            onClickDefination: {
                action: "page_change",
                path: getHomeButtonPath(item)
            },
        }
    })
    return getCommonApplyFooter({
        ...footer,
        retryButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                className: "common-footer-mobile",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                    marginLeft: "40px",
                }
            },
            children: {
                downloadReceiptButtonLabel: getLabel({
                    labelName: "RETRY",
                    labelKey: "COMMON_RETRY"
                })
            },
            onClickDefination: {
                action: "page_change",
                path
            },
            visible: status === "failure" ? true : false
        }
    });
};