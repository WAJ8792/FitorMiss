import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';

import Sidebar from './containers/Sidebar_container';
import { receiveUser, logout } from '../actions/session_actions';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {uid: "", email: ""},
      loggedOut: "loading",
    }
    this.logout = this.logout.bind(this);
    this.checkLoggedIn = this.checkLoggedIn.bind(this);
    window.logout = this.logout.bind(this);
  }

  componentWillMount() {
    this.checkLoggedIn();
  }

  logout(e) {
    // e.preventDefault();

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
      this.props.dispatchUser(this.state.user);
    }
  }

  getUserType(user) {
    firebase.database().ref('user_type')
    .orderByKey().equalTo(user).on('value', snap => {
        let subject = snap.val()[user];
        this.setState({type: subject});
      }).bind(this);
  }

  render() {
    if (this.state.loggedOut === true)
    {
      if (!this.props.location.pathname.includes('signin')) {
        return (<Redirect to="/signin" />)
      } else {
        return (
          <div className="top-header">
            <TopHeader />
          </div>
        )
      }
    }
    else if (this.state.type === "customer")
    {
      if (!this.props.location.pathname.includes('customer')) {
        console.log(this.props.location.pathname);
        return (<Redirect to="/customer" />)
      } else {
        return (
          <div className="top-header">
            <TopHeader logout={this.logout}/>
            <Sidebar />
          </div>
        )
      }
    }
    else if (this.state.type === "vendor")
    {
      if (!this.props.location.pathname.includes('admin')) {
        console.log(this.state.type);
        return (<Redirect to="/admin" />)
      } else {
        return (
          <div className="top-header">
            <TopHeader logout={this.logout}/>
            <AdminHeader />
            <Sidebar />
          </div>
        )
      }
    }
    else
    {
        return (
          <div className="top-header">
            <TopHeader logout={this.logout}/>
            <h3>Something went wrong! Keep trying!</h3>
          </div>
        )
    }
  }
}

class AdminHeader extends React.Component {
  render() {
    return(
      <section className="admin-header">
        <Link to="/admin">MyGym</Link>
        <Link to="admin/classes">Classes</Link>
      </section>
    )
  }
}

class CustomerHeader extends React.Component {
  render() {
    return(
      <section className="admin-header">
        <Link to="/customer">My Fitness</Link>
        <Link to="customer/classes">Classes</Link>
      </section>
    );
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
