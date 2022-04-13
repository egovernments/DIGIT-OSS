import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { get } from "lodash";
import { httpRequest } from "../../../../ui-utils";
import { serviceConst } from "../../../../ui-utils/commons";
import "./index.css";




const getSewerageDetails = async (queryObject, dispatch) => {
    try {
        const response = await httpRequest(
            "post",
            "/sw-services/swc/_search",
            "_search",
            queryObject
        );
        if (
            response !== null &&
            response !== undefined &&
            response.SewerageConnections &&
            response.SewerageConnections.length > 0
        ) {
            dispatch(setRoute(`/wns/connection-details?connectionNumber=${get(response, 'SewerageConnections[0].connectionNo', '')}&tenantId=${get(response, 'SewerageConnections[0].tenantId', '')}&service=${serviceConst.SEWERAGE}&connectionType=${get(response, 'SewerageConnections[0].connectionType', '')}`))
        }
        return response;
    } catch (error) {
    }
}

const getWaterDetails = async (queryObject, dispatch) => {
    try {
        const response = await httpRequest(
            "post",
            "/ws-services/wc/_search",
            "_search",
            queryObject
        );
        if (
            response !== null &&
            response !== undefined &&
            response.WaterConnection &&
            response.WaterConnection.length > 0
        ) {
            dispatch(setRoute(`/wns/connection-details?connectionNumber=${get(response, 'WaterConnection[0].connectionNo', '')}&tenantId=${get(response, 'WaterConnection[0].tenantId', '')}&service=${serviceConst.WATER}&connectionType=${get(response, 'WaterConnection[0].connectionType', '')}`))
        } return response;
    } catch (error) {
    }
}
const header = getCommonHeader({
    labelKey: "WS_SEARCH_CONNECTION_HEADER"
});

const beforeInitFn = async (queryObject, dispatch, businessService) => {
    //Search details for given Connection Number

    if (businessService == 'WS') {
        await getWaterDetails(queryObject, dispatch)
    } else if (businessService == 'SW') {
        await getSewerageDetails(queryObject, dispatch)
    }
};

const redirectScreenConfig = {
    uiFramework: "material-ui",
    name: "redirect",
    beforeInitScreen: (action, state, dispatch) => {

        let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
        let tenantId = getQueryArg(window.location.href, "tenantId");
        let businessService = getQueryArg(window.location.href, "businessService");
        let queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "connectionNumber", value: connectionNumber },
        ];
        beforeInitFn(queryObject, dispatch, businessService);
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
                className: "common-div-css",
                id: "redirect"
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

    }
};

export default redirectScreenConfig;
