import React from 'react';

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
        <h1>Your Account</h1>
        <button onClick={this.resetPassword.bind(this)}>
          Reset Password
        </button>
      </div>
      </div>
    )
  }
}
