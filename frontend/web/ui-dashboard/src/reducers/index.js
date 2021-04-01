import { combineReducers } from 'redux';
import pgrReducer from './pgrReducer';

const appReducer = combineReducers({
  pgrReducer,
});

const rootReducer = (state, action) =>
  // if (action.type === LOGOUT_USER) {
  //   state = undefined
  // }

  appReducer(state, action);
export default rootReducer;
