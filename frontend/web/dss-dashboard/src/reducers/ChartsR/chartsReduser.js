import C from '../../actions/constants';
export default (state = {}, action) => {
    switch (action.type) {
        case C.CHARTS:
            return {
                ...state,
                [action.chartKey]: action.payload
            }
        default:
            return state
    }
}