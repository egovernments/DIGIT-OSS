import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import {download} from  "../../../../../ui-utils/commons";
import get from "lodash/get";


const getCommonApplyFooter = children => {
    return {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
            className: "apply-wizard-footer footer-com-style"
        },
        children
    };
};

export const applicationSuccessFooter = (
    state,
    dispatch,
    applicationNumber,
    tenant,
    consumerCode
) => {
    const roleExists = ifUserRoleExists("CITIZEN");
    const redirectionURL = roleExists ? "/" : "/inbox";
    const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject , "commonPayInfo");
    const receiptKey = get(uiCommonPayConfig, "receiptKey")
    return getCommonApplyFooter({

        downloadFormButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                className: "common-footer",
                style: {
                    minWidth: "180px",
                    height: "48px",
                    marginRight: "16px"
                },
            },
            children: {
                downloadFormButtonLabel: getLabel({
                    labelName: "DOWNLOAD RECEIPT",
                    labelKey: "COMMON_DOWNLOAD_RECEIPT"
                })
            },
            onClickDefination: {
                action: "condition",
                callBack: () => {
                    const receiptQueryString = [
                        { key: "receiptNumbers", value: applicationNumber },
                        { key: "tenantId", value: tenant }
                    ]
                    download(receiptQueryString , "download" , receiptKey);
                }
            }
        },
        printFormButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                // className: "apply-wizard-footer-right-button",
                className: "common-footer",
                style: {
                    minWidth: "180px",
                    height: "48px",
                    marginRight: "16px"
                },
                // disabled: true
            },
            children: {
                printFormButtonLabel: getLabel({
                    labelName: "PRINT RECEIPT",
                    labelKey: "COMMON_PRINT_RECEIPT"
                })
            },
            onClickDefination: {
                action: "condition",
                callBack: () => {
                    const receiptQueryString = [
                        { key: "receiptNumbers", value: applicationNumber },
                        { key: "tenantId", value: tenant }
                    ]
                    download(receiptQueryString,"print",receiptKey);
                }
            }
        }
    });
};
