import { connect } from 'react-redux';

import Classes from '../Admin/classes/Classes';
import { editGym } from '../../actions/gym_actions';
import { logoutUser } from '../../actions/session_actions';
import { addClass } from '../../actions/class_actions';

const mapStateToProps = ( state ) => {
  return {
    state,
    user: state.sessions.user,
    classes: state.classes,
  }
}

const mapDispatchToProps = ( dispatch ) => ({
  logout: () => dispatch(logoutUser()),
  addClass: (newClass, db) => dispatch(addClass(newClass, db))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Classes);
