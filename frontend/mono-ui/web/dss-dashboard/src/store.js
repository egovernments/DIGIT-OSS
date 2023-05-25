/*
 Author Vishnu Bompally
 Date 04/10/2019
 Store.js is used as state management
*/
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';


export default function configureStore(initialState={}) {
 return createStore(
  rootReducer,
  initialState,
   applyMiddleware(thunk)
 );
}