import React from 'react';
import { Redirect } from 'react-router-dom';

import firebaseui from 'firebaseui';
import SignupCustomer from './Customers/Signup_Customer';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      email: "",
      password: "",
      newEmail: "",
      newPassword: "",
      gymName: "",
      neighborhood: "",
      neighborhoods: [],
      loggedOut: "loading",
    }
    this.getNeighborhoods();
  }

  getUserType(user) {
    firebase.database().ref('user_type')
    .orderByKey().equalTo(user).on('value', snap => {
        let subject = snap.val()[user];
        this.setState({type: subject});
      })
  }

  getNeighborhoods() {
    let neighborhoods = [];
    app.database().ref('neighborhoods').on('value', snap => {
      Object.keys(snap.val())
        .forEach(id => {
          neighborhoods.push({[snap.val()[id]]: id});
        });
      this.setState({neighborhoods});
    })
  }

  logout(e) {
    // e.preventDefault();

    let user = {
      uid: this.state.uid,
      email: this.state.email,
    }
    this.props.logout(user, app);
    this.setState({loggedOut: true});
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
    this.props.signupVendor(this.state, app);
  }

  render() {
    let error;
    if (this.props.user.error.length > 0) {
      error = this.props.user.error;
    }
    if (this.state.type === "customer") {
      return ( <Redirect to="/customer/classes" />);
    } else if (this.state.type === "admin") {
      return (<Redirect to="/admin" />)
    } else {

    let neighborhoods = [];
    this.state.neighborhoods.forEach(neighborhood => {
      let name = Object.keys(neighborhood)[0];
      neighborhoods.push(<option
        key={name}
        value={neighborhood[name]}>
        {name}
        </option>
      )
    })

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
        {error}

        <h3>Create a new account below</h3>

        <section className="signup-forms">
          <div>
            <h4>Sign up as a vendor!</h4>
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
            <p>Neighborhood</p>
            <select onChange={this.handleChange("neighborhood")}>
              {neighborhoods}
            </select>
            <input type="submit" value="signup"/>
            </form>
          </div>

          <SignupCustomer signupCustomer={this.props.signupCustomer}/>

        </section>

      </div>
    )
  }
  }
}
