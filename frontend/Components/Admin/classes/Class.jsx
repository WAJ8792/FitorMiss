import React from 'react';

import { getTime, getTimeRange } from '../../../util/time_and_date_util';

export default class GymClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.props;
    this.handleChange = this.handleChange.bind(this);
    this.app = firebase.database();
  }

  handleDelete(e) {
    const db = this.app;
    db.ref("classes/" + this.state.class_id).remove();

    db.ref("reservations")
    .orderByChild("class_id").equalTo(this.state.class_id).on("value", snap => {
      if (snap.val() != null) {
        Object.keys(snap.val()).forEach(resId => {
          db.ref("reservations/" + resId + "/canceled").set(true);
        })
      }
    })
  }

  handleDurationChange(e, field) {
    let duration = this.state.duration;
    duration[field] = parseInt(e.target.value);
    this.setState({
      duration,
      updateRes: true
    });
  }

  handleChange(e, field) {
    if (field === 'time') {
      this.setState({
        [field]: e.target.value,
        updateRes: true
      })
    } else {
      let value;
      if (field === "seats") {
        value = parseInt(e.target.value)
      } else {
        value = e.target.value;
       }
      this.setState({[field]: value});
    }

  }

  readWriteClass(e, field) {
    e.preventDefault();

    this.setState({functionality: field});
  }

  updateRes(resId) {
    this.app.ref('reservations/' + resId + '/time').set(this.state.time);
    this.app.ref('reservations/' + resId + '/time').set(this.state.day);
    this.app.ref('reservations/' + resId + '/time').set(this.state.duration);
  }

  getReservations() {
    this.app.ref('reservations').orderByChild('class_id')
      .equalTo(this.state.class_id).once('value', snap => {
        if (snap.val() != null) {
          Object.keys(snap.val()).forEach(resId => {
            this.updateRes(resId);
          });
        }
        this.setState({updateRes: false});
      });
  }

  saveChanges(e, field) {
    e.preventDefault();

    if (this.state.updateRes === true) {
      this.getReservations();
    }

    this.setState({functionality: field});
    this.props.saveChanges(this.state);
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
    let type = (this.state.type) ? this.state.type : null
    let props = this.props;
    let state = this.state;

    if (this.state.functionality === "write") {
      let times = this.getTimes()
      return(
        <div className="class-info">

          <section className="class-info-class">
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
                <section style={{padding: "0px"}}>
                  <p style={{fontSize: "8px", width: "52px"}}>Hours</p>
                  <p style={{fontSize: "8px"}}>Minutes</p>
                </section>

                <section style={{padding: "0px"}}>
                  <input
                    type="number"
                    onChange={e => this.handleDurationChange(e, 'hours')}
                    value={this.state.duration.hours}/>

                  <input
                    type="number"
                    onChange={e => this.handleDurationChange(e, 'min')}
                    value={this.state.duration.min}/>
                </section>
            </div>

            <div>
              <p>Total Seats</p>
              <input
                type="number"
                onChange={e => this.handleChange(e, 'seats')}
                value={this.state.seats}/>
            </div>

            <div>
              <p>Workout Type</p>
                <select
                  onChange={e => this.handleChange(e, 'type')}
                  value={this.state.type}>
                  <option>Cardio</option>
                  <option>Boxing</option>
                  <option>Rowing</option>
                  <option>Yoga</option>
                  <option>Pilates</option>
                </select>
            </div>

            <div>
              <button onClick={e => this.readWriteClass(e, 'read')}>Cancel Changes</button>
            </div>
            <div>
              <button onClick={e => this.saveChanges(e, 'read')}>Save</button>
            </div>
          </section>

        </div>
      )
    }
    return(
      <div className="class-info">

        <section className="class-info-class-item">
          <div>
            {this.state.name}
            <p>{type}</p>
          </div>

          <div className="class-item-time">
            {getTimeRange(this.state.time, this.state.duration)}
          </div>

          <div className="class-item-seats">
            {this.state.seats}
            <span> seats</span>
          </div>

          <div className="class-edit-delete-buttons">
            <button
              className="class-edit-button"
              onClick={() => props.openModal(state)}>
              Edit Class
            </button>

            <button
              className="class-delete-button"
              onClick={e => this.handleDelete(e)}>
              Delete Class
            </button>
          </div>
        </section>

      </div>
    )
  }
}
