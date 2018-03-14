import React from 'react';

import { getTime, getTimeRange } from '../../../util/time_and_date_util';

export default class GymClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.props;
    this.handleChange = this.handleChange.bind(this);
    this.app = firebase.database();
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

  // getReservations() {
  //   this.app.ref('reservations').orderByChild('class_id')
  //     .equalTo(this.state.class_id).once('value', snap => {
  //       if (snap.val() != null) {
  //         Object.keys(snap.val()).forEach(resId => {
  //           this.updateRes(resId);
  //         });
  //       }
  //       this.setState({updateRes: false});
  //     });
  // }

  // saveChanges(e, field) {
  //   e.preventDefault();
  //   console.log(this.state);
  //
  //   if (this.state.updateRes === true) {
  //     this.getReservations();
  //   }
  //
  //   this.props.saveChanges(this.state);
  // }

  render() {
    let type = (this.state.type) ? this.state.type : null
    let props = this.props;
    let state = this.state;

    return(
      <div className="class-info">

        <section className="class-info-class-item">
          <div>
            {this.state.name}
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
              onClick={() => props.openModal(state, "class")}>
              Edit Class
            </button>

            <button
              className="class-delete-button"
              onClick={e => props.openModal(state, "delete")}>
              Delete Class
            </button>
          </div>
        </section>

      </div>
    )
  }
}
