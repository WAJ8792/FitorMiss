import React from 'react';

export default class Amenities extends React.Component {
  constructor(props) {
    super(props);
  }

  getAmenities() {
    let amenities = [
      "Parking",
      "Mat Rentals",
      "Showers",
      "Lockers",
      "Towels",
    ]
    let list = this.props.amenities;

    let amenityOptions = [];

    amenities.forEach( amenity => {
      let field = this.getField(amenity)
      amenityOptions.push(
        <Amenity
          key={amenity}
          handleChoose={this.props.handleChoose}
          amenity={amenity}
          field={field}
          checked={this.props.amenities[field]}
          />
      )
    });

    return amenityOptions;
  }

  getField(amenity) {
    switch (amenity) {
      case "Parking":
        return "parking";
      case "Mat Rentals":
        return "mat_rentals";
      case "Showers":
        return "showers";
      case "Lockers":
        return "lockers";
      case "Towels":
        return "towels";
    }
  }

  render() {
    let amenities = this.getAmenities();
    return(<div>
      {amenities}
      </div>
    )
  }
}

class Amenity extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let style = "unchecked";

    if (this.props.checked === true) {
      style = "checked";
    }

    return (
      <div style={{display: 'flex'}}
        onClick={e => this.props.handleChoose(e, this.props.field)}>

        <p className={style}> </p>
        <p>{this.props.amenity}</p>
      </div>
    )
  }
}
