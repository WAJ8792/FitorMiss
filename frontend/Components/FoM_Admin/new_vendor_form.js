import React from 'react';

export default class NewVendorForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div>
          <div>
            <input type="text"
              value={this.props.vendor.gym_name}
              placeholder="Gym Name"
              onChange={ e => this.props.handleChange(e, "gym_name")} />
            <br />

            <input type="text"
              value={this.props.vendor.email}
              placeholder="Email"
              onChange={ e => this.props.handleChange(e, "email")} />
            <br />

            <input type="text"
              value={this.props.vendor.neighborhood} />
            <br />

          </div>

          <div>
            {this.props.amenities}
          </div>
        </div>

        <input type="submit" value="Submit" />

      </form>
    )
  }
}
