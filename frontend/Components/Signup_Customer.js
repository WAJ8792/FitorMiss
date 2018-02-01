import React from 'react';

export default class SignupCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    }
  }

  handleChange(field) {
    return e => this.setState({[field]: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.signupCustomer(this.state, app);
  }

  render() {
    return(
      <div>
        <h4>Sign up as a customer!</h4>
        <form onSubmit={e => this.handleSubmit(e)}>

          <p>First Name</p>
          <input
            type="text"
            value={this.state.firstName}
            onChange={this.handleChange("firstName")} />

          <p>Last Name</p>
          <input
            type="text"
            value={this.state.lastName}
            onChange={this.handleChange("lastName")}
            />

          <p>email</p>
            <input
            type="text"
            value={this.state.email}
            onChange={this.handleChange("email")}/>

          <p>password</p>
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChange("password")}/>

          <input type="submit" value="signup customer"/>
        </form>
      </div>
    )
  }
}
