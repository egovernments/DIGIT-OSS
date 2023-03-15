/**
 * Dashboard API
 */
import { getToken } from '../../utils/commons';
import API from '../apis/api';
import C from '../constants';

export default class AllChartsAPI extends API {

    constructor(timeout = 2000, path, reqBody, queryParams = null) {
        super('POST', timeout, false);
        this.type = C.CHARTS;
        this.queryParams = queryParams;
        this.chartsData = {};
        this.chartsData = {};
        this.path = path;
        this.body = reqBody;
    }

    toString() {}

    processResponse(res) {
        super.processResponseCharts(res);
        if (res && res["responseData"]) {
            this.chartsData = res["responseData"];
            return true
        }
        return false
    }

    getPayload() {
        return this.chartsData;
    }

    getBody() {
        return this.body;

    }
    getChartKey() {
        return this.codeKey;
    }
    apiEndPoint() {
        return `${super.apiEndPoint()}/${this.path}/getChartV3`
    }

    getHeaders() {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'auth-token': `${getToken()}`
            }
        }
    }


}