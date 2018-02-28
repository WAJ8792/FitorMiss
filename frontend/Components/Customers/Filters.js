import React from 'react';

export class TypeFilter extends React.Component {

  getTypeFilters() {
    let listItems = [];
    let types = this.props.filters.workoutType;
    Object.keys(types).forEach( type => {
      if (types[type] === true) {
        listItems.push(
          <li
            key={type}
            style={{color: '#f374f3'}}
            onClick={() => this.changeFilter(type)}>
            {type}
          </li>
          )
      } else {
        listItems.push(<li
          key={type}
          onClick={() => this.changeFilter(type)}
          >{type}</li>)
      }
    })
    return listItems
  }

  changeFilter(type) {
    this.props.toggleType(type);
  }

  // printedItem(type) {
  //   switch (type) {
  //     case "cardio":
  //       return "Cardio";
  //     case "boxing":
  //       return "Boxing";
  //     case "rowing":
  //       return "Rowing";
  //     case "yoga":
  //       return "Yoga";
  //     case "pilates":
  //       return 'Pilates';
  //   }
  // }

  render() {
    let listItems = this.getTypeFilters();
    return(
      <div id="side-link">
      <li>
        <h3 onClick={e => this.props.dropDown(e, 'list3')}>Workout Type</h3>
        <ul className={this.props.state.list3}>
          {listItems}
        </ul>
      </li>
    </div>
    )
  }
}

export class AmenityFilter extends React.Component {

  getTypeFilters() {
    let listItems = [];
    let amenities = this.props.filters.amenities;
    Object.keys(amenities).forEach( amenity => {
      let item = this.printedItem(amenity);
      if (amenities[amenity] === true) {
        listItems.push(
          <li
            key={amenity}
            style={{color: '#f374f3'}}
            onClick={() => this.changeFilter(amenity)}>
            {item}
          </li>
          )
      } else {
        listItems.push(<li
          key={amenity}
          onClick={() => this.changeFilter(amenity)}
          >{item}</li>)
      }
    })
    return listItems
  }

  changeFilter(type) {
    this.props.toggleAmenities(type);
  }

  printedItem(type) {
    switch (type) {
      case "parking":
        return "Parking";
      case "showers":
        return "Showers";
      case "lockers":
        return "Lockers";
      case "towels":
        return "Towels";
      case "mat_rentals":
        return "Mat Rentals";
    }
  }

  render() {
    let listItems = this.getTypeFilters();
    return(
      <div id="side-link">
      <li>
        <h3 onClick={e => this.props.dropDown(e, 'list2')}>Amenities</h3>
        <ul className={this.props.state.list2}>
          {listItems}
        </ul>
      </li>
    </div>
    )
  }
}
