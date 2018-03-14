import React from 'react';
import { Redirect } from 'react-router-dom';

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
      renderLogin: true
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLoginRender = this.handleLoginRender.bind(this);
  }

  getUserType(user) {
    firebase.database().ref('user_type')
    .orderByKey().equalTo(user).on('value', snap => {
        let subject = snap.val()[user];
        this.setState({type: subject});
      });
  }

  logout(e) {
    // e.preventDefault();

    let user = {
      uid: this.state.uid,
      email: this.state.email,
    };
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

  sendEmail() {
    let msg = {
      to: 'thomasMaher1210@gmail.com',
      from: 'thomasMaher1210@gmail.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    console.log(msg);
  }

  handleLoginRender() {
    this.setState({renderLogin: !this.state.renderLogin});
  }

  render() {
    let error;
    if (this.props.user.error.length > 0) {
      error = this.props.user.error;
    }

    if (this.state.type === "customer") {
      return ( <Redirect to="/customer/classes" />);
    } else if (this.state.type === "admin") {
      return (<Redirect to="/admin" />);
    } else {
      if (this.state.renderLogin) {
        return (
          <div id="greeting-container">
            <section>
              <img
                src={window.images.logo}
                className="splash-logo" />
            </section>
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
                <div className="forgot-password">
                  <a href="#">Forgot Password?</a>
                </div>
                {error}
                </div>
              </div>
            </section>
          </div>
          <button
            onClick={this.handleLoginRender}
            className="toggle-button">Not a member? Sign up!</button>
        </div>
        );
        } else if (!this.state.renderLogin) {
          return (
            <div id="greeting-container">
              <section>
                <img
                  src={window.images.logo}
                  className="splash-logo" />
              </section>
            <div>

            <div>
              <p className="create-text">Create a new account</p>
              <section className="signup-forms">
                <SignupCustomer
                  signupCustomer={this.props.signupCustomer}
                  user={this.props.user} />
                <button
                  onClick={this.handleLoginRender}
                  className="toggle-button">Already a member? Log In</button>
              </section>
            </div>
          </div>
          </div>
          );
        }
      }
    }
  }
