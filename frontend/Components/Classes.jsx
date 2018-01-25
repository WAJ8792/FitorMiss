import React, { Component } from 'react';

export default class GymClass extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let thisClass = this.props.props;
    return (
      <ul>
        <li>Class ID: {thisClass['title']}</li>
        <li>Date: {thisClass['date']}</li>
        <li>Clas length: {thisClass['duration']}</li>
        <li>Seats Left: {thisClass['seats']}</li>
      </ul>
    )
  }
}
