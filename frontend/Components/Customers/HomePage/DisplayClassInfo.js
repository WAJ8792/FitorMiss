import React from 'react';

export default class DisplayClassInfo extends React.Component {

  getTime(time) {
    let hour = parseInt(time.slice(0, 2))
    if (hour > 12 ) {
      hour -= 12
      let min = time.slice(2, 5);
      time = hour.toString() + min;
      time += " PM";
    } else { time += " AM"}

    let firstDigit = time.slice(0, 1);
    if (firstDigit === '0') {
      time = time.slice(1, 5);
    }
    return time;
  }

  render() {
    let thisClass = this.props.thisClass;
    let time = this.getTime(thisClass.time);
    return (
      <section>
        <div>
          <h5>{time}</h5>
          <p></p>
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

        <button onClick={() => this.props.handleReserve(thisClass.classId)}>
          RESERVE CLASS
        </button>
      </section>
    )
  }
}
