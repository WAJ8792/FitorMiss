import React from 'react';

import AddClass from './AddClass';
import GymClass from './Class';

export default class Classes extends React.Component {
  constructor() {
    super();
    this.state = {
      classes: [],
    }
    this.user_id = "4";
    this.classesRef = firebase.database().ref("classes");
    this.populateClasses = this.populateClasses.bind(this);
    this.populateClasses();
  }

  componentDidMount() {
    this.setState({user: this.props.user});
  }

  populateClasses() {
    this.classesRef.orderByChild("vendor_id").equalTo(this.user_id).on("child_added", snap => {
      this.addClassToList(snap.val(), snap.getRef().key);
    });

    this.classesRef.orderByChild("vendor_id").equalTo(this.user_id).on("child_removed", snap => {
      this.removeFromClassList(snap.getRef().key)
    });
  }

  addClassToList(thisClass, key) {
    let newState = this.state;

    newState.classes.push({
      key: key,
      name: thisClass.name,
      date: thisClass.date,
      time: thisClass.time,
      duration: thisClass.duration,
      seats: thisClass.seats,
    });

    this.setState({classes: newState.classes});
  }

  removeFromClassList(classId) {
    let classes = this.state.classes;

    for (let i = 0; i < classes.length; i++) {
      if (classes[i].key === classId) {
        classes.splice(i, 1);
        break;
      }
    }
    this.setState({classes});
  }


  handleAdd(newClass) {
    firebase.database().ref('classes/').push().set(newClass);
  }

  render() {
    console.log(this.state.user);
    let classes;

    if (this.state.classes.length > 0) {
      classes = [];
      this.state.classes.forEach( thisClass => {
        classes.push(<GymClass
          props={thisClass}
          addClass={this.addClass}
          key={thisClass.key} />)
      });
    } else { classes = <h3>You have no classes</h3> }

    return(
      <section className="classes">
        <div>
          <h1>Your Classes</h1>

          <span>
            {classes}
          </span>

          <AddClass handleAdd={ this.handleAdd.bind(this) }/>
      </div>
      </section>
    )
  }
}
