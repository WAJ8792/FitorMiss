import React from 'react';

import GymClass from './Classes';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Loading",
      classes: [],
      newClass: {
        seats: "",
        date: "",
        duration: 0,
        title: ""
      }
    }
    this.user_id = 1;
    this.classesRef = firebase.database().ref("classes");
    this.handleChange = this.handleChange.bind(this);
    this.handleNewClass = this.handleNewClass.bind(this);
  }

  componentWillMount() {
    this.classesRef.orderByChild("vendor_id").equalTo(this.user_id).on("child_added", snap => {
      let thisClass = snap.val();
      let newState = this.state;
      newState.classes.push({
        title: thisClass['title'],
        date: thisClass['date'],
        seats: thisClass['seats'],
        duration: thisClass['duration'],
      })
      this.setState({newState});
    });
  }

  handleNewClass(e) {
    e.preventDefault();
    let newClass = this.state.newClass;
    newClass['vendor_id'] = this.user_id;
    this.classesRef.push().set(newClass);
  }

  handleChange(e) {
    e.preventDefault();

    let newState = this.state;
    newState['newClass'][e.target.placeholder] = e.target.value;
    this.setState({newState});
  }

  render() {
    let username = test[0];
    let thisClass = this.state.class;
    let newClass = this.state.newClass;
    let classes = this.state.classes.map( gymClass =>
      <GymClass props={gymClass} />
      );
      console.log(this.state.classes);

    return(
      <div>
        {username}
          <div>
            <h3> Classes </h3>
              {classes}
              {this.state.classes}
          </div>

          <div>
            <form onSubmit={this.handleNewClass.bind(this)}>
              <input
                type="text"
                value={this.state.newClass.title}
                placeholder="title"
                onChange={e => this.handleChange(e)} /><br />
              <input
                type="text"
                value={this.state.newClass.date}
                placeholder="date"
                onChange={e => this.handleChange(e)} /><br />
              <input
                type="text"
                value={this.state.newClass.duration}
                placeholder="duration"
                onChange={e => this.handleChange(e)} /><br />
              <input
                type="text"
                value={this.state.newClass.seats}
                placeholder="seats"
                onChange={e => this.handleChange(e)} /><br />
              <input type="submit" />
            </form>
          </div>
      </div>
    )
  }
}
