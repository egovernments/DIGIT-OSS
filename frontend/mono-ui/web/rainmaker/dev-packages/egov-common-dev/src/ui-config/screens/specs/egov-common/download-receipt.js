import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { set } from "lodash";
import get from "lodash/get";
import { download } from "../../../../ui-utils/commons";
import { getBusinessServiceMdmsData } from "../utils";
import { getHeader } from "./pay";

const loadMdms = async (action, state, dispatch, consumerCode, tenantId, billBusinessService, receiptNumber) => {

    const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject, "commonPayInfo");
    const receiptKey = get(uiCommonPayConfig, "receiptKey", "consolidatedreceipt")
    await getBusinessServiceMdmsData(dispatch, tenantId);
    console.log('loaded mdms');
    const receiptQueryString = [
        { key: "receiptNumbers", value: receiptNumber },
        { key: "tenantId", value: tenantId }
    ]
    download(receiptQueryString, "open", receiptKey, state)
}
const screenConfig = {
    uiFramework: "material-ui",
    name: "download-receipt",
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
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const businessService = getQueryArg(window.location.href, "businessService");
        loadMdms(action, state, dispatch, consumerCode, tenantId, businessService, receiptNumber);
        const data = getHeader(state);
        set(action, "screenConfig.components.div.children", { data });
        return action;
    }
};

export default screenConfig;

// egov-common/download-receipt?status=success&consumerCode=PB-TL-2020-05-18-006218&tenantId=pb.amritsar&receiptNumber=TEST/107/2020-21/064499&businessService=TL