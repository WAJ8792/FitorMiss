import React from 'react';

export default class Tier extends React.Component {
  render() {
    return (
      <div id="vendor-mgmt-pricing-tier">
        <p>{this.props.tier}</p>
        <input type="text"
          value={this.props.value}
          onChange={e => this.props.handleChange(e, this.props.tier)} />
      </div>
    )
  }
}
