import React from 'react';

export default class Metrics extends React.Component {
  render() {
    return (
      <div className="metrics">
        <h3>Metrics</h3>
        
        <div>
          <p>new customers today</p>
        </div>
        
        <div>
          <p>classes booked today</p>
        </div>
        
        <div>
          <p>Visits to site today</p>
        </div>
        
        <div>
          <p>Current total customers</p>
        </div>
        
      </div>
    )
  }
}