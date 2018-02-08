import merge from 'lodash/merge';

import { RECEIVE_CLASS_ERRORS } from '../actions/class_actions';

let defaultState = {
  classes: [],
  error: "",
}

export function classes_reducer(state = defaultState, action) {
  Object.freeze(state);
  let newState = merge({}, state);

  switch (action.type) {
    case RECEIVE_CLASS_ERRORS:
      newState.error = action.error;
      return newState;
    default:
      return state;
  }
}
