/**
 * Dashboard API
 */
import API from '../apis/api';
import C from '../constants';

export default class DashboardAPI extends API {

    constructor(timeout = 2000, auth = true, queryParams = null) {
        super('GET', timeout, auth);
        this.type = C.DEMAND_AND_COLLECTION;
        this.queryParams = queryParams;
        this.DemandAndCollectionData = []
    }

    toString() {}

    processResponse(res) {
        super.processResponse(res);
        if (res && res[0] && res[0]["responseData"]) {
            this.DemandAndCollectionData = res[0]["responseData"];
            return true
        }
        return false
    }

    getPayload() {
        return this.DemandAndCollectionData;
    }
    getChartKey() {
        return null;
    }
    getBody() {
        return {}
    }

    apiEndPoint() {
        return `${super.apiEndPoint()}/ch_17_50b45a596a96780b3751`
    }

    getHeaders() {
        return {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `${getToken()}`
            }
        }
    }


}