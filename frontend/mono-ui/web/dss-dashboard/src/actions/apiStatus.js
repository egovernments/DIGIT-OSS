import C from './constants';

export const APIStatus = (data) => dispatch => {
    dispatch({
        type: C.APISTATUS,
            payload: {
                progress: data,
                error: '',
                message: ''
            }
    })
}