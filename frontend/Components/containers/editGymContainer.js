import { connect } from 'react-redux';

import EditMyGym from '../Admin/EditMyGym';
import { editGym } from '../../actions/gym_actions';

const mapStateToProps = ( state ) => ({
  state;
})

const mapDispatchToProps = (dispatch) => ({
  editGym: (gym, gymRef) => dispatch(editGym(gym, gymRef)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMyGym);
