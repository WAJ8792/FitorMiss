import React from 'react';
import { Redirect } from 'react-router-dom';

export default class SignupCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      neighborhood: 1,
      neighborhoods: [],
    }
    this.getNeighborhoods();
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

  handleChange(field) {
    return e => this.setState({[field]: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.signupCustomer(this.state, app);
    <Redirect to="/customerclasses" />
  }

  render() {

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

          <p>Neighborhood</p>
            <select
            onChange={this.handleChange("neighborhood")}
            value={this.state.neighborhood} >
              {neighborhoods}
            </select>

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
