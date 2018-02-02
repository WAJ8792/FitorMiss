import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from '../../../util/session_util';

import ClassInfo from './DisplayClassInfo';

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
    this.handleReserve = this.handleReserve.bind(this);
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid, loggedOut: false });
        this.fetchUserInfo(this.state.user);
      }
    });
  }

  fetchUserInfo(user) {
    firebase.database().ref('customers')
    .orderByKey().equalTo(user).on('value', snap => {
      if (snap.val() != null) {
        this.setState({userInfo: snap.val()[user]});
        this.fetchClassInfo(snap.val()[user].neighborhood_id);
      }
    })
  }

  fetchClassInfo(neighborhood) {
    let classes = [];
    firebase.database().ref('classes')
    .orderByChild('neighborhood_id').equalTo(parseInt(neighborhood))
    .on("value", snap => {
      if (snap.val() != null) {
        Object.keys(snap.val()).forEach(classId => {
          let thisClass = snap.val()[classId];
          classes.push({
            classId: classId,
            name: thisClass.name,
            date: thisClass.date,
            day: thisClass.day,
            time: thisClass.time,
            duration: thisClass.duration,
            seats: thisClass.seats,
            vendor: thisClass.vendor,
            neighborhood: thisClass.neighborhood
          });
        });
      }
      this.setState({classes});
    })
  }

  handleReserve(classId) {
    firebase.database().ref("reservations").push().set({
      class_id: classId,
      customer_id: this.state.user,
    })
  }

  displayClasses() {
    let classes = [];
    this.state.classes.forEach(thisClass => {
      classes.push(
        <ClassInfo
          key={thisClass.classId}
          thisClass={thisClass}
          handleReserve={this.handleReserve} />
      )
    });
    return classes;
  }

  render() {
    let classes = this.displayClasses();
    return(
      <div className="page-container">
        <WelcomeHeader user={this.state.userInfo}/>
        <ul className="display-class-info">
          {classes}
        </ul>
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
