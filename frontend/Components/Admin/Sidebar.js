import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export default class Sidebar extends Component {
  constructor() {
    super()
    this.dropDown = this.dropDown.bind(this);
    this.state = {
      accounts: "selectors-up",
      billing: "selectors-up",
    }
  }

  dropDown(e, field) {
    e.preventDefault();
    let selectors = (this.state[field] === "selectors-down") ? "selectors-up" : "selectors-down";
    this.setState({[field]: selectors});
  }

  render() {
    
    return (
      <section className="sidebar">
        <ul className="outer-list">
          <li onClick={e => this.dropDown(e, 'accounts')} >Account

            <ul className={this.state.accounts}>
              <li><Link to="/edit">Edit MyGym</Link></li>
              <li><Link to="/account">Edit Acount</Link></li>
            </ul>
          </li>

          <li onClick={e => this.dropDown(e, 'billing')} >Billing

            <ul className={this.state.billing}>
              <li><Link to="/billing">Billing & Payment</Link></li>
              <li><Link to="/billing-history">Billing History</Link></li>
            </ul>
          </li>

        </ul>
      </section>
    )
  }
}
