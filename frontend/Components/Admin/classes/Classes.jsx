import React from 'react';

import AddClass from './AddClass';
import GymClass from './Class';

export default class Classes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      user: "",
      userInfo: {},
      day: "Monday",
      modal: null,
    }
    this.classesRef = firebase.database().ref("classes");
    this.saveChanges = this.saveChanges.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.getClass = this.getClass.bind(this);
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

  getAmenities(user) {
    let userInfo = this.state.userInfo;
    firebase.database().ref("amenities")
    .orderByChild("vendor_id").equalTo(user).on('value', snap => {
      if (snap.val() != null) {
        userInfo.amenities = Object.values(snap.val())[0];
        this.setState({userInfo});
      }
    })
  }

  getUserInfo(user) {
    firebase.database().ref('vendor')
    .orderByKey().equalTo(user).on('value', snap => {
      if (snap.val() != null)  {
        this.setState({userInfo: snap.val()[user]});
        this.getAmenities(user);
      }
    })
  }

  removeModal(e) {
    e.preventDefault();

    this.setState({modal: null});
  }

  populateClasses(user) {
    this.setState({classes: []});
    this.classesRef.orderByChild("vendor_id").equalTo(user).on("child_added", snap => {
      this.addClassToList(snap.val(), snap.getRef().key);
    });
    // this.classesRef.orderByChild("vendor_id").equalTo(user).on("child_changed", snap => {
    //   this.setState({classes: []});
    //   this.addClassToList(snap.val(), snap.getRef().key);
    // });

    this.classesRef.orderByChild("vendor_id").equalTo(user).on("child_removed", snap => {
      this.removeFromClassList(snap.getRef().key)
    });
  }

  addClassToList(thisClass, class_id) {
    let newState = this.state;

    newState.classes.push({
      class_id: class_id,
      name: thisClass.name,
      day: thisClass.day,
      time: thisClass.time,
      duration: thisClass.duration,
      seats: thisClass.seats,
      functionality: 'read',
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
    newClass.amenities = userInfo.amenities;
    newClass.vendor = userInfo.gym_name;
    newClass.vendor_id = this.state.user;
    newClass.created_at = new Date().getTime();
    this.props.addClass(newClass, app);
  }

  updateDay(day) {
    this.setState({day});
  }

   getClass(thisClass) {
     let userInfo = this.state.userInfo;
     let c = {
       vendor_id: this.state.user,
       neighborhood: userInfo.neighborhood,
       neighborhood_id: 1,
       vendor: userInfo.gym_name,
       updated_at: new Date().getTime(),
       name: thisClass.name,
       day: thisClass.day,
       time: thisClass.time,
       duration: thisClass.duration,
       seats: thisClass.seats
    };
    return c;
  }

  saveChanges(thisClass) {
    firebase.database().ref('classes/' + thisClass.class_id)
      .set(this.getClass(thisClass));
  }

  openModal(thisClass) {
    this.setState({
      modal: <AddClass
        handleAdd={this.handleAdd.bind(this)}
        saveChanges={this.saveChanges.bind(this)}
        user={this.props.user.uid}
        thisClass={thisClass}
        removeModal={this.removeModal.bind(this)}
        error={this.props.classes.error} />
    });
  }

  render() {
    let day = this.state.day;
    let classes;
    let modal = this.state.modal;

    if (this.state.classes.length > 0) {
      classes = [];
      this.state.classes.forEach( thisClass => {
        if (thisClass.day === day) {
          classes.push(<GymClass
            key={thisClass.class_id}
            props={thisClass}
            openModal={this.openModal.bind(this)}
            addClass={this.addClass}
            saveChanges={this.saveChanges}
             />);
        }
      });
    } else { classes = <div className="class-list-message">You do not have any classes yet.</div>; }
    if (classes.length < 1) {
      classes = <div className="class-list-message">You do not have any classes for this day.</div>;
    }

    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map( day => {
      if (this.state.day === day) {
        return (
          <div className="day-selectors" style={{backgroundColor: "#1fc8aa"}} key={day}>
            {day}
          </div>
        );
      } else {
        return(
          <div className="day-selectors"
            style={{
              backgroundColor: '#eaf8f7',
              color: 'black'
            }}
            onClick={() => this.updateDay(day)} key={day}>
            {day}
          </div>
        );
      }
    });

    return(
      <div id="page-background">
        {modal}
        <div className="page-container">
          <section className="class-list">
            <div
              className="class-list-add-class"
              onClick={() => this.openModal(false)}>
              Add a class
            </div>
            <div className="class-list-header">Your Class Schedule</div>

                <section className="class-list-days" >
                  {days}
                </section>
                <div className="class-list-bar" />

                <span>
                  {classes}
                </span>


        </section>
      </div>
    </div>
  );
  }
}
