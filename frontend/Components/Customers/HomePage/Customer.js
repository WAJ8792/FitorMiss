import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from '../../../util/session_util';
import { getClassesByDay, filterClasses } from  '../../../util/classes_util';
import { getTime, getDayAndDate } from '../../../util/time_and_date_util'
import { maxOutClass, confirmReserve, confirmPayment, hitReserve } from  '../../../util/reservation_util';
import { getMBSchedule } from '../../../util/mindbody_util';
import { getDiscounts, getCodeUse } from '../../../util/discounts_util';

import ClassInfo from './DisplayClassInfo';
import ClassesSidebar from './ClassesSidebar';
import ConfirmReservation from './reservation_modal';
import ApplyDiscount from './discount_modal';

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
      discount: null,
      discountIds: [],
      discountName: null,
      errors: null,
      modal: null,
      fomSchedule: {},
      mindbodySchedule: {},
    }
    this.openModal = this.openModal.bind(this);
    this.isValidReservation = this.isValidReservation.bind(this);
    this.confirmReserve = this.confirmReserve.bind(this);
    this.cancelReserve = this.cancelReserve.bind(this);
    this.applyDiscount = this.applyDiscount.bind(this);
  }

  componentDidMount() {
    this.getCurrentUser();
    getDiscounts(firebase.database(), ids => (val, id) => {
      this.setState({
        discountIds: ids,
        discount: val,
        discountName: id,
      });
    })
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
      if (snap.val() != null) {
        const neighborhood = snap.val()[neighborhoodId];
        const info = {neighborhood, neighborhoodId}
        getMBSchedule(firebase.database(), info, mindbodySchedule => {
          this.setState({mindbodySchedule});
        })
        this.setState({neighborhood})
      }
    })
  }

  fetchFomSchedule(neighborhood) {
    firebase.database().ref('classes')
    .orderByChild('neighborhood_id').equalTo(parseInt(neighborhood))
    .on("value", snap => {
      if (snap.val() != null) {
        const fomSchedule = {}
        Object.keys(snap.val()).forEach(id => {
          if (!id.includes('mindbody')) {
            fomSchedule[id] = snap.val()[id];
          }
        })
        this.setState({fomSchedule});
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

    const resInfo = {
      user: this.state.user,
      thisClass: this.state.thisClass,
      userInfo: this.state.userInfo,
      discount: this.state.discountName
    }

    confirmReserve(firebase.database(), resInfo, () => {
      confirmPayment({
        customer: resInfo.userInfo.stripe_id,
        thisClass: resInfo.thisClass
      }, errors => { this.setState({errors})});
      hitReserve({
        userInfo: resInfo.userInfo,
        resInfo: {
          time: getTime(resInfo.thisClass.time),
          gymName: resInfo.thisClass.vendor,
          email: resInfo.thisClass.vendorEmail,
          name: resInfo.thisClass.name
        }
      });
      getCodeUse(
        firebase.database(),
        {uid: this.state.user, discountId: resInfo.discount},
        () => this.setState({discount: null, discountName: null})
      )
    });
    this.setState({modal: null});
  }

  cancelReserve() {
    let thisClass = this.state.thisClass;
    maxOutClass(firebase.database(), thisClass, "removeHold");
    this.setState({modal: null});
  }

  openModal(thisClass, modalType) {
    if (this.isValidReservation(thisClass) || modalType === 'info') {
      maxOutClass(firebase.database(), thisClass, "hold");

      this.setState({
        thisClass,
        errors: [],
        modal: <ConfirmReservation
          title={thisClass.name}
          type={modalType}
          thisClass={thisClass}
          cancelReserve={(type) => {
            if (type !== 'info') { this.cancelReserve() }
            this.setState({modal: null});
          }}
          confirmReserve={this.confirmReserve}/>
      });
    }
  }

  availableToUser = (id) => {
    return thisClass => {
      if (thisClass.seats === "0") { return false; }
      if (!thisClass.reservations || !thisClass.reservations[thisClass.date]) {
        return true;
      }

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
            discount={this.state.discount}
            openModal={this.openModal} />
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

  applyDiscount() {
    this.setState({
      modal: <ApplyDiscount
              uid={this.props.user.uid}
              discountIds={this.state.discountIds}
              confirmDiscount={(val) => this.setState({discount: val})}
              closeModal={() => this.setState({modal: null})}/>
    });
  }

  getDiscount() {

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

    const applyDiscount = (this.state.discount)
    ? <span>Your %{this.state.discount * 100} discount has been applied to all class totals.</span>
    : <span onClick={this.applyDiscount}>Have a discount code?</span>

    return(
      <div id="page-background">
        <div className="page-container">
          <div className="page-detail">
            <div id="upcoming-classes-page">
              <br />
              <h1 id="classes-header">
                {applyDiscount}
                <span>
                  {`${dayAndDate.day}, ${dayAndDate.month} ${dayAndDate.date}`}
                </span>
              </h1>
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

const mapStateToProps = ( state ) => {
  return {
    user: state.sessions.user,
    filters: state.filters
  }
}

export default withRouter(connect(
  mapStateToProps
)(CustomerPage))
