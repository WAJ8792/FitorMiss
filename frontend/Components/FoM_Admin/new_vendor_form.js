import React from 'react';

export default class NewVendorForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>

        <input type="text"
          value={this.props.vendor.gym_name}
          placeholder="Gym Name"
          onChange={ e => this.props.handleChange(e, "gym_name")} />

        <input type="text"
          value={this.props.vendor.email}
          placeholder="Email"
          onChange={ e => this.props.handleChange(e, "email")} />

        <input type="text"
          value={this.props.vendor.neighborhood} />

        <input type="submit" value="Submit" />

      </form>
    )
  }
}
