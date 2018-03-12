import React from 'react';

import { getTimeRange } from '../../../util/time_and_date_util';

export default class UsersClassInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      info: {}
    }
    this.fetchClassInfo();
  }

  fetchClassInfo() {
    let thisClass;
    firebase.database().ref('classes')
    .orderByKey().equalTo(this.props.thisClass.class_id).once('value', snap => {
      let id = Object.keys(snap.val());
      let info = snap.val()[id];
      this.setState({id, info});
    })
  }

  render() {
    let time;
    let thisClass = this.state.info;

    if (this.state.id.length > 0) {
      time = getTimeRange(thisClass.time, thisClass.duration);
    }

    return (
      <div className="class-module-class">
        <div>
          <img src={window.images.logoNoBackground} alt="Flywheel Sports" />
        </div>

        <p className="class-info">
          {thisClass.vendor}, {thisClass.neighborhood} <br />
          {thisClass.name} <br />
          {this.props.thisClass.date.slice(0, 6)} <br />
          {time}
        </p>

      </div>
    )
  }
}
