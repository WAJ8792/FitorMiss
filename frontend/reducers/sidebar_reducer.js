import { TOGGLE_ACCOUNTS, TOGGLE_BILLING } from '../actions/sidebar_actions';

let defaultState = {
    accounts: "selectors-up",
    billing: "selectors-up",
}

export function toggle_sidebar(state = defaultState, action) {
  let newState = state;
  switch (action.type) {
    case TOGGLE_ACCOUNTS:
      newState.accounts = action.data;
      return newState;
      break;
    case TOGGLE_BILLING:
      newState.billing = action.data;
      return newState;
      break;
    default:
      return state;
  }
}
