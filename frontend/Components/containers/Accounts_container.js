import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Account from '../Admin/Account';
import { getAddress } from '../../actions/account_actions';

const mapStateToProps = (state) => {
  return {
    user: state.sessions.user,
    address: state.address,
  }
}

const mapDispatchToProps = ( dispatch ) => ({
  getAddress: (uid, db) => dispatch(getAddress(uid, db)),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Account));
