import React from 'react';

export default class SignupVendor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      gymName: "",
      neighborhood: "",
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
    return e => this.setState({[field]: e.target.value})
  }


  handleSignup(e) {
    e.preventDefault();
    this.props.signupVendor(this.state, app);
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
    });

    return (
      <div className="signup-container">
        <section className="session-block">
          <div>
          <div>
            <h4>Sign up as a vendor!</h4>

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

            <input
              type="text"
              value={this.state.gymName}
              placeholder="Your Gym's Name"
              onChange={this.handleChange("gymName")}/>
            <p>Neighborhood</p>
            <select onChange={this.handleChange("neighborhood")}>
              {neighborhoods}
            </select>
            <button onClick={e => this.handleSignup(e)}>Signup</button>
          </div>
          </div>
        </section>
      </div>
    )
  }
}
