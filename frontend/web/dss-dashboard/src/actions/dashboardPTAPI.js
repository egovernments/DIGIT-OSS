/**
 * Dashboard API
 */
import API from './apis/api';
import C from './constants';

export default class DashboardPTAPI extends API {

    constructor(timeout = 2000, auth = true, queryParams = null) {
        super('GET', timeout, auth);
        this.type = C.RECEIVE_DASHBOARD_CONFIG_DATA;
        this.queryParams = queryParams;
        this.dashboardConfigData = []
    }

    toString() {}

    processResponse(res) {
        super.processResponse(res);
        if (res && res && res["responseData"]) {
            this.dashboardConfigData = res["responseData"];
            return true
        }
        return false
    }

    getPayload() {
        return this.dashboardConfigData;
    }
    getChartKey() {
        return null;
    }
    getBody() {
        return {}
    }

    apiEndPoint() {
        return `${super.apiEndPoint()}/dashboard/getDashboardConfig/propertyTax`
    }

    getHeaders() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }


}