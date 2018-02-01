import { connect } from 'react-redux';
import {
  signupVendor, signupCustomer, login
} from '../../actions/session_actions';
import { withRouter } from 'react-router';

import SignIn from '../Signin';

const mapStateToProps = ( state ) => {
  return {user: state.sessions.user}
}

const mapDispatchToProps = (dispatch) => ({
  login: (user, db) => dispatch(login(user, db)),
  signupVendor: (user, db) => dispatch(signupVendor(user, db)),
  signupCustomer: (user, db) => dispatch(signupCustomer(user, db))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
