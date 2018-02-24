import merge from 'lodash/merge';

import { TOGGLE_TYPE } from '../actions/filter_actions';

let defaultState = {
  workoutType: {
    Cardio: false,
    Boxing: false,
    Rowing: false,
    Yoga: false,
    Pilates: false,
  },
  amenities: {
    parking: false,
    matRentals: false,
    showers: false,
    lockers: false,
    towels: false,
  },
  location: {},
}

function toggle(value) {
  value = (value) ? false : true
  return value
}


export function filter_reducer(state = defaultState, action) {
  Object.freeze(state);
  let newState = merge({}, state);

  switch (action.type) {
    case TOGGLE_TYPE:
      newState.workoutType[action.data] = toggle(newState.workoutType[action.data]);
      return newState;
    default:
      return newState;
  }
}
