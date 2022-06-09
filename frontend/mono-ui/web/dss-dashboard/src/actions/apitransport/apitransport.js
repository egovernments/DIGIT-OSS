import axios from 'axios'
import C from '../constants'

export default function dispatchAPI(api, page) {
    if (api.reqType === 'MULTIPART') {
        return dispatch => {
            dispatch(apiStatusAsync(true, false, ''))
            axios
                .post(api.apiEndPoint(page), api.getFormData(), api.getHeaders())
                .then(function(res) {
                    if (api.processResponse(res.data)) {
                        dispatch(dispatchAPIAsync(api))
                        dispatch(apiStatusAsync(false, false, 'api successful'))
                    } else {
                        dispatch(apiStatusAsync(false, true, 'api failed because of missing response data'))
                    }
                })
                .catch(function(err) {
                    dispatch(apiStatusAsync(false, true, 'api failed'))
                })
        }
    } else if (api.method === 'POST' || api.method === 'post') {
        return dispatch => {
            dispatch(apiStatusAsync(true, false, ''))
            axios
                .post(api.apiEndPoint(page), api.getBody(), api.getHeaders())
                .then(function(res) {
                    if (api.processResponse(res.data)) {
                        dispatch(dispatchAPIAsync(api))
                        dispatch(apiStatusAsync(false, false, 'api successful'))
                    } else {
                        dispatch(apiStatusAsync(false, true, 'api failed because of missing response data'))
                    }
                })
                .catch(function(err) {
                    dispatch(apiStatusAsync(false, true, 'api failed'))
                })
        }
    } else if (api.status === 401) {
    } else {
        return dispatch => {
            dispatch(apiStatusAsync(true, false, ''))
            axios
                .get(api.apiEndPoint(page), api.getHeaders())
                .then(function(res) {
                    if (api.processResponse(res.data)) {
                        dispatch(dispatchAPIAsync(api))
                        dispatch(apiStatusAsync(false, false, 'api successful'))
                    }
                })
                .catch(function(err) {
                    dispatch(apiStatusAsync(false, true, 'api failed'))
                })
        }
    }
}

function dispatchAPIAsync(api) {
    return {
        type: api.type,
        payload: api.getPayload(),
        chartKey: api.getChartKey()
    }
}

function apiStatusAsync(progress, error, message) {
    return {
        type: C.APISTATUS,
        payload: {
            progress: progress,
            error: error,
            message: message
        }
    }
}