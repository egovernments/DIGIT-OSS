import C from '../actions/constants';
export default (state = {}, action) => {
    switch (action.type) {
        case C.ULBS_OVERVIEW_FILTER:
            return action.payload
        default:
            return state
    }
}