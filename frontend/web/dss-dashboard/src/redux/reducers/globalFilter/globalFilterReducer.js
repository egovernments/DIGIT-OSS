import C from '../../actions/constants';
export default (state = {}, action) => {
    switch (action.type) {
        case C.GLOBAL_FILTER:
            return {
                ...state,
                name: action.payload
            }
        default:
            return state
    }
}