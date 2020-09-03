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

export const getLocaleLabels = (key = "", strings = {}) => {
    return strings[key] || key;
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