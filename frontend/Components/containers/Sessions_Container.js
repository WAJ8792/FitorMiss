import { connect } from 'react-redux';
import {signup, login} from '../../actions/session_actions';
import { withRouter } from 'react-router';

import SignIn from '../Signin';

const mapStateToProps = ( state ) => {
  return {user: state.sessions.user}
}

const mapDispatchToProps = (dispatch) => ({
  login: (user, db) => dispatch(login(user, db)),
  signup: (user, db) => dispatch(signup(user, db)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
