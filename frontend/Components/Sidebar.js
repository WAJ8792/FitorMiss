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
    let list1, list2;
    if (this.props.location.pathname.includes('customer')) {
      list1 = (
        <li onClick={e => this.dropDown(e, 'accounts')} >Account
          <ul className={this.state.accounts}>
            <li><Link to="/customer/account">Edit Acount</Link></li>
          </ul>
        </li>)
      list2 = (
        <li onClick={e => this.dropDown(e, 'billing')} >Billing

          <ul className={this.state.billing}>
            <li><Link to="/customer/billing">Billing & Payment</Link></li>
            <li><Link to="/customer/billing-history">Billing History</Link></li>
          </ul>
        </li>
      )
    } else {
      list1 = (
        <li onClick={e => this.dropDown(e, 'accounts')} >Account

          <ul className={this.state.accounts}>
            <li><Link to="/admin/edit">Edit MyGym</Link></li>
            <li><Link to="/admin/account">Edit Acount</Link></li>
          </ul>
        </li>
      );
      list2 = (
        <li onClick={e => this.dropDown(e, 'billing')} >Billing

          <ul className={this.state.billing}>
            <li><Link to="/admin/billing">Billing & Payment</Link></li>
            <li><Link to="/admin/billing-history">Billing History</Link></li>
          </ul>
        </li>
      );
    }

    return (
      <section className="sidebar">
        <ul className="outer-list">

        {list1}
        {list2}

        </ul>
      </section>
    )
  }
}
