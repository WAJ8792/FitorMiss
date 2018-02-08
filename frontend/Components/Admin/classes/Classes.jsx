import React from 'react';

import AddClass from './AddClass';
import GymClass from './Class';
import ClassesList from './ClassesList';

export default class Classes extends React.Component {
  constructor() {
    super();
    this.state = {
      classes: [],
      user: "",
      userInfo: {},
      day: "Monday",
    }
    this.classesRef = firebase.database().ref("classes");
    this.saveChanges = this.saveChanges.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getUserInfo(user.uid);
        this.setState({ user: user.uid, loggedOut: false });
        this.populateClasses(user.uid);
      }
    });
  }

  getUserInfo(user) {
    firebase.database().ref('vendor')
    .orderByKey().equalTo(user).on('value', snap => {
      if (snap.val() != null)  {
        this.setState({userInfo: snap.val()[user]});
      }
    })
  }

  populateClasses(user) {
    this.classesRef.orderByChild("vendor_id").equalTo(user).on("child_added", snap => {
      this.addClassToList(snap.val(), snap.getRef().key);
    });

    this.classesRef.orderByChild("vendor_id").equalTo(user).on("child_removed", snap => {
      this.removeFromClassList(snap.getRef().key)
    });
  }

  addClassToList(thisClass, class_id) {
    let newState = this.state;

    newState.classes.push({
      class_id: class_id,
      name: thisClass.name,
      date: thisClass.date,
      day: thisClass.day,
      time: thisClass.time,
      duration: thisClass.duration,
      seats: thisClass.seats,
      type: 'read',
    });

    this.setState({classes: newState.classes});
  }

  removeFromClassList(class_id) {
    let classes = this.state.classes;

    for (let i = 0; i < classes.length; i++) {
      if (classes[i].class_id === class_id) {
        classes.splice(i, 1);
        break;
      }
    }
    this.setState({classes});
  }

  handleAdd(newClass) {
    let userInfo = this.state.userInfo;
    newClass.neighborhood = userInfo.neighborhood;
    newClass.neighborhood_id = 1;
    newClass.vendor = userInfo.gym_name;
    newClass.vendor_id = this.state.user;
    newClass.created_at = new Date().getTime();
    firebase.database().ref('classes/').push().set(newClass);
  }

  updateDay(day) {
    this.setState({day});
  }

   // getClass(thisClass) {
  //    let c = {
  //      vendor_id, thisClass.vendor_id,
  //      name, thisClass.name,
  //      date, thisClass.date,
  //      time, thisClass.time,
  //      duration, thisClass.duration,
  //      seats: thisClass.seats
  //   };
  //   return c;
  // }

  saveChanges(e, thisClass) {
    e.preventDefault();

    firebase.database().ref('classes' + thisClass.class_id)
      .set(this.getClass(thisClass));
  }

  render() {
    let day = this.state.day;
    let classes;

    if (this.state.classes.length > 0) {
      classes = [];
      this.state.classes.forEach( thisClass => {
        if (thisClass.day === day) {
          classes.push(<GymClass
            key={thisClass.class_id}
            props={thisClass}
            addClass={this.addClass}
            saveChanges={this.saveChanges}
             />)
        }
      });
    } else { classes = <h3>Loading your classes!</h3> }

    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map( day => {
      if (this.state.day === day) {
        return (
          <div className="day-selectors" style={{backgroundColor: "lightgray"}} key={day}>
            {day}
          </div>
        )
      } else {
        return(
          <div className="day-selectors" onClick={() => this.updateDay(day)} key={day}>
            {day}
          </div>
        )
      }
    })

    return(
      <div className="page-container">
        <section className="classes">
          <h1>Your Class Schedule</h1>

            <section style={{display: 'flex', width: '100%'}} >
              {days}
            </section>

            <span>
              {classes}
            </span>

          <AddClass handleAdd={ this.handleAdd.bind(this)} user={this.props.user.uid} />
      </section>
    </div>
    )
  }
}
