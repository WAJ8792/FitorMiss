import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import {auth} from 'firebase';

import Sidebar from '../admin/Sidebar';
import SignIn from '../containers/Sessions_Container';
import { receiveUser, logout } from '../../actions/session_actions';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {uid: "", email: ""},
      loggedOut: "loading",
    }
    this.logout = this.logout.bind(this);
    this.checkLoggedIn = this.checkLoggedIn.bind(this);
    this.checkLoggedIn();
  }

  componentDidMount() {
    this.checkLoggedIn();
  }

  logout(e) {
    e.preventDefault();

    let user = {
      uid: this.state.user.uid,
      email: this.state.user.email,
    }
    this.props.logout(user, app);
    this.setState({loggedOut: true});
  }

  checkLoggedIn() {
    if (this.state.user.uid.length < 1) {
      app.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({ user, loggedOut: false });
          this.props.dispatchUser(user);
          return true;
        } else {
          this.setState({loggedOut: true})
          return false;
        }
      });
    } else { this.props.dispatchUser(this.state.user) }
  }

  render() {

    if (this.state.loggedOut === true) {
      return (
        <div className="app">
          <SignIn />
        </div>
      )
    } else {
      return (
        <div className="app">
          <section className="app-header">
            <h2>FitOrMiss</h2>
              <h3 onClick={e => this.logout(e)}>Sign Out</h3>
          </section>

          <AdminHeader />

          <section className="app-body">
            <Sidebar />
            { this.props.children }
          </section>

        </div>
      )
    }
  }
}

class AdminHeader extends React.Component {
  render() {
    return(
      <section className="admin-header">
        <h2><Link to="/">MyGym</Link></h2>
        <h2><Link to="/myclasses">Classes</Link></h2>
      </section>
    )
  }
}

const mapStateToProps = ( state ) => {
  return {
    user: state.sessions.user,
  }
}

const mapDispatchToProps = ( dispatch ) => ({
  dispatchUser: (user) => dispatch(receiveUser(user)),
  logout: (user, db) => dispatch(logout(user, db)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Header));
