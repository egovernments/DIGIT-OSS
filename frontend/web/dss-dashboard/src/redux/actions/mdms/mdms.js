import API from '../apis/api';
import C from '../constants';
import CONFIGS from '../../config/configs';
import getMDMSData from '../getMDMSData'

export default class MdmsAPI extends API {

    constructor(timeout = 2000, path, codeKey, reqBody, queryParams = null) {
        super('POST', timeout, false);
        this.type = C.MDMS;
        this.path = path;
        this.mdmsData = {};
        this.body = reqBody;
    }

    toString() { }

    processResponse(res) {
        super.processResponse(res);
        if (res) {            
            res = getMDMSData(res.MdmsRes.tenant.tenants);
            this.mdmsData = res;
            return true
        }
        return false
    }

    getPayload() {
        return this.mdmsData;
    }

    getBody() {
        let tenent = `${localStorage.getItem('tenant-id')}` ? (`${localStorage.getItem('tenant-id')}`).split('.')[0] : ''
        return {
           "RequestInfo": {
               "authToken": ""
           },
           "MdmsCriteria": {
               "tenantId": tenent,
               "moduleDetails": [
                {
                "moduleName": "tenant",
                "masterDetails": [
                {
                "name": "tenants"
                }]
                }
               ]
           }
        }
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