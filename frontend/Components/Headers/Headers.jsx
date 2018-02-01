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
  }

  componentWillMount() {
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
          this.getUserType(user.uid);
          return true;
        } else {
          this.setState({loggedOut: true})
          return false;
        }
      });
    } else {
      this.props.dispatchUser(this.state.user)
    }
  }

  getUserType(user) {
    firebase.database().ref('user_type')
    .orderByKey().equalTo(user).on('value', snap => {
        this.setState({type: snap.val()[user]});
      })
  }

  render() {
    if (this.state.loggedOut === true) {
      return (
        <div className="app">
          <TopHeader />
          <SignIn />
        </div>
      )
    } else if (this.state.type === "customer") {
      return (
        <div className="app">
          <TopHeader logout={this.logout} />

          <UserHeader type={this.state.type}/>

          <section className="app-body">
            <Sidebar type={this.state.type}/>
            { this.props.children }
          </section>
        </div>
      )
    } else {
      return (
        <div className="app">
          <TopHeader logout={this.logout} />

          <UserHeader type={this.state.type}/>

          <section className="app-body">
            <Sidebar type={this.state.type}/>
            { this.props.children }
          </section>

        </div>
      )
    }
  }
}

class TopHeader extends React.Component {
  render() {
    let logout;

    if (this.props.logout) {
      logout = <h3 onClick={e => this.props.logout(e)}>Sign Out</h3>
    } else { logout = null; }

    return(
      <section className="app-header">
        <h2>FitOrMiss</h2>
        {logout}
      </section>
    )
  }
}

class UserHeader extends React.Component {
  render() {
    if (this.props.type === "vendor") {
      return(
        <section className="user-header">
          <h2><Link to="/">MyGym</Link></h2>
          <h2><Link to="/myclasses">Classes</Link></h2>
        </section>
      )
    } else {
        return(
          <section className="user-header">
            <h2><Link to="/customerclasses">MyGym</Link></h2>
          </section>
        )
    }
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
