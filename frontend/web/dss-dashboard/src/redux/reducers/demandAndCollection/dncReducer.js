import C from '../../actions/constants';
export default (state = {}, action) => {
    switch (action.type) {
        case C.DEMAND_AND_COLLECTION:
            return {
                ...state,
                DemandAndCollectionData: action.payload
            }

        default:
            return state
    }
}