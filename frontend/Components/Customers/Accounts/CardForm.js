import React from 'react';

// import { injectStripe, CardElement } from 'react-stripe-elements';


class CardForm extends React.Component {
  render() {
    return (
      <form action="" id="payment">
        <p id="billing-header">Billing  and  Payment</p>
        <div id="cc-info">
          <div id="cc-number">
              <p>Credit Card Number</p>
              <input className="cc-number" type="text" placeholder="XXXX-XXXX-XXXX-4242" />
          </div>

          <div id="csc">
              <p>Security Code (CSC)</p>
              <span>
                  <input className="cc-csc-number" type="password" placeholder="XXX" />
                  <img src={window.images.cvc} alt="CVC Image" />
              </span>
          </div>
        </div>

        <div id="expiration">
          <p>Expiration Date</p>
          <input className="expiration-input" type="text" placeholder="MM/YY" />
        </div>

        <div id="address">
          <p className="billing-text">Billing Address</p>
          <div id="address-input">
            <div id="street">
              <input className="address-input" type="text" placeholder="Street Address" />
              <input type="text" placeholder="APT #" />
            </div>
      
            <div id="state-city">
              <input type="text" placeholder="City" />
              <select>
                <option defaultValue="">State</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District Of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
            </div>
          </div>
            
          <div id="zipcode">
              <p>Zip Code</p>
              <input id="zipcode-input" type="text" placeholder="10010" />
          </div>
        </div>
        <div id="contact-info">
          <div className="contact-name">
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
          </div>
          <input type="text" placeholder="Billing Email" />
        </div>
        <input type="submit" value="Save Billing Information" />
    </form>
    )
  }
}

export default CardForm;
//
// <label>
// Card Details
// <CardElement />
// </label>
