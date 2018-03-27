import React from 'react';

export default class Metrics extends React.Component {
  
  totalCustomers() {
    let count;
    firebase.database().ref('customers').on('value', snap => {
      count = Object.keys(snap.val()).length;
    });
    return count;
  }
  
  render() {
    return (
      <div className="metrics">
        <h3>Metrics</h3>
        
        <section>
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
            {this.totalCustomers()}
          </div>
        
        </section>
      </div>
    )
  }
}