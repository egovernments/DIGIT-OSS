import fetch from 'cross-fetch';
import CONFIGS from '../config/configs';
import C from './constants';

export const changeTheName = () => dispatch => {
    dispatch({
        type: C.CHANGE_NAME,
        payload: { name: 'Tarento' }
    })
}

export const receiveDashBoardConfigData = (data) => dispatch => {
    dispatch({
        type: C.RECEIVE_DASHBOARD_CONFIG_DATA,
        payload: data
    })
}

export const loadDashboardConfigData = () => dispatch => {
    //dispatch(requestPosts(subreddit))
    return fetch(CONFIGS.API_URL + '/dbC_50b45a596a96780b3757')
        .then(response => {
            return response.json();
        }).then(data => {
            dispatch(receiveDashBoardConfigData(data["responseData"]))
        }).catch(err => {
        });

}