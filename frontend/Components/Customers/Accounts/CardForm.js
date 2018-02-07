import React from 'react';

import { injectStripe, CardElement } from 'react-stripe-elements';


class CardForm extends React.Component {
  render() {
    return (
      <label>
        Card Details
        <CardElement />
      </label>
    )
  }
}

export default injectStripe(CardForm);
