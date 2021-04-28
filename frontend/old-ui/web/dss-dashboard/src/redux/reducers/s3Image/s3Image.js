import C from '../../actions/constants';
export default (state = {}, action) => {
    switch (action.type) {
        case C.S3_IMAGE:
            return action.payload
        default:
            return state
    }
}
