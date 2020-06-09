import C from '../../actions/constants';
export default (state = {}, action) => {
    switch (action.type) {
        case C.WARD_DATA:
            return action.payload
        default:
            return state
    }
}
