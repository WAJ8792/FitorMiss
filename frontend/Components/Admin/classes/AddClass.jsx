import React from 'react';

import { getTime } from '../../../util/classes_util';

export default class AddClass extends React.Component {
  constructor() {
    super();
    this.state = {
      vendor_id: "",
      name: "",
      date: "",
      time: "1:00 PM",
      duration: "",
      seats: ""
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, field) {
    this.setState({[field]: e.target.value});
  }

  handleAdd() {
    this.props.handleAdd(this.state);
    this.setState({
      name: "",
      date: "",
      time: "",
      duration: "",
      seats: ""
    });
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
          times.push(<option key={j+i}>{ getTime(time + '00')}</option>);
        } else {
          let min = j * 15;
          times.push(<option key={j+i}>{ getTime(time + min.toString())}</option>);
        }
      }
    }
    return times;
  }

  render() {
    let times = this.getTimes();

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
        <button onClick={e => this.handleAdd(e)}>Add Class</button>
      </div>
    )
  }
}
