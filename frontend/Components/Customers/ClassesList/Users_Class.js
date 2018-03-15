import React from 'react';

import { getTimeRange } from '../../../util/time_and_date_util';

export default class UsersClassInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      info: {}
    }
    this.fetchClassInfo();
  }

  fetchClassInfo() {
    firebase.database().ref('classes')
    .orderByKey().equalTo(this.props.thisClass.class_id).once('value', snap => {
      if (snap.val() != null) {
        let id = Object.keys(snap.val());
        if (snap.val()[id] != null) {
          let info = snap.val()[id];
          this.setState({id, info});
        } else { this.setState({id: null})}
      } else { this.setState({id: null})}
    })
  }

  render() {
    if (this.state.id === null) { return null; }
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
