import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from '../../../util/session_util';
import { getClassesByDay } from  '../../../util/classes_util';
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
      day: "Today",
      classes: [],
      errors: [],
      modal: null,
    }
    this.handleReserve = this.handleReserve.bind(this);
    this.isValidReservation = this.isValidReservation.bind(this);
    this.confirmReserve = this.confirmReserve.bind(this);
    this.cancelReserve = this.cancelReserve.bind(this);
  }

  componentDidMount() {
    let neighborhood = this.state.userInfo.neighborhood;
    this.getCurrentUser();
    if (neighborhood.length > 0) {
      this.fetchClassInfo(neighborhood);
    }
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
      this.setState({classes});
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
    this.state.classes.forEach(thisClass => {
      classes.push(
        <ClassInfo
          key={thisClass.id}
          thisClass={thisClass}
          day={this.state.day}
          handleReserve={this.handleReserve} />
      )
    });
    return classes;
  }

  updateDay(day) {
    this.setState({day});
  }

  render() {
    if (this.state.user === "") { return null; }
    let errors;
    let classes = this.displayClasses();

    if (classes.length < 1) {
      classes = <h4 id="no-classes">No upcoming classes today.</h4>
    } else {
      classes = this.displayClasses(classes);
    }


    if (this.state.errors.length > 0) {
      let errors = this.state.errors;
    }

    return(
      <div id="page-background">
      <div className="page-container">
        <section className="my-gym">

          {errors}
          {this.state.modal}

          <ul className="display-class-info">
            {classes}
          </ul>

        </section>
      </div>
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
