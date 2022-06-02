import { getWSMyResults,getSWMyResults } from "../../../../../ui-utils/commons";
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
        },
        {
            key: "tenantId",
            value: JSON.parse(getUserInfo()).permanentCity ? JSON.parse(getUserInfo()).permanentCity : JSON.parse(getUserInfo()).roles[0].tenantId
        }
    ]

    const response = await getWSMyResults(queryObject, 'APPLICATION', dispatch);
    const swResponse = await getSWMyResults(queryObject, 'APPLICATION',dispatch);

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
            dispatch(prepareFinalObject("myApplicationResults", finalResponse));
            dispatch(prepareFinalObject("myApplicationsCount", finalResponse.length));
            const myApplicationsCount = finalResponse.length;
            dispatch(
                handleField(
                    "my-applications",
                    "components.div.children.header.children.key",
                    "props.dynamicArray",
                    myApplicationsCount ? [myApplicationsCount] : [0]
                )
            );
        }
    } catch (error) {
    };
}