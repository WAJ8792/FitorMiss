import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import RootReducer from './reducers/root_reducer';

let store;

export const configureStore = (preloadedState = {}) => {
  return store = createStore(RootReducer, preloadedState, applyMiddleware(thunk));
}
