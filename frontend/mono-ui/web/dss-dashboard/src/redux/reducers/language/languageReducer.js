import C from '../../actions/constants';
import LocalizedStrings from 'react-localization';


export default (state = {}, action) => {
    switch (action.type) {
        case C.LANGUAGE_CHANGE:
            let strings = new LocalizedStrings(action.payload)
            return strings
                // ...state,

            // }
        default:
            return state
    }
}