import React from 'react';

import { getTime } from '../../../util/classes_util';

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
      time = getTime(thisClass.time);
    }

    return (
      <section>
      <div>
        <h5>{time}</h5>
        <p>{this.props.thisClass.date.slice(0, 6)}</p>
      </div>

      <div>
        <h5>{thisClass.vendor}</h5>
        <p>Class description</p>
      </div>

      <div>
        <h5>{thisClass.neighborhood}</h5>
      </div>

      <div>
        <h5>{thisClass.name}</h5>
      </div>

      <div>
        <button onClick={() => this.props.handleReserve(thisClass.class_id)}>
        </button>
      </div>

      </section>
    )
  }
}
