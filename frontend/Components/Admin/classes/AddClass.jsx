import React from 'react';


import { getTime } from '../../../util/classes_util';

export default class AddClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thisClass: {
        vendor_id: "",
        name: "",
        time: "1:00 PM",
        duration: {
          hours: "",
          min: ""
        },
        day: "-",
        seats: null,
        type: "cardio",
        max: false,
      },
      errors: [],
      edit: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.app = firebase.database();
  }

  componentWillMount() {
    if (this.props.thisClass) {
      const thisClass = this.props.thisClass;
      this.setState({
        thisClass,
        edit: true
      })
    }
  }

  handleChange(e, field) {
    if (field === 'time' || field === 'day') {
      this.setState({
        thisClass: {
          ...this.state.thisClass,
          [field]: e.target.value,
        },
        updateRes: true
      })
    } else {
      let value;
      if (field === "seats") {
        value = e.target.value
      } else {
        value = e.target.value;
       }
    this.setState({
      thisClass: {
        ...this.state.thisClass,
        [field]: value
      }
      })
    }
  }

  handleDurationChange(e, field) {
    let duration = this.state.thisClass.duration;
    console.log(duration[field], e.target.value);
    duration[field] = e.target.value;
    this.setState({
      thisClass: {
        ...this.state.thisClass,
        duration,
      },
      updateRes: true
    });
  }

  checkValidInput() {
    let errors = [];
    let state = this.state.thisClass;
    if (state.name.length < 1) { errors.push("Please enter a valid class name."); }
    if (state.time.length < 1) { errors.push("Please choose a valid time."); }
    if (0 >= parseInt(state.duration)) { errors.push("Please enter a duration above 0.")}
    if (!state.day.includes("day")) { errors.push("Please choose a valid day."); }
    if (0 >= parseInt(state.seats)) { errors.push("Please enter an availability number greate than 0 under 'seats'"); }
    let length = state.duration.hours + state.duration.min;
    if (length < 1) { errors.push("Please add a class duration.")}

    if (errors.length < 1) { return true; }
    else {
      this.setState({errors});
      return false;
    }
  }

  handleAdd() {
    if (this.checkValidInput()) {
      this.props.handleAdd(this.state.thisClass)
      this.setState({
        thisClass: {
          vendor_id: "",
          name: "",
          time: "1:00 PM",
          duration: {
            hours: "",
            min: ""
          },
          day: "-",
          seats: null,
          type: "cardio",
          max: false,
        }
      });
    }
  }

  updateRes(resId) {
    const time = this.state.thisClass.time
    console.log(resId);
    this.app.ref('reservations/' + resId + '/time').set(time);
    // this.app.ref('reservations/' + resId + '/day').set(this.state.day);
    // this.app.ref('reservations/' + resId + '/time').set(this.state.duration);
  }

  getReservations() {
    this.app.ref('reservations').orderByChild('class_id')
      .equalTo(this.state.thisClass.class_id).once('value', snap => {
        if (snap.val() != null) {
          Object.keys(snap.val()).forEach(resId => {
            this.updateRes(resId);
          });
        }
        this.setState({updateRes: false});
      });
  }

  saveChanges(e) {
    e.preventDefault();

    if (this.state.updateRes === true) {
      this.getReservations();
    }

    this.props.saveChanges(this.state.thisClass);
  }

  getTimes() {
    let times = [];
    for (let i = 0; i < 24; i++) {
      let time;
      if (i === 0) {
        time = "12:";
      } else if (i < 10) {
        time = '0' + i.toString() + ':';
      } else {
        time = i.toString() + ':';
      }
      for (let j = 0; j < 4; j++) {
        if (j === 0) {
          times.push(<option
            key={time+j+i}
            value={time + '00'}
            >{ getTime(time + '00')}</option>);
        } else {
          let min = j * 15;
          times.push(<option
            key={time+j+i}
            value={time + min.toString()}
            >{ getTime(time + min.toString())}</option>);
        }
      }
    }
    return times;
  }

  render() {
    let error, errors, state
    let times = this.getTimes();
    let thisClass = this.state.thisClass;

    const button = (this.state.edit)
      ? <button onClick={e => this.saveChanges(e)}>Save Changes</button>
      : <button onClick={e => this.handleAdd(e)}>Add Class</button>

    if (this.props.error.length > 0) {
      error = this.reportError();
    }
    if (this.state.errors.length > 0) {
      errors = this.state.errors;
    }
    // <div>
    //   <h1 onClick={e => this.props.removeModal(e)}>X</h1>
    //   </div>

    return(
      <div className="add-class">
        <div className="add-class-modal">
          <section>
            <div>
              <p>Class Title</p>
              <input
                type="text"
                onChange={e => this.handleChange(e, 'name')}
                value={thisClass.name}/>
            </div>

            <div>
              <p>Day</p>
              <select
                onChange={e => this.handleChange(e, 'day')}
                value={thisClass.day}>
                <option>-</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>
            </div>

            <div>
              <p>Time</p>
              <select
                type="time"
                onChange={e => this.handleChange(e, 'time')}
                value={thisClass.time} >
                {times}
              </select>
            </div>

            <div className="duration-inputs">
              <p>Duration</p>
              <section>
                <input
                  type="text"
                  onChange={e => this.handleDurationChange(e, 'hours')}
                  value={thisClass.duration.hours}
                  placeholder="Hours" />

                <input
                  type="text"
                  onChange={e => this.handleDurationChange(e, 'min')}
                  value={thisClass.duration.min}
                  placeholder="Minutes" />
              </section>
            </div>

            <div>
              <p>Total Seats</p>
                <input
                  type="text"
                  onChange={e => this.handleChange(e, 'seats')}
                  value={thisClass.seats}/>
            </div>

            <div>
              <p>Workout Type</p>
                <select
                  onChange={e => this.handleChange(e, 'type')}
                  value={thisClass.type}>
                  <option>Cardio</option>
                  <option>Boxing</option>
                  <option>Rowing</option>
                  <option>Yoga</option>
                  <option>Pilates</option>
                </select>
            </div>
          </section>

          <div className="errors">
            {error}
            {errors}
          </div>

          <div className="class-button">
            <button
              className="class-cancel-button"
              onClick={e => this.props.removeModal(e)}>
              Cancel</button>
            {button}
          </div>
        </div>
      </div>
    )
  }
}
