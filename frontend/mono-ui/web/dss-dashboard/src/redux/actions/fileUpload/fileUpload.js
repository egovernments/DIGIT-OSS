import API from '../apis/api';
import CONFIGS from '../../config/configs'
import { getTenantId } from '../../../utils/commons';

export default class FileUploadAPI extends API {
    constructor(timeout = 2000, path, reqType, reqBody, queryParams = null) {
        super('POST', timeout, false, 'MULTIPART');
        this.type = reqType;
        this.path = path;
        this.s3File = {};
        this.body = reqBody;
    }

    toString() {}

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.s3File = res;
            return true
        }
        return false
    }

    getPayload() {
        return this.s3File;
    }

    getFormData() {
        var data = new FormData();
        data.append("file", this.body);
        data.append("tenantId", `${getTenantId()}`);
        data.append("module", 'dashboard');
        data.append("tag", '123452');
        return data;

    }
    getChartKey() {
        return this.codeKey;
    }
    apiEndPoint() {
        return CONFIGS.FILE_UPLOAD
    }

    getHeaders() {
        return {
            headers: {
                "Content-Type": "multipart/form-data",
                "type": "formData",
                "Cache-Control":"no-cache"
            }
        }
    }


}