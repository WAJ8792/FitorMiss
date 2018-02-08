import React from 'react';

import { getTime } from '../../../util/classes_util';

export default class AddClass extends React.Component {
  constructor() {
    super();
    this.state = {
      vendor_id: "",
      name: "",
      time: "1:00 PM",
      duration: "",
      day: "-",
      seats: "",
      errors: [],
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, field) {
    this.setState({[field]: e.target.value});
  }

  checkValidInput() {
    let errors = [];
    let state = this.state;
    if (state.name.length < 1) { errors.push("Please enter a valid class name."); }
    if (state.time.length < 1) { errors.push("Please choose a valid time."); }
    if (0 >= parseInt(state.duration)) { errors.push("Please enter a duration above 0.")}
    if (!state.day.includes("day")) { errors.push("Please choose a valid day."); }
    if (0 >= parseInt(state.seats)) { errors.push("Please enter an availability number greate than 0 under 'seats'"); }

    if (errors.length < 1) { return true; }
    else {
      this.setState({errors});
      return false;
    }
  }

  handleAdd() {
    if (this.checkValidInput()) {
      this.props.handleAdd(this.state)
      this.setState({
        name: "",
        time: "1:00 PM",
        duration: "",
        seats: "",
        errors: [],
      });
    }
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
          times.push(<option key={time+j+i}>{ getTime(time + '00')}</option>);
        } else {
          let min = j * 15;
          times.push(<option key={time+j+i}>{ getTime(time + min.toString())}</option>);
        }
      }
    }
    return times;
  }

  render() {
    let error;
    let errors;
    let times = this.getTimes();

    if (this.props.error.length > 0) {
      error = this.reportError();
    }
    if (this.state.errors.length > 0) {
      errors = this.state.errors;
    }

    return(
      <div className="add-class">
        <section style={{backgroundColor: "#f2f2f2"}}>
          <div>
            <p>Class Title</p>
            <input
              type="text"
              onChange={e => this.handleChange(e, 'name')}
              value={this.state.name}/>
          </div>

          <div>
            <p>Day</p>
            <select
              onChange={e => this.handleChange(e, 'day')}
              value={this.state.day}>
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
              value={this.state.time} >
              {times}
            </select>
          </div>

          <div>
            <p>Duration</p>
            <input
              type="number"
              onChange={e => this.handleChange(e, 'duration')}
              value={this.state.duration}/>
          </div>

          <div>
            <p>Total Seats</p>
            <input
              type="number"
              onChange={e => this.handleChange(e, 'seats')}
              value={this.state.seats}/>
          </div>
        </section>

        <span>
          {error}
          {errors}
          <button onClick={e => this.handleAdd(e)}>Add Class</button>
        </span>
      </div>
    )
  }
}
