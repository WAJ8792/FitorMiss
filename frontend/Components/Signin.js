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

  resetPassword = () => {
    firebase.auth().sendPasswordResetEmail(this.state.email).then( () => {
      console.log("Email sent");
    }).catch(function(error) {
      console.log(error);
    });
  }

  logout = (e) => {

    let user = {
      uid: this.state.uid,
      email: this.state.email,
    };
    this.props.logout(user, app);
    this.setState({loggedOut: true});
  }

  handleChange = (field) => {
    return e => this.setState({[field]: e.target.value})
  }

  handleLogin = (e) => {
    e.preventDefault();
    this.props.login(this.state, app);
  }

  handleLoginRender(render) {
    this.setState({render});
  }

  toggleTabs(name) {
    const { render } = this.state;
    let word = (render === name) ? "active" : null;
    if (render === "pwdReset" && name === "login") {
      word = "active"
    }
    return "navlinks" + " " + word;
  }

  render() {
    if (this.state.type === "customer") {
      return ( <Redirect to="/customer/classes" />);
    } else if (this.state.type === "admin") {
      return (<Redirect to="/admin" />);
    }

    const logo = <section>
          <img
            src={window.images.logo}
            className="splash-logo" />
        </section>


    return (
      <div id="greeting-container">
        {logo}
        <p className="tagline">Fit or Miss: Daily Deals for the Best Workouts near You!</p>
        <p className="tagline">Welcome to #FlexibleFitness!</p>

        <div className="new-page-container">
          <div className="page-detail">
            <div id="sessions-page">
              <div id="sessions-module">
                <div className="sessions-module-buttons">

                  <button
                    className={this.toggleTabs("login")}
                    onClick={() => this.handleLoginRender("login")}>
                    Login
                  </button>
                  <button
                    className={this.toggleTabs("signup")}
                    onClick={() => this.handleLoginRender("signup")}>
                    SignUp
                  </button>

                </div>
                <hr className="sessions-hr" />

                {this.getSessionType()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getSessionType() {
    let error;
    if (this.props.user.error.length > 0) {
      error = this.props.user.error;
    }

    switch (this.state.render) {
      case "login":
        return (
          <Login
            password={this.state.password}
            email={this.state.email}
            handleLoginRender={this.handleLoginRender}
            handleChange={this.handleChange}
            handleLogin={this.handleLogin}
            error={error}
          />
        );
        case "pwdReset":
          return (
            <Reset
              email={this.state.email}
              handleLoginRender={this.handleLoginRender}
              resetPassword={this.resetPassword}
              handleChange={this.handleChange}
            />
          );
        case "signup":
          return (
            <SignupCustomer
              signupCustomer={this.props.signupCustomer}
              user={this.props.user} />
          );
      }
    }
}

const Login = props => [
  <div className="sign-up-forms">
    <p className="create-text">Sign In</p>
    <section className="session-block">
      <div style={{display: "inline-grid"}}>

        <input
          type="text"
          value={props.email}
          placeholder="Email Address"
          onChange={props.handleChange("email")}/>
        <input
          type="password"
          value={props.password}
          placeholder="Password"
          onChange={props.handleChange("password")}/>

        <button onClick={e => props.handleLogin(e)}>Login</button>
        <div className="forgot-password-text">
          <a onClick={() => props.handleLoginRender("pwdReset")}>
            Forgot Password?
          </a>
        </div>
        {props.error}
      </div>
    </section>
  </div>
]

const Reset = props => [
  <section className="sign-up-forms">
    <section className="password-block">
      <input
        type="text"
        value={props.email}
        placeholder="Email Address"
        onChange={props.handleChange("email")}
      />
    </section>

    <button
      className="reset-password-button"
      onClick={props.resetPassword}>
      Reset
    </button>

    <div className="forgot-password-text">
      <a onClick={() => props.handleLoginRender("login")}>
        Back
      </a>
    </div>
    {props.error}
  </section>
]
