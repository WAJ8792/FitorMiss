import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from '../../../util/session_util';
import { getClassesByDay, filterClasses } from  '../../../util/classes_util';
import { getTime, getDayAndDate } from '../../../util/time_and_date_util'
import { maxOutClass, confirmReserve, confirmPayment, hitReserve } from  '../../../util/reservation_util';
import { getMBSchedule } from '../../../util/mindbody_util';

import ClassInfo from './DisplayClassInfo';
import ClassesSidebar from './ClassesSidebar';

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
      typeFilter: false,
      amenityFilter: false,
      errors: null,
      modal: null,
      fomSchedule: {},
      mindbodySchedule: {},
    }
    this.handleReserve = this.handleReserve.bind(this);
    this.isValidReservation = this.isValidReservation.bind(this);
    this.confirmReserve = this.confirmReserve.bind(this);
    this.cancelReserve = this.cancelReserve.bind(this);
  }

  componentDidMount() {
    this.getCurrentUser();
    getMBSchedule( (mindbodySchedule) => {
      this.setState({mindbodySchedule});
    });
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
        this.fetchFomSchedule(snap.val()[user].neighborhood_id);
        this.fetchNeighborhood(snap.val()[user].neighborhood_id);
      }
    })
  }

  fetchNeighborhood(neighborhoodId) {
    neighborhoodId = neighborhoodId.toString();
    firebase.database().ref('neighborhoods')
    .orderByKey().equalTo(neighborhoodId).on("value", snap => {
      this.setState({neighborhood: snap.val()[neighborhoodId]})
    })
  }

  fetchFomSchedule(neighborhood) {
    firebase.database().ref('classes')
    .orderByChild('neighborhood_id').equalTo(parseInt(neighborhood))
    .on("value", snap => {
      if (snap.val() != null) {
        this.setState({fomSchedule: snap.val()});
      }
    })
  }

  isValidReservation(thisClass) {
    let errors = [];

    if (!this.state.userInfo.stripe_id) {
      errors.push("To reserve a class a credit card must be registered with your account. Add a credit card by clicking 'Billing' above.");
    }
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
    if (thisClass.max) {
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
    thisClass.user = this.state.user;
    const customer = this.state.userInfo.stripe_id;
    // remember to add '00' to price since Stripe takes money in cents
    // That should happen in the controller.
    // const amount = '00';
    const amount = parseInt(this.state.thisClass.price + '00');
    confirmPayment({customer, amount}, () => {
      confirmReserve(firebase.database(), thisClass, this.state.user);
      hitReserve({
        userInfo: this.state.userInfo,
        resInfo: {
          time: getTime(thisClass.time),
          gymName: thisClass.vendor,
          email: thisClass.vendorEmail,
          name: thisClass.name
        }
      })
    });
    this.setState({modal: null});
  }

  cancelReserve(e) {
    e.preventDefault();

    let thisClass = this.state.thisClass;
    maxOutClass(firebase.database(), thisClass, "removeHold");
    this.setState({modal: null});
  }

  handleReserve(thisClass) {
    if (this.isValidReservation(thisClass)) {
      maxOutClass(firebase.database(), thisClass, "hold");

      this.setState({
        thisClass,
        errors: [],
        modal: <ConfirmReservation
          title={thisClass.name}
          thisClass={thisClass}
          cancelReserve={this.cancelReserve}
          confirmReserve={this.confirmReserve}/>
      });
    }
  }

  availableToUser = (id) => {
    return thisClass => {
      if (!thisClass.reservations) { return true; }

      const upcomingRes = Object.keys(thisClass.reservations[thisClass.date]);
      if (upcomingRes.length >= thisClass.seats || upcomingRes.includes(id)) {
        return false;
      } else { return true; }
    }
  }

  displayClasses() {
    const mergedSchedule = Object.assign(
      {}, this.state.fomSchedule, this.state.mindbodySchedule
    )
    const classes = getClassesByDay(mergedSchedule, this.availableToUser(this.state.user));
    const classViews = [];

    let filter = this.state.typeFilter;
    classes.forEach(thisClass => {
      if (filter === false || thisClass.type === filter) {
        classViews.push(
          <ClassInfo
          key={thisClass.id}
          thisClass={thisClass}
          handleReserve={this.handleReserve} />
        )
      }
    });
    return classViews;
  }

  updateDay(day) {
    this.setState({day});
  }

  changeType(e) {
    e.preventDefault();
    let typeFilter = (e.target.value === "No Filter") ? false : e.target.value
    this.setState({typeFilter});
  }

  render() {
    if (this.state.user === "") { return null; }
    const errors = this.state.errors;
    const dayAndDate = getDayAndDate();
    let classes = this.displayClasses();
    classes = filterClasses(classes, this.props.filters);

    if (classes.length < 1) {
      classes = <div id="loading-classes">Looking for classes in your area.</div>
    }

    return(
      <div id="page-background">
        <div className="page-container">
          <div className="page-detail">
            <div id="upcoming-classes-page">
              <br />
              <h1 id="classes-header">{`${dayAndDate.day}, ${dayAndDate.month} ${dayAndDate.date}`}</h1>
              <p id="reservation-errors">{errors}</p>

              {this.state.modal}

              <ul className="display-class-info">
                {classes}
              </ul>

            </div>
          </div>
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
    const thisClass = this.props.thisClass;
    const seats = parseInt(thisClass.seats);
    const p1 = {fontSize: '20px', marginBottom: '10px'}
    const p2 = {fontSize: '17px', margin: '5px'}
    const p3 = {fontSize: '17px', margin: '0px'}
    const seatsLeft = (thisClass.reservations)
    ? seats - Object.keys(thisClass.reservations[thisClass.date]).length
    : seats
    return (
      <div className="add-class">
        <div className="reservation-modal">
          <div>
            <h2>Are you sure you want to reserve {thisClass.name}?</h2>
            <p style={p1}>{thisClass.day}, {thisClass.date} at {getTime(thisClass.time)}</p>
            <p style={p2}>In {thisClass.neighborhood} with {thisClass.vendor}</p>
            <p style={p3}>Only {seatsLeft} seats left!</p>
          </div>

          <div className="class-buttons">
            <button onClick={e => this.props.cancelReserve(e)}
              className="class-cancel-button">
              Cancel
            </button>
            <button onClick={e => this.props.confirmReserve(e)}
              style={{marginLeft: '50px'}}>
              RESERVE
            </button>
          </div>

        </div>
      </div>
    )
  }
}

const mapStateToProps = ( state ) => {
  return {
    user: state.sessions.user,
    filters: state.filters
  }
}

export default withRouter(connect(
  mapStateToProps
)(CustomerPage))
