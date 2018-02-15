import React from 'react';
import { Redirect } from 'react-router-dom';

import firebaseui from 'firebaseui';
import SignupCustomer from './Customers/Signup_Customer';
import SignupVendor from './Admin/Signup_Vendor';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      email: "",
      password: "",
      loggedOut: "loading",
    }
    this.handleLogin = this.handleLogin.bind(this);
  }

  getUserType(user) {
    firebase.database().ref('user_type')
    .orderByKey().equalTo(user).on('value', snap => {
        let subject = snap.val()[user];
        this.setState({type: subject});
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

    return(
      <div id="greeting-container">
        <section><img src={window.images.logo} /></section>

        <div>
        <section className="session-block">
          <div>
          <div>
              <section className="login">
                <input
                  type="text"
                  value={this.state.email}
                  placeholder="Email Address"
                  onChange={this.handleChange("email")}/>
                <input
                  type="password"
                  value={this.state.password}
                  placeholder="Password"
                  onChange={this.handleChange("password")}/>
              </section>

              <button onClick={e => this.handleLogin(e)}>Login</button>
              {error}
            </div>
          </div>
        </section>
        </div>

        <h3>Create a new account below</h3>

        <section className="signup-forms">
            <SignupVendor signupVendor={this.props.signupVendor}/>

            <SignupCustomer signupCustomer={this.props.signupCustomer}/>
        </section>
      </div>
    )
  }
  }
}
