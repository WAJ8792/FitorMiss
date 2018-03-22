import { connect } from 'react-redux';

import { logout, signupVendor } from '../../actions/session_actions';

import ManageVendors from '../FoM_Admin/create_vendor';

const mapDispatchToProps = ( dispatch ) => ({
  logout: (user, app) => dispatch(logout(user, app)),
  signupVendor: (user, app) => dispatch(signupVendor(user, app))
});

export default connect(
  null,
  mapDispatchToProps
)(ManageVendors);
