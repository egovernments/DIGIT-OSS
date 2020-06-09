import C from '../actions/constants';
export default (state = { name: 'Vishnu', dashboardConfigData: [], isLoaded: false }, action) => {
    switch (action.type) {
        case C.CHANGE_NAME:
            return {
                ...state,
                name: action.payload.name
            }
        case C.RECEIVE_DASHBOARD_CONFIG_DATA:
            return {
                ...state,
                dashboardConfigData: action.payload,
                isLoaded: true
            }
        default:
            return state
    }
}