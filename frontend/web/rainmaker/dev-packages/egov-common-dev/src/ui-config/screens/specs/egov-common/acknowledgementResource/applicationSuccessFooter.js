import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import {download} from  "../../../../../ui-utils/commons"
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import get from "lodash/get";

const businessService = getQueryArg(window.location.href, "businessService");


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
    let path ="/";
    let applicationRedirectionURL ;

    if( businessService && businessService==="PT.MUTATION")
    {
         applicationRedirectionURL = "/pt-mutation/search-preview";
         path = `${applicationRedirectionURL}?applicationNumber=${consumerCode}&tenantId=${tenant}`    
     }        

    return getCommonApplyFooter({

        goToApplication: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    minWidth: "180px",
                    height: "48px",
                    marginRight: "16px"
                },
                className: "DCButton",
            },
            children: {
                downloadFormButtonLabel: getLabel({
                    labelName: "GOTO APPLICATION",
                    labelKey: "GO_TO_APPLICATION"
                })
            },           
            onClickDefination: {
                action: "page_change",
                path
            }
        },
        downloadFormButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    minWidth: "180px",
                    height: "48px",
                    marginRight: "16px"
                },
                className: "DCButton"
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
                    download(receiptQueryString);
                }
            }
        },
        printFormButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                // className: "apply-wizard-footer-right-button",
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
                    download(receiptQueryString,"print");
                }
            }
        }
    });
};
