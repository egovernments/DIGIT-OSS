import { getTenantId, getToken } from '../../utils/commons';
import CONFIGS from '../config/configs';

export default function getChartOptions(code, filters) {
    let url = code ? CONFIGS.BASE_URL + "/dashboard/getChartV2" : "";
    let newFilter = Object.assign({}, filters);
    let duration = newFilter.duration ? newFilter.duration : null;
    let moduleLevel = newFilter.modulelevel ? newFilter.modulelevel : "";
    delete newFilter.duration;
    delete newFilter.modulelevel;
    if (url) {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'auth-token': `${getToken()}`
            }
        };
        let dataoption = {
            "RequestInfo":{
                "authToken": `${getToken()}`
            },
            "headers": {
                "tenantId": `${getTenantId()}`
            },

            "aggregationRequestDto": {
                "visualizationType": "METRIC",
                "visualizationCode": code,
                "queryType": "",
                "filters": newFilter,
                "moduleLevel": moduleLevel,
                "aggregationFactors": null,
                "requestDate": duration
            }
        }
        return {
            url: url,
            options: options,
            dataoption: dataoption
        }
    }
}