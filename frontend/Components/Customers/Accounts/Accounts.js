import React from 'react';
// import { Elements } from 'react-stripe-elements';

import CardForm from './CardForm';

export default class Accounts extends React.Component {
  render() {
    return(
      <div id="page-background">
      <div className="page-container">
        <div className="page-detail">
          <h1>Your Account</h1>
          <CardForm />
        </div>
      </div>
      </div>
    )
  }
}


// <Elements>
// </Elements>
