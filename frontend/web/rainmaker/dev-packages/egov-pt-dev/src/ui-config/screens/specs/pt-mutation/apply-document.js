import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-kit/redux/app/actions";
import { getPropertyInfoScreenUrl } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import get from "lodash/get";
import set from "lodash/set";
import { startMutationApplyFlow } from "./requiredDocuments/footer";

const header = getCommonHeader({
    labelName: "Property Tax",
    labelKey: "PT_MUTATION_TRANSFER_HEADER"
});
const screenConfig = {
    uiFramework: "material-ui",
    name: "apply-document",

    beforeInitScreen: (action, state, dispatch) => {
        const consumerCode = getQueryArg(window.location.href, "consumerCode");
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const redirectUrl = getPropertyInfoScreenUrl(consumerCode, tenantId)
        let mutationDocumentUIChildren = {};
        mutationDocumentUIChildren = get(state, 'screenConfiguration.preparedFinalObject.mutationDocumentUIChildren', null);
        if (!mutationDocumentUIChildren) {
            mutationDocumentUIChildren = {};
            dispatch(setRoute(redirectUrl));

        }
        set(mutationDocumentUIChildren, 'children.footer.children.footer.children.applyButton.onClickDefination', {
            action: "condition",
            callBack: startMutationApplyFlow
        })
        set(mutationDocumentUIChildren, 'children.header.children.header.children.key.props.labelKey', 'PTM_REQ_DOCS_HEADER')
        set(mutationDocumentUIChildren, 'children.footer.children.footer.children.applyButton.children.applyButtonLabel.props.labelKey', 'PTM_COMMON_BUTTON_APPLY')
        set(
            action,
            "screenConfig.components.adhocDialog.children.popup",
            mutationDocumentUIChildren
        );


        set(
            action,
            "screenConfig.components.adhocDialog.props.redirectUrl",
            redirectUrl
        );
        return action;

    },

    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
                className: "common-div-css",
                id: "search"
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",

                    children: {
                        header: {
                            gridDefination: {
                                xs: 12,
                                sm: 6
                            },
                            ...header
                        }
                    }
                },
            }
        },
        adhocDialog: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-pt",
            componentPath: "DialogContainer",
            props: {
                open: true,
                maxWidth: false,
                screenKey: "apply-document"
            },
            children: {
                popup: {}
            }
        }
    }
};

export default screenConfig;

