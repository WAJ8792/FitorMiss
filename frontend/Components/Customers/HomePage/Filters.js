import React from 'react';

export default class ClassFilters extends React.Component {
  render() {
    return (
      <div className="filters">
        <section>

          <div>
            <p>Search by workout type</p>
            <select
              onChange={e => this.props.changeType(e)}
              value={this.props.typeFilter}>
              <option>No Filter</option>
              <option>Cardio</option>
              <option>Boxing</option>
              <option>Rowing</option>
              <option>Yoga</option>
              <option>Pilates</option>
            </select>
          </div>

          <div>
            <p>Search by gym amenities</p>
            <select
              onChange={e => this.props.changeType(e)}
              value={this.props.typeFilter}>
              <option>No Filter</option>
              <option>Parking</option>
              <option>Mat Rentals</option>
              <option>Showers</option>
              <option>Lockers</option>
              <option>Towels</option>
            </select>
          </div>

        </section>
      </div>
    )
  }
}
