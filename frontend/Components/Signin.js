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
      render: "login",
      pwdReset: false
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

  resetPassword() {
    firebase.auth().sendPasswordResetEmail(this.state.email).then( () => {
      console.log("Email sent");
    }).catch(function(error) {
      console.log(error);
    });
  }

  logout(e) {

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

  handleLoginRender(render) {
    this.setState({render});
  }

  render() {
    let error;
    if (this.props.user.error.length > 0) {
      error = this.props.user.error;
    }
    const logo = <section>
          <img
            src={window.images.logo}
            className="splash-logo" />
        </section>

    if (this.state.type === "customer") {
      return ( <Redirect to="/customer/classes" />);
    } else if (this.state.type === "admin") {
      return (<Redirect to="/admin" />);
    } else {
      switch (this.state.render) {
        case "login":
          return (
            <div id="greeting-container">
              {logo}
              <p className="tagline">Fit or Miss: Daily Deals for the Best Workouts near You!</p>
              <p className="tagline">Welcome to #FlexibleFitness!</p>
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
                      <a onClick={() => this.handleLoginRender("pwdReset")}>
                        Forgot Password?
                      </a>
                    </div>
                    {error}
                    </div>
                  </div>
                </section>
            </div>
            <button
              onClick={() => this.handleLoginRender("signup")}
              className="toggle-button">Not a member? Sign up!</button>
          </div>
          );
        case "pwdReset":
          return (
            <div id="greeting-container">
              {logo}
              <div>

              <section className="session-block">
                <div>
                  <div>
                    <section className="login">
                      <input
                        type="text"
                        value={this.state.email}
                        placeholder="Email Address"
                        onChange={this.handleChange("email")}
                        style={{marginLeft: "135px"}}/>
                    </section>

                    <button onClick={this.resetPassword.bind(this)}>Reset</button>
                    <div className="forgot-password">
                      <a onClick={() => this.handleLoginRender("login")}>Back</a>
                    </div>
                    {error}
                    </div>
                  </div>
                </section>
              </div>
              <button
                onClick={() => this.handleLoginRender('signup')}
                className="toggle-button">Not a member? Sign up!</button>
            </div>
          );
        case "signup":
            return (
              <div id="greeting-container">
                {logo}
              <div>

              <div>
                <p className="create-text">Create a new account</p>
                <section className="signup-forms">
                  <SignupCustomer
                    signupCustomer={this.props.signupCustomer}
                    user={this.props.user} />
                  <button
                    onClick={() => this.handleLoginRender('login')}
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
