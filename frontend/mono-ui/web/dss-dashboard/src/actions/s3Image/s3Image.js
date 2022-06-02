
import API from '../apis/api';
import CONFIGS from '../../config/configs'
import { getTenantId } from '../../utils/commons';

export default class S3ImageAPI extends API {
    constructor(timeout = 2000, path, reqType, reqBody, queryParams = null) {
        super('GET', timeout, false);
        this.type = reqType;
        this.body = reqBody;
        this.path = path;
        this.s3Image = {};
    }

    toString() { }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.s3Image = res;
            return true
        }
        return false
    }

    getPayload() {
        return this.s3Image;
    }

    getBody() {
        return {}
    }
    getChartKey() {
        return this.codeKey;
    }
    apiEndPoint() {
        return CONFIGS.FETCH_FILE + "?tenantId="+`${getTenantId()}`+"&fileStoreIds=" + this.body
    }

    getHeaders() {
        return {
            headers: {
                "Cache-Control": "no-cache",
                "Postman-Token": "f6ba2ac4-a8bb-6c90-ff3f-43674f2cc8bb,e9e8a714-eb65-43b1-a06f-b03c26e52b1d",
                "cache-control": "no-cache"
            }
        }
    }


}