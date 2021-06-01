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
    return `${localStorage.getItem('tenant-id')}`;
}

export const fetchLocalisationRequest = (language) => {
    const reqHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    const reqUrl = `${CONFIGS.LOCALISATION_URL}?locale=${language}&tenantId=${getTenantId().split('.')[0]}&module=rainmaker-common,rainmaker-dss`;
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