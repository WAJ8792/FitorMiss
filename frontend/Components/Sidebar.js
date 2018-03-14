import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import { TypeFilter, AmenityFilter } from './Customers/Filters';

export default class Sidebar extends Component {
  constructor() {
    super()
    this.dropDown = this.dropDown.bind(this);
    this.state = {
      list1: "selectors-up",
      list2: "selectors-up",
      list3: "selectors-up"
    }
  }

  dropDown(e, field) {
    e.preventDefault();
    let selectors = (this.state[field] === "selectors-down") ? "selectors-up" : "selectors-down";
    this.setState({[field]: selectors});
  }

  render() {
    let list1, list2, list3, listHeader;
    if (this.props.location.pathname.includes('customer/classes')) {
      listHeader = ( <div id="side-link">
          <li id="filter-header">Search by:</li>
        </div>
      )
      list1 = ( <div id="side-link">
          <li
            onClick={e => this.dropDown(e, 'list1')}
            style={{
              color: '#f0efef7d',
              cursor: 'default'
            }}>My Location
          </li>
        </div>
      )
      list2 = <AmenityFilter
        dropDown={this.dropDown}
        state={this.state}
        filters={this.props.filters}
        toggleAmenities={this.props.toggleAmenities} />

      list3 = <TypeFilter
        dropDown={this.dropDown}
        state={this.state}
        filters={this.props.filters}
        toggleType={this.props.toggleType} />


    }
    else if (this.props.location.pathname.includes('customer')) {
      list1 = (
        <div id="side-link">
        <li onClick={e => this.dropDown(e, 'list1')} >Account
          <ul className={this.state.list1}>
            <li><Link to="/customer/account">Edit Acount</Link></li>
          </ul>
        </li>
      </div>
      )
      list2 = (
        <div id="side-link">
        <li onClick={e => this.dropDown(e, 'list2')} >Billing

          <ul className={this.state.list2}>
            <li><Link to="/customer/billing">Billing & Payment</Link></li>
            <li><Link to="/customer/billing-history">Billing History</Link></li>
          </ul>
        </li>
        </div>
      )
    } else {
      list1 = (
        <div id="side-link">
        <li onClick={e => this.dropDown(e, 'list1')} >Account

          <ul className={this.state.list1}>
            <li><Link to="/admin/edit">Edit MyGym</Link></li>
            <li><Link to="/admin/account">Edit Acount</Link></li>
          </ul>
        </li>
        </div>
      );
    }

    return (
      <section className="sidebar-container">

        <section className="sidebar">
          <ul className="outer-list">

          {listHeader}
          {list1}
          {list2}
          {list3}

          </ul>
        </section>

      </section>
    )
  }
}
