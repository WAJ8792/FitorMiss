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
      // neighborhood: 1,
      // neighborhoods: [],
      error: [null],
    }
    // this.getNeighborhoods();
  }

  // getNeighborhoods() {
  //   let neighborhoods = [];
  //   app.database().ref('neighborhoods').on('value', snap => {
  //     Object.keys(snap.val())
  //       .forEach(id => {
  //         neighborhoods.push({[snap.val()[id]]: id});
  //       });
  //     this.setState({neighborhoods});
  //   })
  // }

  handleChange(field) {
    return e => this.setState({[field]: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.firstName.length < 1 && this.state.lastName.length  < 1) {
      let error = ["Please fill in at least first or last name"];
      this.setState({error});
    } else {
      this.props.signupCustomer(this.state, app);
      // <Redirect to="/customerclasses" />
    }

  }

  render() {
    let error;
    if (this.props.user.error.length > 0) {
      error = this.props.user.error;
    }

    return(
      <div className="sign-up-forms">
      <p className="create-text">Create a new account</p>
        <div className="signup-container">
          <section className="session-block">
            <div>
            <div>
              <p>Sign up as a customer!</p>
                {this.state.error}
                {error}

                <input
                  type="text"
                  value={this.state.firstName}
                  placeholder="First Name"
                  onChange={this.handleChange("firstName")} />

                <input
                  type="text"
                  value={this.state.lastName}
                  placeholder="Last Name"
                  onChange={this.handleChange("lastName")}
                  />

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


                <button onClick={e => this.handleSubmit(e)}>Sign up</button>
            </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

// Creates a list of available neighborhoods to choose as user's default.
// Based on calsses available in database and matches each to its id.
// let neighborhoods = [];
// this.state.neighborhoods.forEach(neighborhood => {
//   let name = Object.keys(neighborhood)[0];
//   neighborhoods.push(<option
//     key={name}
//     value={neighborhood[name]}>
//     {name}
//     </option>
//   )
// })

// <p>Neighborhood</p>
// <select
// onChange={this.handleChange("neighborhood")}
// value={this.state.neighborhood} >
// {neighborhoods}
// </select>
