import React from 'react';

import ClassInfo from './Users_Class';
import { orderClassesByDate } from '../../../util/classes_util';

export default class ClassList extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      upcomingClasses: [],
      pastClasses: [],
      pricing_schema: [],
      upcoming: "selected",
      past: "unselected"
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
    let classes;
    firebase.database().ref('reservations')
    .orderByChild('customer_id').equalTo(user).on('value', snap => {
      if (snap.val() != null) {
        classes = orderClassesByDate(snap.val());
      }
      this.setState({
        upcomingClasses: classes.upcomingList,
        pastClasses: classes.pastList
      });
    })
  }

  toggleSelectors(selector) {
    if (this.state[selector] === "unselected") {
      this.toggle("upcoming");
      this.toggle("past");
    }
  }

  toggle(selector) {
    if (this.state[selector] === "unselected") {
      this.setState({[selector]: "selected"});
    } else { this.setState({[selector]: "unselected"})}
  }

  listClasses(classes) {
    return this.state[classes].map(thisClass =>
      <ClassInfo key={thisClass.id} thisClass={thisClass} />
    )
  }

  render() {
    let classes = (this.state.upcoming === "selected")
      ? this.listClasses("upcomingClasses")
      : this.listClasses("pastClasses")
    let state = this.state;
    if (classes.length < 1) {
      classes = <div id="no-classes">You have no upcoming classes.
      Click 'Classes' above to view available classes in your area!</div>
    }
    return(
      <div id="page-background">
        <div className="page-container">
          <div className="page-detail">
            <div id="classes-page">

              <div id="class-module">
                <div className="class-module-buttons">
                  <button
                    className={`customer-classes-${state.upcoming}`}
                    onClick={() => this.toggleSelectors("upcoming")}>
                    Upcoming Classes
                  </button>
                  <button
                    className={`customer-classes-${state.past}`}
                    onClick={() => this.toggleSelectors("past")}>
                    Past Classes
                  </button>
                </div>

                <hr className="classes-hr" />

                <div className="class-module-classes">
                  {classes}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

<div id="summary-and-benefits">
  <div className="summary">
    <div className="box-header">
      Summary
    </div>

    <div className="box-content">
      <p>21</p> classes completed
    </div>

  </div>

  <div className="benefits">
    <div className="box-header">
      Benefit Box
    </div>

    <div className="box-content">
      <p>$140</p> saved
    </div>
  </div>
</div>
