import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from '../../../util/session_util';
import { orderClassesByDate, getClassesByDay } from  '../../../util/classes_util';

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
      todaysClasses: [],
      tomorrowsClasses: [],
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
        classes = getClassesByDay(snap.val());
      }
      this.setState({
        todaysClasses: classes.today,
        tomorrowsClasses: classes.tomorrow,
      });
    })
  }

  handleReserve(thisClass) {
    firebase.database().ref("reservations").push().set({
      class_id: thisClass.id,
      customer_id: this.state.user,
      date: thisClass.date,
      time: thisClass.time,
      created_at: new Data().getTime(),
    })
  }

  displayClasses(classList) {
    let classes = [];
    classList.forEach(thisClass => {
      classes.push(
        <ClassInfo
          key={thisClass.id}
          thisClass={thisClass}
          handleReserve={this.handleReserve} />
      )
    });
    return classes;
  }

  render() {
    let todaysClasses = this.state.todaysClasses;
    let tomorrowsClasses = this.state.tomorrowsClasses;

    if (todaysClasses.length > 0) {
      todaysClasses = this.displayClasses(todaysClasses);
    } if (tomorrowsClasses.length > 0) {
      tomorrowsClasses = this.displayClasses(tomorrowsClasses);
    }
    return(
      <div className="page-container">
        <WelcomeHeader user={this.state.userInfo}/>
        <ul className="display-class-info">
          <h4 className="day-label">Today</h4>
          {todaysClasses}
          <h4 className="day-label">Tomorrow</h4>
          {tomorrowsClasses}
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
