import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";

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

export const paymentFailureFooter = (consumerCode, tenant) => {
    console.log(consumerCode, tenant);

    const roleExists = ifUserRoleExists("CITIZEN");
    const redirectionURL = roleExists ? "/egov-common/citizen-pay" : "/egov-common/pay";
    const path = `${redirectionURL}?consumerCode=${consumerCode}&tenantId=${tenant}&businessService=PT`
    console.log(path);

    return getCommonApplyFooter({
        gotoHome: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px"
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
                path: '/egov-common/citizen-pay?consumerCode=PT-107-017837&tenantId=pb.amritsar&businessService=PT'
                    // egov-common/citizen-pay?consumerCode=PT-107-017837&tenantId=pb.amritsar&businessService=PT
            }
        }
    });
};