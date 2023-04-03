import CONFIGS from '../config/configs';

export default function getChartOptions(code, filters) {
    let url = code ? CONFIGS.BASE_URL + "/dashboard/getChartV2" : "";
    let newFilter = Object.assign({}, filters);
    let duration = newFilter.duration ? newFilter.duration : null;
    let moduleLevel = newFilter.modulelevel ? newFilter.modulelevel : "";
    delete newFilter.duration;
    delete newFilter.modulelevel;
    if (newFilter && newFilter.tenantId){
        newFilter.tenantId = `pb.${newFilter.tenantId.toLowerCase()}` ;
    }
    if (url) {
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'auth-token': `${localStorage.getItem('Employee.token')}`
            }
        };
        let dataoption = {
            "RequestInfo":{
                "authToken": `${localStorage.getItem('Employee.token')}`
            },
            "headers": {
                "tenantId": `${localStorage.getItem('tenant-id')}`
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
        console.log(newFilter,"newFilter");
        return {
            url: url,
            options: options,
            dataoption: dataoption
        }
    }
}