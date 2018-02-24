import merge from 'lodash/merge';

import { TOGGLE_TYPE, TOGGLE_AMENITY } from '../actions/filter_actions';

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
    mat_rentals: false,
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
    case TOGGLE_AMENITY:
      newState.amenities[action.data] = toggle(newState.amenities[action.data]);
      return newState;
    default:
      return newState;
  }
}
