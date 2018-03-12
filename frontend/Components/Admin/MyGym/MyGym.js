import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

import { isThisMonth } from '../../../util/classes_util';

class MyGym extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      amenities: [],
      totalReservations: 0,
    }
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid, loggedOut: false });
        this.fetchUserInfo(user.uid);
        this.getClasses(user.uid);
        this.getUserType(user.uid);
      }
    });
  }

  getUserType(user) {
    firebase.database().ref('user_type')
    .orderByKey().equalTo(user).on('value', snap => {
        this.setState({type: snap.val()[user]});
      })
  }

  fetchUserInfo(user) {
    let gymName, neighborhood, amenities, amenityKey

    firebase.database().ref("vendor").orderByKey().equalTo(user).on("value", snap => {
      gymName = snap.val()[user].gym_name;
      neighborhood = snap.val()[user].neighborhood;
      this.setState({gymName, neighborhood});
    })
  }

  getClasses(user) {
    firebase.database().ref("classes")
    .orderByChild("vendor_id").equalTo(user).on("value", snap => {
      this.getReservations(snap.val())
    })
  }

  getReservations(classes) {
    let totalReservations = 0;

    Object.keys(classes).forEach(classId => {
      const thisClass = classes[classId];
      if (thisClass.reservations) {
        Object.keys(thisClass.reservations).forEach(date => {
          if (isThisMonth(date)) {
            totalReservations += Object.keys(thisClass.reservations[date]).length
          }
        })
      }
    })
    this.setState({totalReservations})
  }

  render() {

    if (!this.state.gymName) {
      return (<h1>Loading . . .</h1>)
    } else {

      return (
        <div id="page-background">
        <div className="page-container">
          <section className="my-gym">

          <section>
            <Note
              title="Users"
              stat={this.state.totalReservations}
              note="Users  are registered for a class this month!" />
            </section>
          </section>
        </div>
        </div>
      )
    }
  }
}

class Note extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="note">
        <div className="note-header">
          {this.props.title}
        </div>
        <div className="note-text">
          <p>{this.props.stat} </p>
          {this.props.note}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {
    user: state.sessions.user,

  }
}

export default withRouter(connect(
  mapStateToProps, null
)(MyGym));
