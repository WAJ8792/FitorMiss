import { RETRIEVE_ADDRESS } from '../actions/account_actions';

let defaultState = {
    street: "",
    city: "",
    state: "",
    uid: "",
}

export function address_reducer(state = defaultState, action) {
  let newState = state;

  switch (action.type) {
    case  RETRIEVE_ADDRESS:
      return action.address;
    default:
      return state;
  }
}
