import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from '../../util/session_util';

class CustomerPage extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      userInfo: {
        first_name: "",
        last_name: "",
        email: "",
        neighborhood: "",
      },
      classes: [],
    }
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid, loggedOut: false });
        this.fetchUserInfo(this.state.user);
        this.fetchClassInfo(this.state.user);
      }
    });
  }

  fetchUserInfo(user) {
    firebase.database().ref('customers')
    .orderByKey().equalTo(user).on('value', snap => {
      if (snap.val() != null) {
        this.setState({userInfo: snap.val()[user]});
      }
    })
  }

  fetchClassInfo(user) {
    // firebase.database().ref('classes').orderByChild()
  }

  render() {
    return(
      <div className="page-container">
        <WelcomeHeader user={this.state.userInfo}/>
      </div>
    )
  }
}

class WelcomeHeader extends React.Component {
  render() {
    return(
      <div>
        <h1>Welcome {this.props.user.first_name}</h1>
        <h2>Check out these classes in your area!</h2>
      </div>
    )
  }
}

const mapStateToProps = ( state ) => {
  return {
    user: state.sessions.user,
  }
}

export default withRouter(connect(
  mapStateToProps
)(CustomerPage))
