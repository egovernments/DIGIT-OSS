import C from '../../actions/constants';
export default (state = {}, action) => {
    switch (action.type) {
        case C.FILE_UPLOAD:
            return action.payload
        default:
            return state
    }
}
