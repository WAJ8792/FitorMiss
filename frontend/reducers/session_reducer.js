import merge from 'lodash/merge';

import { RECEIVE_USER, LOGOUT_USER, RECEIVE_ERROR } from '../actions/session_actions';

let defaultState = {
  user: {
    uid: "",
    email: "",
    error: "",
  }
}

export function session_reducer(state = defaultState, action) {
  Object.freeze(state)
  let newState = merge({}, state);

  switch (action.type) {
    case RECEIVE_USER:
      newState.user.uid = action.user.uid;
      newState.user.email = action.user.email;
      return newState;
    case LOGOUT_USER:
      return defaultState;
    case RECEIVE_ERROR:
      newState.user.error = action.error;
      return newState;
    default:
      return state;
  }
}
