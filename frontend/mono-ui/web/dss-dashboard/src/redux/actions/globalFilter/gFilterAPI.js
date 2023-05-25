/**
 * Dashboard API
 */
import API from './apis/api';
import C from './constants';

export default class GlobalFIlterAPI extends API {

    constructor(timeout = 2000, auth = true, queryParams = null) {
        super('GET', timeout, auth);
        this.type = C.RECEIVE_DASHBOARD_CONFIG_DATA;
        this.queryParams = queryParams;
        this.globalFilter = []
    }

    toString() {}

    processResponse(res) {
        super.processResponse(res);
        if (res && res.responseData) {
            this.globalFilter = res.responseData;
            return true
        }
        return false
    }

    getPayload() {
        return this.globalFilter;
    }
    getChartKey() {
        return null;
    }
    getBody() {
        return {}
    }

    apiEndPoint() {
        return `${super.apiEndPoint()}/`
    }

    getHeaders() {
        return {
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        }
    }


}