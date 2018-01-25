export const RECEIVE_USER = "RECEIVE_USER";
export const LOGOUT_USER = "LOGOUT_USER";

export const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

export const logout = (user, db) => dispatch => (
  db.auth().signOut()
    .then(user => dispatch(logoutUser()))
);

export const login = (user, db) => dispatch => (
  db.auth()
    .signInAndRetrieveDataWithEmailAndPassword(user.email, user.password)
    .then(user => dispatch(receiveUser(user)))
);

export const signup = (user, db) => dispatch =>  (
  db.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(user => dispatch(receiveUser(user)))
);
