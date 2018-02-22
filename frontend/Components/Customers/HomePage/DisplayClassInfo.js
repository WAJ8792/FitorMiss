import React from 'react';

import { getTimeRange, getHoursOut,  } from '../../../util/classes_util';

export default class DisplayClassInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pricing: null,
    }
  }

  componentDidMount() {
    this.getPricingSchema(this.props.thisClass.vendor_id);
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
          pricing.push('40');
        })
      }
      this.setState({pricing});
    });
  }

  render() {
    let thisClass = this.props.thisClass;
    let time = getTimeRange(thisClass.time, thisClass.duration);
    let hoursOut;
    let price;

    if (this.props.day === 'Tomorrow') {
      hoursOut = 3;
    } else {
      hoursOut = getHoursOut(thisClass.time);
    }

    if (this.state.pricing != null && this.state.pricing.length > 1) {
      price = this.state.pricing[hoursOut];
    } else { price = ""}

    return (
      <section className="class-info">
        <div>
          <h5 style={{color: '#1ed0b1'}}>{time}</h5>
          <p>{thisClass.date.slice(0, 6)}</p>
        </div>

        <div>
          <h5 style={{color: '#1ed0b1'}}>{thisClass.vendor}</h5>
          <p>Class description</p>
        </div>

        <div>
          <h5>{thisClass.neighborhood}</h5>
        </div>

        <div>
          <h5>{thisClass.name}</h5>
        </div>

        <div>
          <button onClick={() => this.props.handleReserve(thisClass)}>
            ${price}
          </button>
        </div>
      </section>
    )
  }
}
