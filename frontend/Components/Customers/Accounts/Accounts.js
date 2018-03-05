import React from 'react';
// import { Elements } from 'react-stripe-elements';

import CardForm from './CardForm';

export default class Accounts extends React.Component {

  resetPassword() {
    firebase.auth().sendPasswordResetEmail(this.state.userInfo.email).then( () => {
      console.log("Email sent");
    }).catch(function(error) {
      console.log(error);
    });
  }

  render() {
    return(
      <div id="page-background">
        <div className="page-container">
          <div className="page-detail">
            <h1>Your Account</h1>
            <p>This page is under construction.
              Any changes here will not affect your Profile.
            </p>
            <form action="" id="account-details">
              <div id="account-details-name">
                <p>Account</p>
                <div id="full-name">
                  <input type="text" placeholder="First Name" />
                  <input type="text" placeholder="Last Name" />
                </div>
                <input type="text" placeholder="Email" />
              </div>

              <hr />

              <div id="password">
                
              </div>

              <hr />

              <div id="account-details-profile">
                <p>Profile</p>
                <p>Gender</p>
                <input type="radio" id="gender-choice-1" name="gender" value="male" />
                <label for="gender-choice-1">Male</label>
                <input type="radio" id="gender-choice-2" name="gender" value="female" />
                <label for="gender-choice-2">Female</label>
                <input type="radio" id="gender-choice-3" name="gender" value="neither" />
                <label for="gender-choice-3">Prefer Not To Say</label>
                <p>Date of Birth</p>
                <input type="text" placeholder="mm/dd/yyyy" />
              </div>

              <hr />

              <div id="emergency-contact">
                <p>Emergency Contact</p>
                <input type="text" placeholder="Name" />
                <input type="text" placeholder="Phone Number" />
              </div>

              <input type="submit" value="Save Changes" />

            </form>
          </div>
        </div>
      </div>
    )
  }
}


// <CardForm />
// <Elements>
// </Elements>
