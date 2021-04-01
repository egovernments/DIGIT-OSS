import C from '../constants';

export const updateGlobalFilterData = (data) => dispatch => {
    dispatch({
        type: C.GLOBAL_FILTER_DATA,
        payload: data
    })
}