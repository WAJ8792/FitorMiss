import React from 'react';

export default class AddressField extends React.Component {
  render() {
    console.log(this.props.value);
    return (
      <div id="vendor-mgmt-pricing-tier">
        <p>{this.props.field}</p>
        <input type="text"
          value={this.props.value}
          onChange={e => this.props.handleChange(e, this.props.field)} />
      </div>
    )
  }
}
