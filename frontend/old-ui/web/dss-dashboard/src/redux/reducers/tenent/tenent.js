import C from '../../actions/constants';
export default (state = {}, action) => {
    switch (action.type) {
        case C.TENENTS:
            return action.payload
        default:
            return state
    }
}
