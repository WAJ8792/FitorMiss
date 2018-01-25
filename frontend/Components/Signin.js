import React from 'react';
import { Redirect } from 'react-router-dom';

import firebaseui from 'firebaseui';

export default class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loggedIn: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(field) {
    return e => this.setState({[field]: e.target.value})
  }



  handleSubmit(e) {
    e.preventDefault();

    this.props.login(this.state, app);
    this.props.checkLoggedIn();

  }

  render() {

    return(
      <div id="firebaseui-auth-container">
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input
            type="text"
            value={this.state.email}
            onChange={this.handleChange("email")}/>
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChange("password")}/>
          <input type="submit" />
        </form>
      </div>
    )
  }
}
