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
    // app.database().ref('amenities').orderByChild('vendor_id')
    // .equalTo(vendor.toString()).on('value', snap => {
    //   if (snap.val() != null) {
    //     const amenities = snap.val()[Object.keys(snap.val())[0]];
    //     this.filterClass(amenities);
    //   }
    // });
  }

  filterClass(classAtts) {
    // classAtts[this.props.thisClass.type] = true;
    // const filters = this.props.filters;
    // const filteredOut = Object.keys(filters).some(key => {
    //   const filter = filters[key];
    //   return Object.keys(filter).some( value => {
    //     if (filter[value] && !classAtts[value]) {
    //       return true;
    //     } else { return false; }
    //   });
    // })
    // console.log(filteredOut);
    // this.setState({filteredOut});
  }

  getDiscountPercent(price) {
    const listPrice = parseInt(this.state.pricing[3]);
    price = parseInt(price);

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

  render() {
    if (this.state.filteredOut) {
      return null;
    }

    const thisClass = this.props.thisClass;
    const vendor = this.state.vendorInfo;
    const address = this.state.address;
    if (indexOfDay(thisClass.day) === new Date().getDay()) {
      thisClass.price = this.state.pricing[getHoursOut(thisClass.time)];
    } else { thisClass.price = this.state.pricing[3]}
    let time = getTimeRange(thisClass.time, thisClass.duration);

    return (
      <section className="class-info">
        <div>
          <h5 style={{color: '#1ed0b1'}}>{time}</h5>
          <p>{thisClass.date.slice(0, 6)}</p>
        </div>

        <div>
          <h5 style={{color: '#1ed0b1'}}>{vendor.gym_name}</h5>
          <p>{address.street}</p>
        </div>

        <div>
          <h5>{vendor.neighborhood}</h5>
        </div>

        <div>
          <h5>{thisClass.name}</h5>
          <p>{thisClass.type}</p>
        </div>

        <div>
          <button onClick={() => this.props.handleReserve(thisClass)}>
            ${thisClass.price}
          </button>
          <p id="discount">{this.getDiscountPercent(thisClass.price)}</p>
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
