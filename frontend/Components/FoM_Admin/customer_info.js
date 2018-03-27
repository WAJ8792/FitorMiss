import React from 'react';

// import { getTime } from '../../util/time_and_date_util';

export default class extends React.Component {
  render() {
    const customer = this.props.customer;
    const time = new Date(customer.created_at);
    return(
      <div id="mgmt-customer-info">
          <p>Email: {customer.email}</p>
          <p>Name: {customer.first_name + ' ' + customer.last_name}</p>
          <p>Neighborhood: {customer.neighborhood_id}</p>
          <p>Time: {time.getHours()}:{time.getMinutes()}</p>
          <hr />
      </div>
    )
  }
}
