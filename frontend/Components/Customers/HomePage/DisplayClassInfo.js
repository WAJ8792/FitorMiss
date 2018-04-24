import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  getTimeRange,
  getHoursOut,
  indexOfDay,
  } from '../../../util/time_and_date_util';

class DisplayClassInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pricing: [],
      vendorInfo: {
        email: null,
        gym_name: null,
        neighborhood: null,
      },
      address: {
        street: "",
        city: "",
        state: "",
      },
      filteredOut: false,
    }
  }

  componentDidMount() {
    const thisClass = this.props.thisClass;
    if (thisClass.vendor_id) {
      this.getPricingSchema(thisClass.vendor_id);
      this.getVendorInfo(thisClass.vendor_id);
    }
  }

  getVendorInfo(vendor) {
    app.database().ref("vendor")
    .orderByKey().equalTo(vendor).on('value', snap => {
      if (snap.val() != null) {
        let vendorInfo = snap.val()[vendor];
        this.fetchAmenities(vendor);
        this.fetchAddress(vendor);
        this.setState({vendorInfo});
      } else {
        this.setState({filteredOut: true});
      }
    })
  }

  fetchAddress(vendor) {
    firebase.database().ref("address")
    .orderByChild("vendor_id").equalTo(vendor).on('value', snap => {
      if (snap.val() != null) {
        const address = snap.val()[Object.keys(snap.val())[0]];
        this.setState({address});
      }
    })
  }

  fetchAmenities(vendor) {
    app.database().ref('amenities').orderByChild('vendor_id')
    .equalTo(vendor.toString()).on('value', snap => {
      if (snap.val() != null) {
        const amenities = snap.val()[Object.keys(snap.val())[0]];
      }
    });
  }

  getDiscountPercent(price) {
    const listPrice = parseInt(this.state.pricing[3]);
    price = parseInt(price);
    if (isNaN(price) || isNaN(listPrice)) {return null;}

    if (price === listPrice) { return null; }
    const discount = Math.round(((listPrice - price) / listPrice) * 100);
    return `${discount}% off`
  }


  getPricingSchema(vendor) {
    let pricing = [];

    app.database().ref('pricing_schemas')
    .orderByChild('vendor_id').equalTo(vendor).on('value', snap => {
      if (snap.val() != null) {
        snap.forEach(child => {
          pricing.push(child.val()['tier1']);
          pricing.push(child.val()['tier2']);
          pricing.push(child.val()['tier3']);
          pricing.push(child.val()['tier4']);
        })
      } else {
        this.setState({ filteredOut: true })
      }
      this.setState({pricing});
    });
  }

  insertVendorInfo(thisClass) {
    const c = {
      amenities: thisClass.amenities,
      created_at: new Date().getTime(),
      day: thisClass.day,
      duration: thisClass.duration,
      max: thisClass.max,
      name: thisClass.name,
      neighborhood: thisClass.neighborhood,
      neighborhood_id: parseInt(thisClass.neighborhood_id),
      seats: thisClass.booking.webCapacity,
      time: thisClass.time,
      type: thisClass.type,
      description: thisClas.description,
      vendor: thisClass.vendor,
      vendor_id: thisClass.vendor_id
    }
    if (this.state.vendorInfo.service_id) {
      thisClass.serviceId = this.state.vendorInfo.service_id;
    }
    thisClass.classInfo = c;
    this.props.openModal(thisClass);
  }

  getDiscount(price) {
    if (this.props.discount) {
      return Math.round(price - (price * this.props.discount));
    } else { return price; }
  }

  render() {
    if (this.state.filteredOut) {
      return null;
    }
    const thisClass = this.props.thisClass;
    const vendor = this.state.vendorInfo;
    const address = this.state.address;
    if (indexOfDay(thisClass.day) === new Date().getDay()) {
      thisClass.price = this.getDiscount(this.state.pricing[getHoursOut(thisClass.time)]);
    } else { thisClass.price = this.getDiscount(this.state.pricing[3])}
    let time = getTimeRange(thisClass.time, thisClass.duration);

    return (
      <section className="class-info">
        <div>
          <h5 style={{color: '#1ed0b1'}}>{time}</h5>
          <p>{thisClass.date.slice(0, 6)}</p>
        </div>

        <div>
          <h5 style={{color: '#1ed0b1'}}>{vendor.gym_name}</h5>
          <p onClick={ () => this.props.openModal(thisClass, 'info')}
            style={{cursor: 'pointer', fontWeight: '500',
                    color: '#272b40', letterSpacing: '.5px'}}>
            More Info
          </p>
        </div>

        <div>
          <h5>{vendor.neighborhood}</h5>
          <p>{address.street}</p>
        </div>

        <div>
          <h5>{thisClass.name}</h5>
          <p>{thisClass.type}</p>
        </div>

        <div>
          <button onClick={() => {
            if (thisClass.id.includes('mindbody')) {
              this.insertVendorInfo(thisClass);
            } else {
              this.props.openModal(thisClass);
            }
          }}>
            ${thisClass.price}
          </button>
          <h5 id="discount">{this.getDiscountPercent(thisClass.price)}</h5>
        </div>
      </section>
    )
  }
}

const mapStateToProps = ( state ) => ({
  filters: state.filters
});

export default withRouter(connect(
  mapStateToProps
)(DisplayClassInfo));
