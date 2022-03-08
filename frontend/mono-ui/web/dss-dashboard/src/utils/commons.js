import CONFIGS from '../config/configs';

export const removeSignFromInsightData = (value = '') => {
    if (value.startsWith('-')) {
        value = value.replace('-', '');
    }
    else if (value.startsWith('+')) {
        value = value.replace('+', '');
    }
    return value;
}
let localisation={};
export const getLocaleLabels = (key = "", strings = {}) => {
    if(strings&&Object.keys(strings).length>0){
        localisation=strings
    }
    strings=strings&&Object.keys(strings).length>0?strings:localisation;
    return strings[removeSpaceInLocalisationKey(key)] || removeSpaceInLocalisationKey(key);
}

const removeSpaceInLocalisationKey = (key = "") => {

    let tempKey = key || "";
    while (tempKey.includes(' ')) {
        tempKey = tempKey.replace(' ', '_');
    }
    return tempKey.toUpperCase();
}

export const getTenantId = () => {
    let tenant=sessionStorage.getItem('Digit.Employee.tenantId');
    return `${JSON.parse(tenant)?.value||localStorage.getItem('tenant-id')}`;
}
export const getToken = () => {
    let user=sessionStorage.getItem('Digit.User');
    return `${JSON.parse(user)?.value?.access_token||localStorage.getItem('Employee.token')}`;
}
export const stateTenant= () => {
    let globalConfigs=window&&window.globalConfigs?window.globalConfigs : window.parent&&window.parent.globalConfigs;
    return globalConfigs&&globalConfigs.getConfig("STATE_LEVEL_TENANT_ID")?globalConfigs.getConfig("STATE_LEVEL_TENANT_ID"):getTenantId().split('.')[0];
}

export const fetchLocalisationRequest = (language) => {
    const reqHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    const reqUrl = `${CONFIGS.LOCALISATION_URL}?locale=${language}&tenantId=${stateTenant()}&module=rainmaker-common,rainmaker-dss`;
    const reqBody = {}
    return { reqHeaders, reqBody, reqUrl };
}
export const convertLabelValue=(label='',strings={})=>{
    switch(label){
        case "Boundary":
            return getLocaleLabels('DSS_TB_CITY',strings);
        default:
            return getLocaleLabels(`DSS_TB_${label}`,strings);
    }
}

export const isNurtDashboard=()=>window.location.pathname.toLowerCase().includes("nurt_dashboard")