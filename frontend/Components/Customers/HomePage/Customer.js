import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from '../../../util/session_util';
import { getClassesByDay, filterClasses, getTime } from  '../../../util/classes_util';
import { maxOutClass, confirmReserve, hitReserve } from  '../../../util/reservation_util';

import ClassInfo from './DisplayClassInfo';
import ClassFilters from './Filters';
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
        this.fetchNeighborhood(snap.val()[user].neighborhood_id);
      }
    })
  }

  fetchNeighborhood(neighborhoodId) {
    firebase.database().ref('neighborhoods')
    .orderByKey().equalTo(neighborhoodId).on("value", snap => {
      this.setState({neighborhood: snap.val()[neighborhoodId]})
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
    if (confirmPayment({stripe_id, thisClass})) {
      confirmReserve(firebase.database(), thisClass);
      hitReserve({
        userInfo: this.state.userInfo,
        resInfo: {
          time: getTime(thisClass.time),
          gymName: thisClass.vendor,
          email: thisClass.vendorEmail,
          name: thisClass.name
        }
      })
    }
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
          cancelReserve={this.cancelReserve}
          confirmReserve={this.confirmReserve}/>
      });
    }
  }

  displayClasses(classList) {
    let classes = [];
    let filter = this.state.typeFilter;
    this.state.classes.forEach(thisClass => {
      if (filter === false || thisClass.type === filter) {
        classes.push(
          <ClassInfo
          key={thisClass.id}
          thisClass={thisClass}
          handleReserve={this.handleReserve} />
        )
      }
    });
    return classes;
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
    let errors;
    let classes = this.displayClasses();
    classes = filterClasses(classes, this.props.filters);

    if (classes.length < 1) {
      classes = <h4 id="no-classes">No upcoming classes today.</h4>
    }

    if (this.state.errors.length > 0) {
      let errors = this.state.errors;
    }

    return(
      <div id="page-background">
        <div className="page-container">
          <div className="page-detail">
            <div id="upcoming-classes-page">
              <h1>{this.state.neighborhood}</h1>
              <br />

              {errors}
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
// <ClassFilters
// typeFilter={this.state.typeFilter}
// changeType={this.changeType.bind(this)} />

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
    filters: state.filters
  }
}

export default withRouter(connect(
  mapStateToProps
)(CustomerPage))
