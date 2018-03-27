import React from 'react';

import CustomerInfo from './customer_info';

export default class Metrics extends React.Component {
  constructor() {
    super()
    const now = new Date();
    const thisMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    this.startTime = thisMorning.getTime();
  }

  customerCount() {
    let total = 0;
    let today = [];
    firebase.database().ref('customers').on('value', snap => {
      const customerIdsArray = Object.keys(snap.val())
      total = customerIdsArray.length
      today = this.customersToday(customerIdsArray, snap.val());
    });
    return {total, today};
  }

  customersToday(ids, customers) {
    let customersToday = [];
    ids.forEach(id => {
      const customer = customers[id];
      if (this.createdToday(customer)) {
        customersToday.push(<CustomerInfo customer={customer} />);
      } else if (!customer.created_at) {
        this.giveCustomerCreatedAt(id);
      }
    });
    return customersToday;
  }

  createdToday(value) {
    if (value.created_at && value.created_at > this.startTime) {
      console.log(value.created_at, this.startTime);
      return true;
    } else { return false; }
  }

  todaysReservations() {
    let count = 0;
    firebase.database().ref('reservations').on('value', snap => {
      Object.keys(snap.val()).forEach(resId => {
        const reservation = snap.val()[resId];
        if (this.createdToday(reservation)) {
          count += 1
        }
      });
    });
    return count;
  }

  giveCustomerCreatedAt(id) {
    const defaultCreation = new Date(2018, 0, 0, 0, 0, 0).getTime();
    firebase.database().ref('customers/' + id + '/created_at').set(defaultCreation);
  }

  render() {
    const customerCount = this.customerCount();
    return (
      <div className="metrics">
        <h3>Metrics</h3>

        <section>
          <div>
            <p>new customers today</p>
            {customerCount.today.length}
            {customerCount.today}
          </div>

          <div>
            <p>classes booked today</p>
            {this.todaysReservations()}
          </div>

          <div>
            <p>Visits to site today</p>
          </div>

          <div>
            <p>Current total customers</p>
            {customerCount.total}
          </div>

        </section>
      </div>
    )
  }
}
