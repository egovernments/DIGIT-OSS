import C from './constants';

export const updateLanguage = (data) => dispatch => {
    dispatch({
        type: C.LANGUAGE_CHANGE,
        payload: data
    })
}