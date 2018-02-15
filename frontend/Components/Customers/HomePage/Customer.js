import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from '../../../util/session_util';
import { orderClassesByDate, getClassesByDay } from  '../../../util/classes_util';
import { holdSeat } from  '../../../util/reservation_util';

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
      errors: [],
      modal: null,
    }
    this.getCurrentUser();
    this.handleReserve = this.handleReserve.bind(this);
    this.isValidReservation = this.isValidReservation.bind(this);
    this.confirmReserve = this.confirmReserve.bind(this);
    this.cancelReserve = this.cancelReserve.bind(this);
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

  isValidReservation(thisClass) {
    let errors = [];
    if (thisClass.id.length < 1) { errors.push("This class is not available.")}
    if (this.state.user.length < 1) { errors.push("Something is wrong with your registration. Please try signing out and try again.")}
    if (thisClass.date.length != 11) {
      errors.push("This class is unavailable.")
      console.log("The date for this class is not valid");
    }
    if (thisClass.time.length < 1) {
      errors.push("This class is unavailable.")
      console.log("The time for this class is not valid");
    }
    if (thisClass.seats_available < 1) {
      errors.push("There no longer seats available for this class.");
    }

    if (errors.length < 1) { return true; }
    else {
      this.setState({errors});
      return false;
    }
  }

  confirmReserve(e) {
    e.preventDefault();

    let thisClass = this.state.thisClass;
    firebase.database().ref("reservations").push().set({
      class_id: thisClass.id,
      customer_id: this.state.user,
      date: thisClass.date,
      time: thisClass.time,
      created_at: new Date().getTime(),
    });
    this.setState({modal: null});
  }

  cancelReserve(e) {
    e.preventDefault();

    let thisClass = this.state.thisClass;
    holdSeat(thisClass.id, thisClass.seats_available, "removeHold", app);
    this.setState({modal: null});
  }

  handleReserve(thisClass) {
    if (this.isValidReservation(thisClass)) {
      holdSeat(thisClass.id, thisClass.seats_available, "hold", app);

      this.setState({
        thisClass,
        errors: [],
        modal: <ConfirmReservation
          cancelReserve={this.cancelReserve}
          confirmReserve={this.confirmReserve}/>
      });
    }
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
    let errors;
    let todaysClasses = this.state.todaysClasses;
    let tomorrowsClasses = this.state.tomorrowsClasses;

    if (todaysClasses.length > 0) {
      todaysClasses = this.displayClasses(todaysClasses);
    } if (tomorrowsClasses.length > 0) {
      tomorrowsClasses = this.displayClasses(tomorrowsClasses);
    }

    if (this.state.errors.length > 0) {
      let errors = this.state.errors;
    }

    return(
      <div id="page-container">
      <div className="page-container">
        <WelcomeHeader user={this.state.userInfo}/>
        {errors}
        {this.state.modal}
        <ul className="display-class-info">
          <h4 className="day-label">Today</h4>
          {todaysClasses}
          <h4 className="day-label">Tomorrow</h4>
          {tomorrowsClasses}
        </ul>
      </div>
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

class ConfirmReservation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="confirmation">
        <div>
          <h2>Are you sure you want to reserve this class?</h2>
          <p>class info here</p>
          <button onClick={e => this.props.confirmReserve(e)}>
          RESERVE
          </button>
          <button onClick={e => this.props.cancelReserve(e)}>X</button>
        </div>
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
