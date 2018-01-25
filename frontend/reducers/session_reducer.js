import { RECEIVE_USER, LOGOUT_USER } from '../actions/session_actions';

let defaultState = {
  user: {
    uid: "",
    email: ""
  }
}

export function session_reducer(state = defaultState, action) {
  let newState = state;

  switch (action.type) {
    case RECEIVE_USER:
      newState.user.uid = action.user.uid;
      newState.user.email = action.user.email;
      return newState;
    case LOGOUT_USER:
      return defaultState;
    default:
      return state;
  }
}
