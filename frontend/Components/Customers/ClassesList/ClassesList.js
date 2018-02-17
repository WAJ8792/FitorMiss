import React from 'react';

import ClassInfo from './Users_Class';
import { orderClassesByDate } from '../../../util/classes_util';

export default class ClassList extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      classes: [],
      pricing_schema: [],
    }
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid, loggedOut: false });
        this.fetchClasses(this.state.user);
        this.fetchPriceInfo(this.state.user);
      }
    });
  }

  fetchPriceInfo(user) {
    let pricing_schema;
    firebase.database().ref('pricing_schemas')
    .orderByChild('vendor_id').equalTo(user).on('value', snap => {
      if (snap.val() != null) {
        pricing_schema = snap.val();
      }
      this.setState({pricing_schema});
    });
  }

  fetchClasses(user) {
    let classes = [];
    firebase.database().ref('reservations')
    .orderByChild('customer_id').equalTo(user).on('value', snap => {
      if (snap.val() != null) {
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
      <div id="page-background">
      <div className="page-container">
        <section className="my-gym">

          <h1>Your upcoming class reservations</h1>
          <ul className="display-class-info">
            {classes}
          </ul>

        </section>
      </div>
      </div>
    )
  }
}
