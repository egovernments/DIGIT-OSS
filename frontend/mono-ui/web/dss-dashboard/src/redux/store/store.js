import { createStore, compose, applyMiddleware } from 'redux';
import appReducer from '../reducers';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import stateData from '../data/appstate/initialstate'
const middlewares = [];
const config = {
    key: 'root',
    storage,
}
let reducer = persistCombineReducers(config, appReducer)

middlewares.push(thunk);
if (process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger());
}

const storeFactory = createStore(
    reducer,
    stateData,
    (process.env.NODE_ENV === 'development') ? composeWithDevTools(applyMiddleware(...middlewares)) : compose(applyMiddleware(...middlewares))
)

export default storeFactory;