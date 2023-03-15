import C from '../../actions/constants';
export default (state = {}, action) => {
    switch (action.type) {
        case C.MDMS:
            return action.payload
        default:
            return state
    }
}
