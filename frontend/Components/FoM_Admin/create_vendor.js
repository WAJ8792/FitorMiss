import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewVendorForm from './new_vendor_form.js';
import Amenity from './amenity';
import Tier from './pricing_tier';

import createNewVendor from '../../util/vendor_util';

export default class ManageAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedOut: false,
      errors: [],
      newVendorInfo: {
        gym_name: "",
        email: "",
        password: "",
        neighborhood: "Flatiron",
        amenities: {
          parking: false,
          mat_rentals: false,
          showers: false,
          lockers: false,
          towels: false
        },
        pricing_schema: {
          tier1: "",
          tier2: "",
          tier3: "",
          tier4: ""
        }
      }
    }
    this.logout = this.logout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChoose = this.handleChoose.bind(this);
    this.handleTierChange = this.handleTierChange.bind(this);
    this.invalidInput = this.invalidInput.bind(this);
  }

  handleSubmit(e) {
    this.props.signupVendor(this.state.newVendorInfo, app);
    this.setState({
      newVendorInfo: {
        gym_name: "",
        email: "",
        neighborhood: "Flatiron",
        amenities: { parking: false, mat_rentals: false, showers: false, lockers: false, towels: false },
        pricing_schema: {tier1: "", tier2: "", tier3: "", tier4: "" }
      }
    })
  }

  handleChange(e, field) {
    this.setState({
      newVendorInfo: {
        ...this.state.newVendorInfo,
        [field]: e.target.value
      }
    })
  }

  handleTierChange(e, tier) {
    if (this.invalidInput(e.target.value, 'tier')) { return; }
    this.setState({
      newVendorInfo: {
        ...this.state.newVendorInfo,
        pricing_schema: {
          ...this.state.newVendorInfo.pricing_schema,
          [tier]: e.target.value
        }
      }
    })
  }

  handleChoose(e, amenity) {
    const amenities = this.state.newVendorInfo.amenities;
    const toggle = (amenities[amenity]) ? false : true
    this.setState({
      newVendorInfo: {
        ...this.state.newVendorInfo,
        amenities: {
          ...this.state.newVendorInfo.amenities,
          [amenity]: toggle
        }
      }
    })
  }

  invalidInput(input, fieldType) {
    const errors = [];
    switch (fieldType) {
      case 'tier':
        if (isNaN(input)) {
          errors.push("Tier fields only accept number inputs as a value");
        }
    }
    if (errors.length === 0) {
      this.setState({errors});
      return false;
    }
    else {
      this.setState({errors});
      return true;
    }
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
    const vendor = this.state.newVendorInfo;
    const amenities = [];
    const pricingSchema = Object.keys(vendor.pricing_schema).map(tier =>
      <Tier
        key={tier}
        handleChange={this.handleTierChange}
        tier={tier}
        value={vendor.pricing_schema[tier]} />
    )
    for (let amenity in vendor.amenities) {
      amenities.push(
        <Amenity
          key={amenity}
          handleChoose={this.handleChoose}
          amenity={amenity}
          amenityPrinted={getPrintableAmenity(amenity)}
          checked={vendor.amenities[amenity]} />
      )
    }

    return (
      <div>
        <span>
          <div onClick={this.logout}>logout</div>
        </span>
        <h1>Create a new vendor</h1>
        {this.state.errors}
        <div>
          <NewVendorForm
            vendor={vendor}
            amenities={amenities}
            pricingSchema={pricingSchema}
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange} />
        </div>
      </div>
    )
  }
}

function getPrintableAmenity(amenity) {
  switch (amenity) {
    case 'parking':
      return 'Parking';
    case 'mat_rentals':
      return 'Mat Rentals';
    case 'lockers':
      return 'Lockers';
    case 'towels':
      return 'Towels';
    case 'showers':
      return 'Showers';
  }
}
