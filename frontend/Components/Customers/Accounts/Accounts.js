import React from 'react';
// import { Elements } from 'react-stripe-elements';

import CardForm from './CardForm';

export default class Accounts extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      userInfo: {
        first_name: "",
        last_name: "",
        email: "",
        neighborhood: "",
      }
    }
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid, loggedOut: false });
        this.fetchUserInfo(user.uid);
      }
    });
  }

  fetchUserInfo(user) {
    firebase.database().ref('customers')
    .orderByKey().equalTo(user).on('value', snap => {
      if (snap.val() != null) {
        this.setState({userInfo: snap.val()[user]});
      }
    })
  }

  resetPassword() {
    firebase.auth().sendPasswordResetEmail(this.state.userInfo.email).then( () => {
      console.log("Email sent");
    }).catch(function(error) {
      console.log(error);
    });
  }

  render() {
    const userInfo = this.state.userInfo;
    return(
      <div id="page-background">
        <div className="page-container">
          <div className="page-detail">
            <div className="account-details-header">Your Account</div>
            <p>This page is under construction.
              Any changes here will not affect your Profile.
            </p>
            <form action="" id="account-details">
              <div id="account-details-name">
                <p>Account</p>
                <div id="full-name">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={userInfo.first_name}/>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={userInfo.last_name}/>
                </div>
                <input type="text" placeholder="Email" value={userInfo.email} />
              </div>

              <hr />

              <div id="password">
                <p>Password</p>
                <button
                  className="reset-password"
                  onClick={this.resetPassword.bind(this)}>
                  Reset Password
                </button>
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
