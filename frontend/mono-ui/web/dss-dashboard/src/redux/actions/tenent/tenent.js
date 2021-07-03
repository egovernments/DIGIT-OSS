import API from '../apis/api';
import CONFIGS from '../../config/configs';

export default class TenentAPI extends API {

    constructor(timeout = 2000, path, reducerType, reqBody, queryParams = null) {
        super('POST', timeout, false);
        this.type = reducerType;
        this.path = path;
        this.tenents = {};
        this.body = reqBody;
    }

    toString() { }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.tenents = res;
            return true
        }
        return false
    }

    getPayload() {
        return this.tenents;
    }

    getBody() {
        return this.body
    }

    getChartKey() {
        return this.codeKey;
    }
    
    apiEndPoint() {
        return CONFIGS.MDMS 
    }

    getHeaders() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }


}