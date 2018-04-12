import { connect } from 'react-redux';
import {
  signupVendor, signupCustomer, login, receiveUser, logout
} from '../../actions/session_actions';
import { withRouter } from 'react-router';

import SignIn from '../Signin.jsx';

const mapStateToProps = ( state ) => {
  return {user: state.sessions.user}
}

const mapDispatchToProps = (dispatch) => ({
  login: (user, db) => dispatch(login(user, db)),
  signupVendor: (user, db) => dispatch(signupVendor(user, db)),
  signupCustomer: (user, db) => dispatch(signupCustomer(user, db)),
  dispatchUser: (user) => dispatch(receiveUser(user)),
  logout: (user, db) => dispatch(logout(user, db)),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn));
