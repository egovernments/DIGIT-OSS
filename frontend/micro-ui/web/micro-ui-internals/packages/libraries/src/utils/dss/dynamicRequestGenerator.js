import { Request } from "../../services/atoms/Utils/Request";
export const getFilterValue = (filter) => {
    if (filter?.source?.type == 'request') {
        return getRequestFilterValues(filter);
    } else if (filter?.source?.type == 'list') {
        return getListFilterValues(filter);
    } else return;
}

const getRequestFilterValues = (filter) => {
    return new Promise((resolve, reject) => {
        try {
            let request = getRequestPayload(filter.source);
            Request(request).then((res) => {
                var jp = require('jsonpath');
                let keys = jp.query(res, filter.source.keyPath);
                let values = jp.query(res, filter.source.valuesPath);
                let filtersValues = [];
                if (keys && values && keys.length && values.length && keys.length == values.length) {
                    keys.forEach((key, idx) => {
                        filtersValues.push({'key': key, 'value': values[idx]})
                    })
                }
                resolve({'id': filter.id, 'values': filtersValues})
            }).catch(err => {
                resolve({'id': filter.id, 'values': null})
            })
        } catch (error) {
            reject(error);
        }
    })
}

const getListFilterValues = (filter) => {
    return new Promise((resolve, reject) => {
        let listValue = filter.source.list;
        var jp = require('jsonpath');
        let keys = jp.query(listValue, filter.source.keyPath);
        let values = jp.query(listValue, filter.source.valuesPath);
        let filtersValues = [];
        if (keys && values && keys.length && values.length && keys.length == values.length) {
            keys.forEach((key, idx) => {
                filtersValues.push({'key': key, 'value': values[idx]})
            })
        }
        resolve({'id': filter.id, 'values': filtersValues})
    })
}

const getRequestPayload = (filterConfig) => {
    let request = {};
    request["method"] = filterConfig?.requestMethod ? filterConfig.requestMethod : "POST";
    request["url"] = filterConfig?.hostUrl ? filterConfig.hostUrl + filterConfig.requestUrl : filterConfig.requestUrl;
    request["authHeader"] = true;
    request["useCache"] = true;
    request["userService"] = true;
    request["locale"] = true;
    if (filterConfig?.requestBody && filterConfig.requestBody.length) {
        request["data"] = JSON.parse(filterConfig.requestBody);
    }
    return request;
}

export const getParsedRequest = (filterSource, filterValues) => {
    var jp = require('jsonpath');
    if (filterSource?.requestUrl && filterSource?.requestUrl.length) {
        let replacableList = getReplacableValues(filterSource.requestUrl);
        replacableList.forEach((str) => {
            let value = jp.query(filterValues, str);
            filterSource.requestUrl = filterSource.requestUrl.replace(`{${str}}`, value)
        })
    }
    if (filterSource?.requestBody && filterSource?.requestBody.length) {
        let replacableList = getReplacableValues(filterSource.requestBody);
        replacableList.forEach((str) => {
            let value = jp.query(filterValues, str);
            filterSource.requestBody = filterSource.requestBody.replace(`{${str}}`, value)
        })
    }
    return filterSource;
}

const getReplacableValues = (requestString) => {
    let replacableValues = [];
    let isReplacable = false;
    let replacableStr = "";
    for (let idx=0; idx<requestString.length; idx++) {
        let s = requestString[idx];
        if (isReplacable) {
            if (s == '}') {
                isReplacable = false;
                replacableValues.push(replacableStr);
            }
            else replacableStr+=s;
        }
        if (s == '{' && requestString[idx+1]=='$') {
            isReplacable = true;
        }
    }
    return replacableValues;
}
