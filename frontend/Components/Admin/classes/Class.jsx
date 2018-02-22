import React from 'react';

import { getTimeRange } from '../../../util/classes_util';

export default class GymClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.props;
    this.handleChange = this.handleChange.bind(this);
  }

  handleDelete(e) {
    firebase.database().ref("classes/" + this.state.class_id).remove();
  }

  handleChange(e, field) {
    if (field === 'time') {
      this.setState({
        [field]: e.target.value,
        updateRes: true
      })
    } else {
      this.setState({[field]: e.target.value});
    }

  }

  readWriteClass(e, field) {
    e.preventDefault();

    this.setState({type: field});
  }

  updateRes(resId) {
    firebase.database()
    .ref('reservations/' + resId + '/time')
    .set(this.state.time);
  }

  getReservations() {
    firebase.database().ref('reservations').orderByChild('class_id')
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

    this.setState({type: field});
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
    if (this.state.type === "write") {
      let times = this.getTimes()
      return(
        <div className="class-info">

          <section>
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

        <section>
          <div>
            {this.state.name}
          </div>

          <div>
            {getTimeRange(this.state.time, this.state.duration)}
          </div>

          <div>
            {this.state.seats}
            <p style={{margin: 0}}>seats</p>
          </div>

          <div>
            <button onClick={e => this.handleDelete(e)}>Delete Class</button>
          </div>
          <div>
            <button onClick={e => this.readWriteClass(e, 'write')}>Edit Class</button>
          </div>
        </section>
      </div>
    )
  }
}
