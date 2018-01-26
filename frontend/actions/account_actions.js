import { retrieveAddress } from '../util/account_util';

export const RETRIEVE_ADDRESS = "RETRIEVE_ADDRESS";

export const setAddress = (address) => ({
  type: RETRIEVE_ADDRESS,
  address
});

export const getAddress = (uid, db) => dispatch => {
  let address = retrieveAddress(uid, db)
  dispatch(setAddress(address));
}
