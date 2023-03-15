/**
 * Dashboard API
 */
import { getToken } from '../../utils/commons';
import API from '../apis/api';
import C from '../constants';

export default class ChartsAPI extends API {

    constructor(timeout = 2000, path, codeKey, reqBody, queryParams = null) {
        super('POST', timeout, false);
        this.type = C.CHARTS;
        this.chartsData = {};
        this.chartsData[codeKey] = [];
        this.path = path;
        this.codeKey = codeKey;
        this.body = reqBody;
    }

    toString() {}

    processResponse(res) {
        super.processResponseCharts(res);
        if (res && res["responseData"]) {
            this.chartsData[this.codeKey] = res["responseData"];
            return true
        }
        return false
    }

    getPayload() {
        return this.chartsData[this.codeKey];
    }

    getBody() {
        return this.body;

    }
    getChartKey() {
        return this.codeKey;
    }
    apiEndPoint() {
        return `${super.apiEndPoint()}/${this.path}/getChartV2`
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