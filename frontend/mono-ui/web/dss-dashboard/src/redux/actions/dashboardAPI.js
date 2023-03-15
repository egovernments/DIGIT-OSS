/**
 * Dashboard API
 */
import { getToken } from '../../utils/commons';
import API from './apis/api';
import C from './constants';

export default class DashboardAPI extends API {

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

    apiEndPoint(page) {
        return `${super.apiEndPoint()}/dashboard/getDashboardConfig/${page}`
    }

    getHeaders() {
        return {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `${getToken()}`
                    // 'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        }
    }


}