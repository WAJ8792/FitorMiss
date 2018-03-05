import React from 'react';

import { getTimeRange } from '../../../util/classes_util';

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
        <img src={window.images.logo} alt="Flywheel Sports" />

        <p class="class-info">
          {thisClass.vendor}, {thisClass.neighborhood} <br />
          {thisClass.name} <br />
          {this.props.thisClass.date.slice(0, 6)} <br />
          {time}
        </p>

      </div>
    )
  }
}
