export const TOGGLE_ACCOUNTS = "TOGGLE_ACCOUNTS";
export const TOGGLE_BILLING = "TOGGLE_BILLING";

export const receiveAccounts = (data) => ({
  type: TOGGLE_ACCOUNTS,
  data
})

export const receiveBilling = (data) => ({
  type: TOGGLE_BILLING,
  data
})

export function toggleAccounts(data) {
  () => dispatch(receiveAccounts(data));
}

export function toggleBilling(data, dispatch) {
  dispatch(receiveBilling(data));
}
