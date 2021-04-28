import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { isPublicSearch } from "egov-ui-framework/ui-utils/commons";

const getCommonApplyFooter = children => {
    return {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
            className: "apply-wizard-footer"
        },
        children
    };
};

export const paymentFailureFooter = (consumerCode, tenant, businessService) => {
    const redirectionURL = isPublicSearch() ? "/withoutAuth/egov-common/pay" : "/egov-common/pay";
    let path = `${redirectionURL}?consumerCode=${consumerCode}&tenantId=${tenant}&businessService=${businessService}`
    const redirectNumber=localStorage.getItem('pay-redirectNumber');
    const channel=localStorage.getItem('pay-channel');
    if(channel&&redirectNumber){
        path=`${path}&channel=${channel}&redirectNumber=${redirectNumber}`
    }
    return getCommonApplyFooter({
        gotoHome: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                    marginLeft: "40px"
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
            }
        }
    });
};