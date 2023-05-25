/**
 * base class for API object
 */
import CONFIGS from '../../config/configs';

export default class API {
    constructor(method = 'POST', timeout = 2000, auth = false, reqType='') {
        this.code = null;
        this.message = null;
        this.domain = null;
        this.method = method;
        this.timeout = timeout;
        this.auth = auth;
        this.reqType = reqType;
    }

    toString() {
        return `( code: ${this.code} message: ${this.message} domain: ${this.domain} method: ${this.method} timeout: ${this.timeout} auth: ${this.auth}`;
    }

    apiEndPoint() {
        return CONFIGS.BASE_URL;
    }
    geoLocationEndPoint() {
        return CONFIGS.GEO_URL;
    }
    apiUploadEndPoint() {
        return CONFIGS.UPLOAD_URL;
    }
    processResponse(res) {
        if (res) {
            this.code = res.code;
            this.message = res.message;
            this.domain = res.domain;
        }
    }
    processResponseCharts(res) {
        if (res) {
            this.code = res.statusInfo.statusCode;
            this.message = res.statusInfo.statusMessage;
            this.domain = res.domain;
        }
    }
}