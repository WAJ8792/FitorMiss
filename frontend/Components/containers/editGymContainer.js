import { connect } from 'react-redux';

import EditMyGym from '../Admin/MyGym/EditMyGym';
import { editGym } from '../../actions/gym_actions';

const mapStateToProps = ( state ) => {
  return {
    state,
    user: state.sessions.user,
  }
}

const mapDispatchToProps = (dispatch) => ({
  editGym: (gym, gymRef) => dispatch(editGym(gym, gymRef)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMyGym);
