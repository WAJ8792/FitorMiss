import React from 'react';
// import { Elements } from 'react-stripe-elements';

import { dateFormatError } from '../../../util/time_and_date_util';

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
        details: {
          gender: "",
          emergency_contact: {
            name: "",
            phone: ""
          }
        }
      },
      userErrors: [],
      detailErrors: []
    }
    this.getCurrentUser();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.invalidInput = this.invalidInput.bind(this);
  }

  handleChange(field) {
    return e => {
      this.setState({
        ...this.state,
          userInfo: {
            ...this.state.userInfo,
            [field]: e.target.value
          }
      });
    }
  }

  handleDetailChange(field) {
    return e => {
      this.setState({
        ...this.state,
          userInfo: {
            ...this.state.userInfo,
            details: {
              ...this.state.userInfo.details,
              [field]: e.target.value
            }
          }
      });
    }
  }

  handleEmContactChange(field) {
    return e => {
      this.setState({
        ...this.state,
          userInfo: {
            ...this.state.userInfo,
            details: {
              ...this.state.userInfo.details,
              emergency_contact: {
                ...this.state.userInfo.emergency_contact,
                [field]: e.target.value
              }
            }
          }
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const detailErrors = this.invalidInput(this.state.userInfo)
    if (detailErrors) {
      console.log(detailErrors);
      this.setState({detailErrors});
      return;
    }
    const state = this.state.userInfo;
    state.updated_at = new Date().getTime();


    firebase.database().ref("customers/" + this.state.user).set(state);
  }

  invalidInput(user) {
    let detailErrors = false;

    const dobError = dateFormatError(user.details.dob)
    if (dobError) { detailErrors = [dobError] }
    return detailErrors;
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
    const details = (userInfo.details) ? userInfo.details : null
    const dob = (userInfo.details && details.dob) ? details.dob : null
    const emContact = (userInfo.details && details.emergency_contact) ? details.emergency_contact : null
    const name = (emContact && emContact.name) ? emContact.name : null
    const phone = (emContact && emContact.phone) ? emContact.phone : null

    console.log(this.state);
    const genderOptions = ["male", "female", "neither"].map( gender => {
      const inputV = (details && details.gender && details.gender === gender )
      ? <input
        type="radio"
        id={`radio ${gender}`}
        name="gender"
        value={genValue(gender)}
        onClick={this.handleDetailChange("gender")}
        checked />
      : <input
        type="radio"
        id={`radio ${gender}`}
        name="gender"
        value={genValue(gender)}
        onClick={this.handleDetailChange("gender")} />
      return (
        <div style={{marginRight: '25px'}}>
          {inputV}
          <label for={`radio ${gender}`}>{genValue(gender)}</label>
        </div>
      )
    })

    return(
      <div id="page-background">
        <div className="page-container">
          <div className="page-detail">
            <div className="account-details-header">Your Account</div>

            <form action="" id="account-details" onSubmit={this.handleSubmit}>
              <div id="account-details-name">
                <p>Account</p>
                {this.state.userErrors}
                <div id="full-name">
                  <input
                    type="text"
                    placeholder="First Name"
                    onChange={this.handleChange("first_name")}
                    value={userInfo.first_name}/>
                  <input
                    type="text"
                    placeholder="Last Name"
                    onChange={this.handleChange("last_name")}
                    value={userInfo.last_name}/>
                </div>
                <input
                  type="text"
                  placeholder="Email"
                  onChange={this.handleChange("email")}
                  value={userInfo.email} />
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
                <p id="reservation-errors">{this.state.detailErrors}</p>
                <p>Gender</p>

                <div style={{display: 'flex'}}>{genderOptions}</div>

                <p>Date of Birth</p>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  value={dob}
                  onChange={this.handleDetailChange("dob")}/>
              </div>

              <hr />

              <div id="emergency-contact">
                <p>Emergency Contact</p>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={this.handleEmContactChange("name")}/>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={this.handleEmContactChange("phone")}/>
              </div>

              <input type="submit" value="Save Changes" style={{marginBottom: '10px'}}/>

            </form>
          </div>
        </div>
      </div>
    )
  }
}

function genValue(g) {
  let value = (g === "neither") ? "Prefer Not To Say" : g
  return value;
}

// <input type="radio" id="gender-choice-2" name="gender" value="female" />
// <label for="gender-choice-2">Female</label>
// <input type="radio" id="gender-choice-3" name="gender" value="neither" />
// <label for="gender-choice-3">Prefer Not To Say</label>
