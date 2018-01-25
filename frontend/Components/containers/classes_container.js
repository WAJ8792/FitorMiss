import { connect } from 'react-redux';

import Classes from '../Admin/classes/Classes';
import { editGym } from '../../actions/gym_actions';
import { logoutUser } from '../../actions/session_actions'

const mapStateToProps = ( state ) => {
  return {
    state,
    user: state.sessions.user,
  }
}

const mapDispatchToProps = ( dispatch ) => ({
  logout: () => dispatch(logoutUser())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Classes);
