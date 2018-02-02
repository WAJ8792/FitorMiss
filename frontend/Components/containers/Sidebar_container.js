import { connect } from 'react-redux';
import {signup, login} from '../../actions/session_actions';
import { withRouter } from 'react-router';

import { toggleBilling, toggleAccounts } from '../../actions/sidebar_actions';

import Sidebar from '../Sidebar';

const mapStateToProps = ( state ) => {
  return {
    user: state.sessions.user,
    accounts: state.sidebar.accounts,
    billing: state.sidebar.billing,
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleBilling: data => toggleBilling(data, dispatch),
  toggleAccounts: data => dispatch(toggleAccounts(data)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar));
