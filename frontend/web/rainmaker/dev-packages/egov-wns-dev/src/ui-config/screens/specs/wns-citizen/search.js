import {
    getCommonHeader,
    getLabel,
    getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { citizenApplication } from "./searchResource/citizenApplication";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { pendingApprovals } from "./searchResource/pendingApprovals";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import { progressStatus } from "./searchResource/progressStatus";
import { searchResults } from "./searchResource/searchResults";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../ui-utils";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = hasButton && hasButton === "false" ? false : true;

const header = getCommonHeader({
    labelKey: "WS_SEARCH_CONNECTION_HEADER"
});
const waterAndSewerageSearchAndResult = {
    uiFramework: "material-ui",
    name: "search",
    beforeInitScreen: (action, state, dispatch) => {
        const businessServiceData = JSON.parse(
            localStorageGet("businessServiceData")
        );

        const data = find(businessServiceData, { businessService: "NewTL" });
        const { states } = data || [];
        getData(action, state, dispatch).then(responseAction => {
        });
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
                    },
                },
                pendingApprovals,
                citizenApplication,
                breakAfterSearch: getBreak(),
                searchResults
            }
        }
    }
};

export const getData = async (action, state, dispatch) => {
    await getMdmsData(action, state, dispatch);
};

export const getMdmsData = async (action, state, dispatch) => {
    let mdmsBody = {
        MdmsCriteria: {
            tenantId: commonConfig.tenantId,
            moduleDetails: [
                {
                    moduleName: "tenant",
                    masterDetails: [
                        {
                            name: "tenants"
                        }
                    ]
                },
            ]
        }
    };
    try {
        let payload = null;
        payload = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
        );

        dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));

    } catch (e) {
        console.log(e);
    }
};

export default waterAndSewerageSearchAndResult;