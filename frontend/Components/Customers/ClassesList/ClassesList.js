import React from 'react';

import ClassInfo from './Users_Class';
import { orderClassesByDate } from '../../../util/classes_util';

export default class ClassList extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      classes: []
    }
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid, loggedOut: false });
        this.fetchClasses(this.state.user);
      }
    });
  }

  fetchClasses(user) {
    let classes = [];
    firebase.database().ref('reservations')
    .orderByChild('customer_id').equalTo(user).on('value', snap => {
      if (snap.val() != null) {
        // Object.keys(snap.val()).forEach(reservation => {
        //   classes.push(snap.val()[reservation].class_id);
        // });
        classes = orderClassesByDate(snap.val());
      }
      this.setState({classes});
    })
  }

  listClasses() {
    return this.state.classes.map(thisClass =>
      <ClassInfo key={thisClass.id} thisClass={thisClass} />
    )
  }

  render() {
    let classes = this.listClasses();
    return(
      <div id="page-container">
      <div className="page-container">
        <h1>Your upcoming class reservations:</h1>
        <ul className="display-class-info">
          {classes}
        </ul>
      </div>
      </div>
    )
  }
}
