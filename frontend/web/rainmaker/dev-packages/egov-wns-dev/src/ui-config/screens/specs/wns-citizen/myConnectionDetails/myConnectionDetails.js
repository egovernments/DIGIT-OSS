import { getMyConnectionResults, getSWMyConnectionResults } from "../../../../../ui-utils/commons";
import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

export const fetchData = async (action, state, dispatch) => {
    let finalResponse = [];
    let queryObject = [
        {
            key: "mobileNumber",
            value: JSON.parse(getUserInfo()).mobileNumber
        }, {
            key: "tenantId",
            value: JSON.parse(getUserInfo()).permanentCity
        }]

    const response = await getMyConnectionResults(queryObject, dispatch);
    const swResponse = await getSWMyConnectionResults(queryObject, dispatch);

    if ((response && response.WaterConnection && response.WaterConnection.length > 0) && (swResponse && swResponse.SewerageConnections && swResponse.SewerageConnections.length > 0)) {
        finalResponse = [...response.WaterConnection, ...swResponse.SewerageConnections];
    } else if (response && response.WaterConnection && response.WaterConnection.length > 0) {
        finalResponse = response.WaterConnection;
    } else {
        if (swResponse && swResponse.SewerageConnections && swResponse.SewerageConnections.length > 0) {
            finalResponse = swResponse.SewerageConnections;
        }
    }
    try {
        /*Mseva 2.0 */
        if (finalResponse && finalResponse.length > 0) {
            dispatch(prepareFinalObject("myConnectionResults", finalResponse));
            // dispatch(prepareFinalObject("myConnectionCount", response.WaterConnection.length));
        }
    } catch (error) {
        console.log(error);
    };
}