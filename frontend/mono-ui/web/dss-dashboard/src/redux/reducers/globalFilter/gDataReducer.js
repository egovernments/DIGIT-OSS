import C from '../../actions/constants';
export default (state = {}, action) => {
    switch (action.type) {
        case C.GLOBAL_FILTER_DATA:
            return action.payload
                // ...state,

            // }
        default:
            return state
    }
}
