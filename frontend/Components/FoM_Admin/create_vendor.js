import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewVendorForm from './new_vendor_form.js';
import Amenity from './amenity';

export default class ManageAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedOut: false,
      newVendorInfo: {
        gym_name: "",
        email: "",
        neighborhood: "Flatiron",
        amenities: {
          parking: false,
          mat_rentals: false,
          showers: false,
          lockers: false,
          towels: false
        }
      }
    }
    this.logout = this.logout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChoose = this.handleChoose.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("Submitted info", this.state.newVendorInfo);
  }

  handleChange(e, field) {
    this.setState({
      newVendorInfo: {
        ...this.state.newVendorInfo,
        [field]: e.target.value
      }
    })
  }

  handleChoose(e, amenity) {
    console.log(amenity);
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

  logout() {
    this.props.logout({
        uid: 'ZXIWqUSTpPSd6BTVUu3kf0Rbqhf1',
        email: 'fitormissco@gmail.com'
      }, app);
    this.setState({loggedOut: true});
  }

  render() {
    console.log(this.state.newVendorInfo.amenities);

    if (this.state.loggedOut) { return <Redirect to="/signin" /> }

    const vendor = this.state.newVendorInfo;
    const amenities = [];
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
        <div>
          <NewVendorForm
            vendor={vendor}
            amenities={amenities}
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
    case 'shower':
      return 'Showers';
  }
}
