import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter, NavLink } from 'react-router-dom';

import Sidebar from './containers/Sidebar_container';
import { receiveUser, logout } from '../actions/session_actions';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {uid: "", email: ""},
      loggedOut: "loading",
    };
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
    };
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
          this.setState({loggedOut: true});
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
        return (<Redirect to="/signin" />);
      } else {
        return (
          <div className="header" style={{zIndex: '-1'}}>
          </div>
        );
      }
    }
    else if (this.state.type === "fom") {
      return (<Redirect to="/createvendor" />);
    }
    else if (this.state.type === "customer")
    {
      if (!this.props.location.pathname.includes('customer')) {
        return (<Redirect to="/customer/classes" />);
      } else {
        return (
          <div className="header">
            <Sidebar />
            <TopHeader logout={this.logout}/>
            <CustomerHeader />
          </div>
        );
      }
    }
    else if (this.state.type === "vendor")
    {
      if (!this.props.location.pathname.includes('admin')) {
        return (<Redirect to="/admin" />);
      } else {
        return (
          <div className="header">
            <Sidebar />
            <TopHeader logout={this.logout}/>
            <AdminHeader />
          </div>
        );
      }
    }
    else
    {
      return (
        <div className="loading-message">
          <img src={window.images.logo} />
            <p>Loading Your Info
              {/*NOTE: these divs are for the loading animation*/}
              <span className="loader">
                <div></div><div></div><div></div><div></div>
              </span>
            </p>
        </div>
      );
    }
  }
}

class AdminHeader extends React.Component {
  render() {
    return(
      <section className="user-header">
        <div>
          <NavLink
            to="/admin"
            exact
            activeStyle={{color: '#1fc7aa'}}>
            MyGym
          </NavLink>

        </div>
        <div>
          <NavLink
            to="/admin/classes"
            activeStyle={{color: '#1fc7aa'}}>
            Classes
          </NavLink>
        </div>
      </section>
    );
  }
}

class CustomerHeader extends React.Component {
  render() {
    return(
      <section className="user-header">
        <div>
          <NavLink
            to="/customer/classes"
            activeStyle={{color: '#1fc7aa'}}>
            Classes
          </NavLink>
        </div>

        <div>
          <NavLink
            to="/customer"
            exact
            activeStyle={{color: '#1fc7aa'}}>
            Reservations
          </NavLink>
        </div>

        <div>
          <NavLink
            to="/customer/billing"
            exact
            activeStyle={{color: '#1fc7aa'}}>
            Billing
          </NavLink>
        </div>
      </section>
    );
  }
}

class TopHeader extends React.Component {
  render() {
    let logout;

    if (this.props.logout) {
      logout = <div className="logout" onClick={e => this.props.logout(e)}>Sign Out</div>
    } else { logout = null; }

    return(
      <section className="top-header">
        <div className="wordmark"><span>Fit</span>or<span>Miss</span></div>
        {logout}
      </section>
    );
  }
}

// class Dropdown extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dropdownIsOpen: false
//     };
//
//     this.handleDropdownClick = this.handleDropdownClick.bind(this);
//     this.renderDropdown = this.renderDropdown.bind(this);
//   }
//
//   handleDropdownClick() {
//     this.setState({dropdownIsOpen: !this.state.dropdownIsOpen});
//   }
//
//   renderDropdown() {
//     if (this.state.dropdownIsOpen) {
//       return (
//         <ul className="dropdown-list">
//           <li>Account</li>
//           <hr />
//           <li>Billing</li>
//           <hr />
//           <li onClick={this.props.logout}>Sign Out</li>
//         </ul>
//       );
//     }
//   }
//
//   render() {
//     return(
//       <div
//         className="dropdown-text"
//         onClick={this.handleDropdownClick}>
//         <p className="username-dropdown">John Smith
//           <span><i className="fa fas fa-caret-down" /></span>
//         </p>
//         <div className="dropdown-container">
//           {this.renderDropdown()}
//         </div>
//       </div>
//     );
//   }
// }

// class TopHeader extends React.Component {
//   render() {
//     let logout;
//
//     if (this.props.logout) {
//       logout = <div className="logout" onClick={e => this.props.logout(e)}>Sign Out</div>
//     } else { logout = null; }
//
//     return(
//       <section className="top-header">
//         <div className="wordmark"><span>Fit</span>or<span>Miss</span></div>
//         {logout}
//       </section>
//     );
//   }
// }

const mapStateToProps = ( state ) => {
  return {
    user: state.sessions.user,
  };
};

const mapDispatchToProps = ( dispatch ) => ({
  dispatchUser: (user) => dispatch(receiveUser(user)),
  logout: (user, db) => dispatch(logout(user, db)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Header));
