import { connect } from 'react-redux';
import {signup, login} from '../../actions/session_actions';
import { withRouter } from 'react-router';

import { toggleType, toggleAmenities } from '../../actions/filter_actions';

import Sidebar from '../Sidebar';

const mapStateToProps = ( state ) => {
  return {
    user: state.sessions.user,
    filters: state.filters
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleType: data => dispatch(toggleType(data)),
  toggleAmenities: data => dispatch(toggleAmenities(data))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar));
