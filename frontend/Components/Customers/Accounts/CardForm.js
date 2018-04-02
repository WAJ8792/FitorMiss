import React from 'react';

import { injectStripe, CardElement } from 'react-stripe-elements';
import { saveCard } from '../../../util/card_util';
import ChangeCard from './ChangeCard';

class CardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      user: false,
      stripe_id: null,
      cards: {},
      changeable: false,
      error: false
    }
    this.changeCard = this.changeCard.bind(this);
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid });
        this.getUserInfo(user.uid);
      }
    })
  }

  getUserInfo(user) {
    firebase.database().ref('customers')
    .orderByKey().equalTo(user).on('value', snap => {
      if (snap.val() != null) {
        const info = snap.val()[user];
        let stripe_id = null
        if (info.cards) {
          stripe_id = info.cards[info.stripe_id];
        }
        this.setState({ stripe_id, cards: info.cards });
      }
    });
  }

  handleChange(e) {
    this.setState({
      firstName: e.target.value
    })
  }

  changeCard(e) {
    e.preventDefault();
    const user = this.state.user;
    const stripe_id = this.state.stripe_id;
    firebase.database().ref('customers/' + user + '/stripe_id').set(stripe_id);
  }

  selectCard = (e) => {
    this.setState({
      stripe_id: e.target.value,
      changeable: true
    });
  }

  createCard(e) {
    e.preventDefault();
    this.setState({error: "Processing card info..."});
    const name = this.state.firstName;
    const user = this.state.user;
    let cards = this.state.cards;
    this.props.stripe.createToken({name}).then(({token}) => {
      saveCard({token, name}, (stripe_id, last4) => {
        cards[stripe_id] = last4;
        if (user) {
          firebase.database()
          .ref('customers/' + user + '/stripe_id').set(stripe_id);
          firebase.database().ref('customers/' + user + '/cards').set(cards)
        }
      }, (result) => { this.setState({error: result}) } )
    }).catch( error => {
      this.setState({error})
    });
  }

  render() {
    const cards = this.state.cards;
    const changeCard = (this.state.changeable)
    ? <input type="submit" value="Switch Card"/>
    : <input type="submit" value="Switch Card" disabled/>
    return (
      <div>
      <form action="" id="billing" onSubmit={e => this.createCard(e)}>
        <p id="billing-header">Billing  and  Payment</p>
        <div style={{fontSize: "15px", color: "#f374f3"}}>{this.state.error}</div>
        <CardElement  style={{ base: {
          fontSize: '15px',
          letterSpacing: '1px',
        }}}/>

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

        </div>
        <div id="contact-info">
          <p className="billing-text">Contact Info</p>
          <div className="contact-name">
              <input
                type="text" placeholder="First Name"
                onChange={(e) => this.handleChange(e)}/>
              <input type="text" placeholder="Last Name" />
          </div>
          <input type="text" placeholder="Billing Email" />
        </div>
        <div style={{display: 'flex', marginBottom: '22px'}}>
          <input type="submit" value="Save Billing Information" />
        </div>
    </form>
    <div style={{marginLeft: "200px", marginTop: "16px"}}>
      <ChangeCard
        cards={cards}
        stripe_id={this.state.stripe_id}
        changeCardButton={changeCard}
        selectCard={this.selectCard}
        changeCard={this.changeCard}
        />
      </div>
    </div>
    );
  }
}

export default injectStripe(CardForm);

// Eric's original code for the card info which was replaced with stripe's UI
// <div id="cc-info">
//   <div id="cc-number">
//     <p>Credit Card Number</p>
//     <input
//       className="cc-number" type="text"
//       placeholder="XXXX-XXXX-XXXX-4242"
//       onChange={e => this.handleChange(e)}
//       value={this.state.cardNumber} />
//   </div>
//
//   <div id="csc">
//     <p>Security Code (CSC)</p>
//     <span>
//       <input className="cc-csc-number" type="password" placeholder="XXX" />
//       <img src={window.images.cvc} alt="CVC Image" />
//     </span>
//   </div>
// </div>
//
// <div id="expiration">
//   <p>Expiration Date</p>
//   <input className="expiration-input" type="text" placeholder="MM/YY" />
// </div>
