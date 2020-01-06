import { getCommonHeader, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import acknowledgementCard from "../wns/acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResults } from "../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { payFooter } from "./payResource/payFooter"
const getAcknowledgementCard = (
    state,
    dispatch,
    purpose,
    status,
    receiptNumber,
    secondNumber,
    tenant
) => {
    purpose = "pay"; status = "success"; // hardcode value(to be removed in future)
    if (purpose === "pay" && status === "success") {
        return {
            header: getCommonContainer({
                header: getCommonHeader({
                    labelKey: "WS_COMMON_WATER_BILL_HEADER"
                }),
                headerDynamicVal: getCommonHeader({
                    labelName: `(Q3-2018-19)`,
                }),
                applicationNumber: {
                    uiFramework: "custom-atoms-local",
                    moduleName: "egov-wns",
                    componentPath: "ConsumerNoContainer",
                    props: {
                        number: "WS-2018-PB-246464"
                    }
                },
            }),
            applicationSuccessCard: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                props: {
                    style: {
                        position: "absolute",
                        width: "95%"
                    }
                },
                children: {
                    card: acknowledgementCard({
                        icon: "done",
                        backgroundColor: "#39CB74",
                        header: {
                            labelKey: "WS_PAYMENT_SUCCESS_MESSAGE_MAIN"
                        },
                        body: {
                            labelKey: "WS_PAYMENT_SUCCESS_MESSAGE_SUB"
                        },
                        tailText: {
                            labelKey: "WS_PMT_RCPT_NO"
                        },
                        number: 'WS-JLD-2018-09-123434' //receiptNumber
                    })
                }
            },
            iframeForPdf: {
                uiFramework: "custom-atoms",
                componentPath: "Div"
            },
            payFooter
        };
    } 
};

const getSearchData = async (dispatch, queryObj) => {
    const response = await getSearchResults(queryObj);
    response &&
        response.Receipt &&
        response.Receipt.length > 0 &&
        dispatch(
            prepareFinalObject("receiptSearchResponse.Receipt", response.Receipt)
        );
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
            }
        }
    },
    beforeInitScreen: (action, state, dispatch) => {
        const purpose = getQueryArg(window.location.href, "purpose");
        const status = getQueryArg(window.location.href, "status");
        const receiptNumber = getQueryArg(window.location.href, "receiptNumber");
        const secondNumber = getQueryArg(window.location.href, "secondNumber");
        const tenant = getQueryArg(window.location.href, "tenantId");
        const serviceCategory = getQueryArg(
            window.location.href,
            "serviceCategory"
        );
        const tenantId = getTenantId();
        const queryObject = [
            {
                key: "tenantId",
                value: tenantId
            },
            { key: "offset", value: "0" },
            {
                key: "receiptNumbers",
                value: receiptNumber
            },
            {
                key: "businessCodes",
                value: serviceCategory
            }
        ];

        getSearchData(dispatch, queryObject);

        const data = getAcknowledgementCard(
            state,
            dispatch,
            purpose,
            status,
            receiptNumber,
            secondNumber,
            tenant
        );
        set(action, "screenConfig.components.div.children", data);
        return action;
    }
};

export default screenConfig;
