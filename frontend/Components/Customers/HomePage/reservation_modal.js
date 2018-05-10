import React from 'react'
import { getTime } from '../../../util/time_and_date_util';

export default class ConfirmReservation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const thisClass = this.props.thisClass;
    const seats = parseInt(thisClass.seats);
    const seatsLeft = (thisClass.reservations && thisClass.reservations[thisClass.date])
    ? seats - Object.keys(thisClass.reservations[thisClass.date]).length
    : seats
    console.log(thisClass);
    const description = (thisClass.description)
    ? thisClass.description
    : "No class description available"
    if (this.props.type != 'info') {
      return (
        <div className="add-class">
          <div className="reservation-modal">
            <div>
              <h2>Are you sure you want to reserve {thisClass.name}?</h2>
              <p id="p1">{thisClass.day}, {thisClass.date} at {getTime(thisClass.time)}</p>
              <p id="p2">In {thisClass.neighborhood} with {thisClass.vendor}</p>
              <p id="p3">Only {seatsLeft} seats left!</p>
            </div>

            <div className="class-buttons">
              <button onClick={e => this.props.cancelReserve(this.props.type)}
                className="class-cancel-button">
                Cancel
              </button>
              <button onClick={e => this.props.confirmReserve(e)}
                style={{marginLeft: '50px'}}>
                RESERVE
              </button>
            </div>

          </div>
        </div>
      )
    } else {
      return (
        <div className="add-class">
          <div className="reservation-modal">
            <div>
              <h2>{thisClass.name}</h2>
              <p id="p1">{thisClass.day}, {thisClass.date} at {getTime(thisClass.time)}</p>
              <p id="p2">In {thisClass.neighborhood} with {thisClass.vendor}</p>
              <p id="p3">{description}</p>
            </div>

            <div className="class-buttons">
              <button onClick={e => this.props.cancelReserve(this.props.type)}
                className="class-cancel-button">
                Close
              </button>
            </div>

          </div>
        </div>
      )
    }
  }
}
