import { createVendor, createCustomer } from '../util/session_util';

export const RECEIVE_USER = "RECEIVE_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const RECEIVE_ERROR = "RECEIVE_ERROR";

export const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

export const receiveErrors = (error) => ({
  type: RECEIVE_ERROR,
  error
})

export const logout = (user, db) => dispatch => (
  db.auth().signOut()
    .then(user => dispatch(logoutUser()))
);

export const login = (user, db) => dispatch => (
  db.auth()
    .signInAndRetrieveDataWithEmailAndPassword(user.email, user.password)
    .then(user => dispatch(receiveUser(user)))
    .catch(error => dispatch(receiveErrors(error.message)))
);

export const signupVendor = (userInfo, db) => dispatch =>  (
  db.auth()
    .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
    .then(user => createVendor(user, db, userInfo))
    .catch(error => dispatch(receiveErrors(error.message)))
)

export const signupCustomer = (userInfo, db) => dispatch => (
  db.auth()
  .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
  .then(user => dispatch(receiveUser(user)))
  .then(user => createCustomer(user, db, userInfo))
  .catch(error => dispatch(receiveErrors(error.message)))
)
