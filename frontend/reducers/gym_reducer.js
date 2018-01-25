import { RECEIVE_GYMS } from '../actions/gym_actions';

let defaultState = {
  gym_name: null,
};

export function gym_reducer(state = defaultState, action) {
  switch (action.type) {
    case RECEIVE_GYMS:
      let newState = action.data;
      return newState;
    default:
      return state;
  }
}
