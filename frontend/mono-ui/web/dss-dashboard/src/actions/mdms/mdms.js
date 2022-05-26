import API from '../apis/api';
import C from '../constants';
import CONFIGS from '../../config/configs';
import getMDMSData from '../getMDMSData'
import { get } from 'lodash';
import { stateTenant } from '../../utils/commons';
const INDIA_TOPO_JSON = require("./india.topo.json");

export default class MdmsAPI extends API {

    constructor(timeout = 2000, path, codeKey, reqBody, queryParams = null) {
        super('POST', timeout, false);
        this.type = C.MDMS;
        this.path = path;
        this.mdmsData = {};
        this.configData = {};
        this.body = reqBody;
    }

    toString() { }

    processResponse(res) {
        super.processResponse(res);
        if (res) {  
            sessionStorage.setItem('MODULE_LEVEL',JSON.stringify(get(res,'MdmsRes.dss-dashboard.dashboard-config[0].MODULE_LEVEL',[])))
            sessionStorage.setItem('CHART_COLOR_CODE',JSON.stringify(get(res,'MdmsRes.dss-dashboard.dashboard-config[0].CHART_COLOR_CODE',[])))
            sessionStorage.setItem('SERVICES',JSON.stringify(get(res,'MdmsRes.dss-dashboard.dashboard-config[0].SERVICES',[]))  )     
            sessionStorage.setItem('MAP_CONFIG',JSON.stringify(get(res,'MdmsRes.dss-dashboard.dashboard-config[0].MAP_CONFIG[0]',INDIA_TOPO_JSON)))     
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
        let tenent = stateTenant() || '';
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
                },       
                    {
                        "moduleName": "dss-dashboard",
                        "masterDetails": [
                            {
                                "name": "dashboard-config"
                            }
                        ]
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