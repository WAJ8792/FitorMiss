import { connect } from 'react-redux';

import { logout } from '../../actions/session_actions';

import ManageVendors from '../FoM_Admin/create_vendor';

const mapDispatchToProps = ( dispatch ) => ({
  logout: (user, app) => dispatch(logout(user, app)),
});

export default connect(
  null,
  mapDispatchToProps
)(ManageVendors);
