import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewVendorForm from './new_vendor_form.js';

export default class ManageAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedOut: false,
      newVendorInfo: {
        gym_name: "",
        email: "",
        neighborhood: "Flatiron"
      }
    }
    this.logout = this.logout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("Submitted info", this.state.newVendorInfo);
  }

  handleChange(e, field) {
    console.log(field, e.target.value);
    this.setState({
      newVendorInfo: {
        ...this.state.newVendorInfo,
        [field]: e.target.value
      }
    })
  }

  logout() {
    this.props.logout({
        uid: 'ZXIWqUSTpPSd6BTVUu3kf0Rbqhf1',
        email: 'fitormissco@gmail.com'
      }, app);
    this.setState({loggedOut: true});
  }

  render() {
    if (this.state.loggedOut) { return <Redirect to="/signin" /> }

    return (
      <div>
        <span>
          <div onClick={this.logout}>logout</div>
        </span>
        <h1>Create a new vendor</h1>
        <div>
          <NewVendorForm
            vendor={this.state.newVendorInfo}
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange} />
        </div>
      </div>
    )
  }
}
