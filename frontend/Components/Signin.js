import React from 'react';
import { Redirect } from 'react-router-dom';

import firebaseui from 'firebaseui';

export default class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      newEmail: "",
      newPassword: "",
      gymName: "",
      neighborhood: "",
    }
  }

  handleChange(field) {
    return e => this.setState({[field]: e.target.value})
  }

  handleLogin(e) {
    e.preventDefault();
    this.props.login(this.state, app);
  }

  handleSignup(e) {
    e.preventDefault();
    this.props.signup(this.state, app);
  }

  render() {

    return(
      <div id="firebaseui-auth-container">

        <form onSubmit={(e) => this.handleLogin(e)}>
          <input
            type="text"
            value={this.state.email}
            onChange={this.handleChange("email")}/>
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChange("password")}/>
          <input type="submit" value="login"/>
        </form>

        <h3>Create a new account below</h3>

        <form onSubmit={(e) => this.handleSignup(e)}>
        <p>email</p>
        <input
          type="text"
          value={this.state.newEmail}
          onChange={this.handleChange("newEmail")}/>
        <p>password</p>
        <input
          type="password"
          value={this.state.newPassword}
          onChange={this.handleChange("newPassword")}/>
        <p>Gym name</p>
        <input
          type="text"
          value={this.state.gymName}
          onChange={this.handleChange("gymName")}/>
        <p>Neighborhoos</p>
        <input
          type="text"
          value={this.state.neighborhood}
          onChange={this.handleChange("neighborhood")}/>
        <input type="submit" value="signup"/>
        </form>

      </div>
    )
  }
}
